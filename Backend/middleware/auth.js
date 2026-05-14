import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'please-change-this-secret'

export default function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth) return res.status(401).json({ error: 'Unauthorized' })
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.id
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
