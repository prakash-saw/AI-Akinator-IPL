import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import aiRoutes from './routes/ai.js'
import sessionsRoutes from './routes/sessions.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

connectDB()
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error', err))

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/sessions', sessionsRoutes)

// Start server with retry when port is in use
async function startServer(desiredPort) {
  let port = Number(desiredPort) || 5000
  const maxAttempts = 10

  for (let i = 0; i < maxAttempts; i++) {
    try {
      const server = await new Promise((resolve, reject) => {
        const s = app.listen(port, () => resolve(s))
        s.on('error', (err) => reject(err))
      })

      console.log(`Backend listening on http://localhost:${port}`)

      // Graceful shutdown handlers
      const shutdown = () => {
        console.log('Shutting down server...')
        server.close(() => process.exit(0))
      }
      process.on('SIGINT', shutdown)
      process.on('SIGTERM', shutdown)

      return
    } catch (err) {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is in use, trying port ${port + 1}`)
        port += 1
        continue
      }
      console.error('Failed to start server:', err)
      process.exit(1)
    }
  }

  console.error(`Could not bind to a port after ${maxAttempts} attempts.`)
  process.exit(1)
}

startServer(PORT)
