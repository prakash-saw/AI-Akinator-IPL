import express from 'express'
import axios from 'axios'

const router = express.Router()

const MAX_QUESTIONS = Number(process.env.MAX_QUESTIONS) || 8
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

const systemPrompt = `You are an elite AI Cricket Expert playing a game to guess the IPL player the user is thinking of. Respond only with valid JSON: {\n  \"type\": \"question\"|\"guess\",\n  \"text\": \"...\",\n  \"reasoning\": \"...\",\n  \"confidence\": 0\n}`

router.post('/next', async (req, res) => {
  const history = req.body?.history || []
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    const idx = Math.min(history.length, DEFAULT_QUESTIONS.length - 1)
    if (history.length < MAX_QUESTIONS) {
      return res.json({
        type: 'question',
        text: DEFAULT_QUESTIONS[idx],
        reasoning: 'Fallback question from static list to continue the game without AI',
        confidence: 20 + Math.min(40, idx * 5)
      })
    }

    return res.json({
      type: 'guess',
      text: 'Unable to produce a confident guess without the AI service. Please enable `GEMINI_API_KEY` on the server for accurate results.',
      reasoning: 'Fallback reached maximum question limit',
      confidence: 30
    })
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: 'Proceed based on system instructions.' }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { responseMimeType: 'application/json' }
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    const response = await axios.post(url, payload, { headers: { 'Content-Type': 'application/json' } })

    const textResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text
    if (!textResponse) throw new Error('No AI text response')

    const parsed = JSON.parse(textResponse)
    return res.json(parsed)
  } catch (err) {
    console.error('AI proxy error', err?.response?.data || err.message || err)
    return res.status(500).json({ error: 'AI backend error' })
  }
})

export default router
