import express from 'express'
import Session from '../models/Session.js'
import LearningStats from '../models/LearningStats.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const payload = req.body
    const session = new Session(payload)
    await session.save()

    // Learning update: increment plays/wins based on result structure
    try {
      const result = payload.result || {}
      // result may contain: { guess: 'Name', isCorrect: true/false, actual: 'Name' }
      if (result) {
        if (result.isCorrect && result.guess) {
          await LearningStats.findOneAndUpdate(
            { name: result.guess },
            { $inc: { plays: 1, wins: 1 } },
            { upsert: true, new: true }
          )
        } else if (!result.isCorrect) {
          // increment plays for guessed name
          if (result.guess) {
            await LearningStats.findOneAndUpdate(
              { name: result.guess },
              { $inc: { plays: 1 } },
              { upsert: true, new: true }
            )
          }
          // if actual provided, record it as a win
          if (result.actual) {
            await LearningStats.findOneAndUpdate(
              { name: result.actual },
              { $inc: { plays: 1, wins: 1 } },
              { upsert: true, new: true }
            )
          }
        }
      }
    } catch (learnErr) {
      console.error('Learning stats update failed', learnErr)
    }

    res.json(session)
  } catch (err) {
    console.error('Session save error', err)
    res.status(500).json({ error: 'Could not save session' })
  }
})

// GET / - fetch sessions (optionally filtered by ?user=USER_ID)
router.get('/', async (req, res) => {
  try {
    const user = req.query.user
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 500)
    const filter = {}
    if (user) filter.user = user

    const sessions = await Session.find(filter).sort({ createdAt: -1 }).limit(limit).lean()
    res.json(sessions)
  } catch (err) {
    console.error('Failed to fetch sessions', err)
    res.status(500).json({ error: 'Failed to fetch sessions' })
  }
})

export default router
