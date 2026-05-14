import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import axios from 'axios'
import LearningStats from '../models/LearningStats.js'

const router = express.Router()

const MAX_QUESTIONS = Number(process.env.MAX_QUESTIONS) || 8
const CONFIDENCE_THRESHOLD = Number(process.env.CONFIDENCE_THRESHOLD) || 0.8

// Questions mapped to attribute keys (must match players.json keys)
const ATTRIBUTES = [
  'primarily_batsman',
  'primarily_bowler',
  'allrounder',
  'ever_captained',
  'finisher',
  'represented_national_team',
  'bowls_spin',
  'single_franchise'
]

const DEFAULT_QUESTIONS = [
  'Is the player primarily a batsman?',
  'Is the player primarily a bowler?',
  'Does the player often play as an all-rounder?',
  'Has the player ever captained an IPL side?',
  'Is the player known for finishing matches (finisher)?',
  'Has the player represented the national team?',
  'Does the player bowl spin rather than pace?',
  'Is the player associated with a single IPL franchise for most of their career?'
]

// Resolve dataset path relative to this file
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const playersFile = path.join(__dirname, '..', 'data', 'players.json')

let PLAYERS = []
try {
  const txt = fs.readFileSync(playersFile, 'utf8')
  PLAYERS = JSON.parse(txt)
} catch (err) {
  console.warn('Could not load players.json — AI engine will be limited', err.message)
}

function answerLikelihood(attrValue, answer) {
  if (answer === 'Yes') return attrValue ? 0.9 : 0.05
  if (answer === 'No') return attrValue ? 0.05 : 0.9
  if (answer === 'Probably') return attrValue ? 0.7 : 0.2
  return 0.5 // "Don't Know" or others
}

function entropy(dist) {
  const eps = 1e-12
  return -dist.reduce((s, p) => s + (p > 0 ? p * Math.log2(p + eps) : 0), 0)
}

async function computePriors() {
  const priors = {}
  const totalPlayers = PLAYERS.length || 1
  for (const p of PLAYERS) priors[p.name] = 1 / totalPlayers

  try {
    const stats = await LearningStats.find({}).lean()
    if (!stats || stats.length === 0) return priors

    let totalPlays = 0
    const playsMap = new Map()
    for (const s of stats) {
      playsMap.set(s.name, s.plays || 0)
      totalPlays += (s.plays || 0)
    }
    if (totalPlays === 0) return priors

    for (const p of PLAYERS) {
      const plays = playsMap.get(p.name) || 0
      priors[p.name] = (plays + 1) / (totalPlays + totalPlayers)
    }
    const sum = Object.values(priors).reduce((a, b) => a + b, 0) || 1
    for (const k of Object.keys(priors)) priors[k] /= sum
  } catch (err) {
    console.warn('computePriors error', err.message)
  }

  return priors
}

function mapQuestionToAttribute(questionText) {
  const idx = DEFAULT_QUESTIONS.indexOf(questionText)
  if (idx >= 0) return ATTRIBUTES[idx]
  return null
}

