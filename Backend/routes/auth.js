import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import User from '../models/User.js'
import authMiddleware from '../middleware/auth.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'

// Mailer helper: prefer Gmail SMTP when properly configured, otherwise
// fall back to an Ethereal test account (development) so the app doesn't crash
// when credentials are missing or invalid. Use `nodemailer.getTestMessageUrl(info)`
// to preview messages from Ethereal.
let _mailer = null

async function getMailer() {
  if (_mailer) return _mailer

  // Try Gmail SMTP if credentials provided
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    const gmailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    })

    try {
      // verify connection/auth — if this fails we'll fall through
      await gmailTransport.verify()
      console.log('Mailer: using Gmail SMTP')
      _mailer = gmailTransport
      return _mailer
    } catch (err) {
      console.warn('Mailer: Gmail SMTP verify failed — falling back to test account', err.message)
    }
  }

  // Fall back to an Ethereal test account for development/testing
  try {
    const testAccount = await nodemailer.createTestAccount()
    const ethTransport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    })
    ethTransport._isEthereal = true
    ethTransport._testAccount = testAccount
    console.log('Mailer: using Ethereal test account (dev). Set GMAIL_USER/GMAIL_PASS to send real emails.')
    _mailer = ethTransport
    return _mailer
  } catch (err) {
    console.error('Mailer: failed to create Ethereal test account', err)
    throw err
  }
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing fields' })
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ error: 'User already exists' })
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = new User({ name, email, passwordHash: hash })
    await user.save()
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Register error', err)
    return res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' })
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' })
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Login error', err)
    return res.status(500).json({ error: 'Login failed' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('name email _id')
    if (!user) return res.status(404).json({ error: 'User not found' })
    return res.json({ user: { id: user._id, name: user.name, email: user.email } })
  } catch (err) {
    console.error('Auth me error', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Forgot password: send reset token to user's email
router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })
    const user = await User.findOne({ email })
    if (!user) {
      // Do not reveal that the email is not registered
      return res.json({ ok: true })
    }

    const token = crypto.randomBytes(20).toString('hex')
    user.resetToken = token
    user.resetExpires = Date.now() + 3600 * 1000 // 1 hour
    await user.save()

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetLink = `${frontendUrl}/reset.html?token=${token}`

    const mail = {
      to: user.email,
      from: process.env.GMAIL_USER || 'no-reply@local.dev',
      subject: 'Password reset for IPL Guesser',
      text: `You requested a password reset. Click the link or paste in your browser:\n\n${resetLink}\n\nIf you didn't request this, ignore this message.`
    }

    const transporter = await getMailer()
    try {
      const info = await transporter.sendMail(mail)
      // If using Ethereal (dev), log preview URL so developer can click it
      if (transporter._isEthereal) {
        const preview = nodemailer.getTestMessageUrl(info)
        console.log('Password reset email preview URL:', preview)
      }
      return res.json({ ok: true })
    } catch (sendErr) {
      console.error('Forgot password send error', sendErr)
      // If sending with Gmail failed due to auth, try a one-time Ethereal fallback
      if (!transporter._isEthereal) {
        try {
          const fallbackAccount = await nodemailer.createTestAccount()
          const fbTransport = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: { user: fallbackAccount.user, pass: fallbackAccount.pass }
          })
          const info2 = await fbTransport.sendMail(mail)
          const preview = nodemailer.getTestMessageUrl(info2)
          console.log('Password reset email preview URL (fallback):', preview)
          return res.json({ ok: true })
        } catch (fbErr) {
          console.error('Forgot password fallback failed', fbErr)
        }
      }
      return res.status(500).json({ error: 'Could not send reset email' })
    }
  } catch (err) {
    console.error('Forgot password error', err)
    return res.status(500).json({ error: 'Could not send reset email' })
  }
})

// Reset password with token
router.post('/reset', async (req, res) => {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' })
    const user = await User.findOne({ resetToken: token, resetExpires: { $gt: Date.now() } })
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' })
    const salt = await bcrypt.genSalt(10)
    user.passwordHash = await bcrypt.hash(password, salt)
    user.resetToken = undefined
    user.resetExpires = undefined
    await user.save()
    return res.json({ ok: true })
  } catch (err) {
    console.error('Reset password error', err)
    return res.status(500).json({ error: 'Could not reset password' })
  }
})

export default router
