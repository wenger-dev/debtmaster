import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema({
    debt: { type: mongoose.Schema.Types.ObjectId, ref: 'Debt', required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema)
