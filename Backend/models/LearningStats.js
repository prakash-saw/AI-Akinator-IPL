import mongoose from 'mongoose'

const { Schema } = mongoose

const LearningSchema = new Schema({
  name: { type: String, required: true, unique: true },
  plays: { type: Number, default: 0 },
  wins: { type: Number, default: 0 }
})

export default mongoose.models.LearningStats || mongoose.model('LearningStats', LearningSchema)
