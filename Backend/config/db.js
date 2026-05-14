import mongoose from 'mongoose'

export default async function connectDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai'
  return mongoose.connect(mongoURI)
}
