import mongoose from 'mongoose'

const { Schema } = mongoose

const SessionSchema = new Schema({
  user: { type: String },
  history: { type: Array, default: [] },
  result: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Session || mongoose.model('Session', SessionSchema)