router.post('/next', async (req, res) => {
  const history = req.body?.history || []

  if (!PLAYERS || PLAYERS.length === 0) {
    const idx = Math.min(history.length, DEFAULT_QUESTIONS.length - 1)
    if (history.length < MAX_QUESTIONS) {
      return res.json({ type: 'question', text: DEFAULT_QUESTIONS[idx], attribute: ATTRIBUTES[idx], reasoning: 'Fallback: players dataset not available', confidence: 20 })
    }
    return res.json({ type: 'guess', text: 'Unknown', reasoning: 'Fallback reached max questions', confidence: 30 })
  }

  try {
    const priors = await computePriors()

    // compute posterior
    const players = PLAYERS.map(p => ({ ...p }))
    let posterior = []
    for (const p of players) {
      let score = priors[p.name] || (1 / players.length)
      for (const h of history) {
        const attrKey = h.attribute || mapQuestionToAttribute(h.question)
        if (!attrKey) continue
        const attrVal = Boolean(p[attrKey])
        score *= answerLikelihood(attrVal, h.answer)
      }
      posterior.push({ name: p.name, score })
    }
    const total = posterior.reduce((s, x) => s + x.score, 0) || 1
    posterior = posterior.map(p => ({ name: p.name, prob: p.score / total }))
    posterior.sort((a, b) => b.prob - a.prob)

    const currentEntropy = entropy(posterior.map(p => p.prob))
    const top = posterior[0]

    if (top && top.prob >= CONFIDENCE_THRESHOLD && history.length < MAX_QUESTIONS) {
      return res.json({ type: 'guess', text: top.name, confidence: Math.round(top.prob * 100), reasoning: `Top posterior ${Math.round(top.prob * 100)}%` })
    }

    // select attribute by expected information gain
    const askedAttrs = new Set(history.map(h => h.attribute || mapQuestionToAttribute(h.question)).filter(Boolean))
    const candidateAttrs = ATTRIBUTES.filter(a => !askedAttrs.has(a))
    let best = null
    for (const attr of candidateAttrs) {
      const answers = ['Yes', 'No', "Don't Know", 'Probably']
      let expectedEntropy = 0
      for (const ans of answers) {
        let pAns = 0
        for (const pl of players) {
          const plProb = posterior.find(x => x.name === pl.name)?.prob || 0
          pAns += plProb * answerLikelihood(Boolean(pl[attr]), ans)
        }
        if (pAns <= 0) continue

        let postAfter = []
        for (const pl of players) {
          const plPrior = posterior.find(x => x.name === pl.name)?.prob || 0
          const like = answerLikelihood(Boolean(pl[attr]), ans)
          postAfter.push({ name: pl.name, score: plPrior * like })
        }
        const sumAfter = postAfter.reduce((s, x) => s + x.score, 0) || 1
        postAfter = postAfter.map(p => ({ name: p.name, prob: p.score / sumAfter }))
        const h = entropy(postAfter.map(p => p.prob))
        expectedEntropy += pAns * h
      }

      const infoGain = currentEntropy - expectedEntropy
      if (!best || infoGain > best.infoGain) best = { attr, infoGain }
    }

    if (!best) {
      return res.json({ type: 'guess', text: top.name, confidence: Math.round(top.prob * 100), reasoning: 'No informative attribute left' })
    }

    const idx = ATTRIBUTES.indexOf(best.attr)
    const questionText = DEFAULT_QUESTIONS[idx] || `Is the player ${best.attr.replace(/_/g, ' ')}?`

    // Optionally rephrase question with an LLM if keys are provided.
    // Supports GOOGLE GEMINI via GEMINI_API_KEY and OpenAI via OPENAI_API_KEY as a fallback.
    const geminiKey = process.env.GEMINI_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    // Helper to trim and return LLM response
    const tryReturn = (text) => {
      if (text && typeof text === 'string') {
        return res.json({ type: 'question', text: text.trim(), attribute: best.attr, reasoning: `Selected to maximize information gain (${best.infoGain.toFixed(3)})`, confidence: Math.round((top?.prob || 0) * 100) })
      }
      return null
    }

    // If OpenAI key present, try it first (safer for many users)
    if (openaiKey) {
      try {
        const payload = {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Rephrase as a short conversational question: ${questionText}` }],
          max_tokens: 60,
          temperature: 0.2
        }
        const oresp = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${openaiKey}` } })
        const otext = oresp.data?.choices?.[0]?.message?.content
        if (tryReturn(otext)) return
      } catch (e) {
        console.warn('OpenAI rephrase failed:', e.response?.status, e.message)
      }
    }

    // Try Gemini key if present and not a placeholder
    if (geminiKey && !/^your[-_]/i.test(geminiKey)) {
      try {
        const payload = {
          contents: [{ parts: [{ text: `Rephrase as a short conversational question: ${questionText}` }] }]
        }
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`
        const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } })
        const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (tryReturn(textResponse)) return
      } catch (e) {
        console.warn('Gemini rephrase failed:', e.response?.status, e.response?.data || e.message)
        // If 404 specifically, log a hint for users
        if (e.response?.status === 404) console.warn('Gemini model not found or API endpoint incorrect. Check GEMINI_API_KEY and model access.')
      }
    } else if (geminiKey) {
      console.warn('GEMINI_API_KEY looks like a placeholder — skipping remote rephrase.')
    }

    return res.json({ type: 'question', text: questionText, attribute: best.attr, reasoning: `Selected to maximize information gain (${best.infoGain.toFixed(3)})`, confidence: Math.round((top?.prob || 0) * 100) })
  } catch (err) {
    console.error('AI engine error', err)
    return res.status(500).json({ error: 'AI engine error' })
  }
})

export default router
