import mongoose from 'mongoose'

const ClientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export default mongoose.models.Client || mongoose.model('Client', ClientSchema)
