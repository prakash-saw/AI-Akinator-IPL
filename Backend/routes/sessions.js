import express from 'express'
import Session from '../models/Session.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const session = new Session(req.body)
    await session.save()
    res.json(session)
  } catch (err) {
    console.error('Session save error', err)
    res.status(500).json({ error: 'Could not save session' })
  }
})

export default router
