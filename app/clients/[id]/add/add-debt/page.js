'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function AddDebtForm() {
    const { id: clientId } = useParams()
    const router = useRouter()

    const [products, setProducts] = useState([{ name: '', price: '', quantity: '' }])
    const [takenDate, setTakenDate] = useState('')
    const [dueDate, setDueDate] = useState('')

    const handleChange = (i, field, value) => {
        const newProducts = [...products]
        newProducts[i][field] = value
        setProducts(newProducts)
    }

    const addProduct = () => {
        setProducts([...products, { name: '', price: '', quantity: '' }])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`/api/clients/${clientId}/debts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products, takenDate, dueDate }),
        })

        if (res.ok) {
            alert('Debt added')
            router.back()
        } else {
            alert('Failed to add debt')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl p-8 bg-[#181818] shadow-xl -2xl space-y-8 border border-[#222]">
                <button type="button" onClick={() => router.back()} className="mb-4 text-blue-400 hover:underline">&larr; Back</button>
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Add Debt for Client</h2>

                {products.map((product, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4">
                        <input
                            className="border-2 border-[#222] focus:border-[#121212] focus:ring-2 focus:ring-[#121212] -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                            placeholder="Product Name"
                            value={product.name}
                            onChange={e => handleChange(i, 'name', e.target.value)}
                            required
                        />
                        <input
                            className="border-2 border-[#222] focus:border-[#121212] focus:ring-2 focus:ring-[#121212] -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                            placeholder="Price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={product.price}
                            onChange={e => handleChange(i, 'price', e.target.value)}
                            required
                        />
                        <input
                            className="border-2 border-[#222] focus:border-[#121212] focus:ring-2 focus:ring-[#121212] -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                            placeholder="Quantity"
                            type="number"
                            min="1"
                            step="1"
                            value={product.quantity}
                            onChange={e => handleChange(i, 'quantity', e.target.value)}
                            required
                        />
                    </div>
                ))}

                <button type="button" onClick={addProduct} className="text-[#bdbdbd] font-semibold underline hover:text-white transition-all border border-[#333] px-2 py-1 ">
                    + Add Another Product
                </button>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-white" htmlFor="takenDate">Taken Date</label>
                        <input
                            id="takenDate"
                            className="w-full border-2 border-[#222] focus:border-[#121212] focus:ring-2 focus:ring-[#121212] -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                            type="date"
                            value={takenDate}
                            onChange={e => setTakenDate(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-white" htmlFor="dueDate">Due Date</label>
                        <input
                            id="dueDate"
                            className="w-full border-2 border-[#222] focus:border-[#121212] focus:ring-2 focus:ring-[#121212] -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <button type="submit" className="w-full bg-[#121212] text-white py-3 -lg font-semibold text-lg shadow-md hover:bg-black transition-all focus:outline-none focus:ring-2 focus:ring-[#222] border border-[#333]">
                    💾 Submit Debt Info
                </button>
            </form>
        </div>
    )
}
