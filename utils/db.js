import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/debtmanagement'

export async function connectDB() {
    if (mongoose.connection.readyState >= 1) return
    return mongoose.connect(MONGODB_URI)
}
