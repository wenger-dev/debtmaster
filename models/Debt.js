import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true }
})

const DebtSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    products: [ProductSchema],
    takenDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

export default mongoose.models.Debt || mongoose.model('Debt', DebtSchema)
