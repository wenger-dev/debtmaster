'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AddPaymentForm() {
    const { debtId } = useParams()
    const router = useRouter()
    const [amount, setAmount] = useState('')
    const [date, setDate] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()

        const res = await fetch(`/api/payments/${debtId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, date }),
        })

        if (res.ok) {
            alert('Payment added!')
            router.back()
            setAmount('')
            setDate('')
        } else {
            alert('Error adding payment')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212] dark:bg-black">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-[#181818] dark:bg-black shadow-xl -2xl space-y-6 border border-[#222] dark:border-[#333]">
                <button type="button" onClick={() => router.back()} className="mb-4 text-blue-400 hover:underline">&larr; Back</button>
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Add Payment</h2>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white" htmlFor="amount">Amount Paid</label>
                    <input
                        id="amount"
                        className="w-full border-2 border-[#222] focus:border-purple-500 focus:ring-2 focus:ring-purple-900 -lg p-3 transition-all outline-none bg-[#121212] dark:bg-black placeholder-gray-400 text-white"
                        placeholder="Enter amount paid"
                        type="number"
                        min="0"
                        step="0.01"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white" htmlFor="date">Payment Date</label>
                    <input
                        id="date"
                        className="w-full border-2 border-[#222] focus:border-purple-500 focus:ring-2 focus:ring-purple-900 -lg p-3 transition-all outline-none bg-[#121212] dark:bg-black placeholder-gray-400 text-white"
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-[#121212] text-white py-3 -lg font-semibold text-lg shadow-md hover:bg-black transition-all focus:outline-none focus:ring-2 focus:ring-[#222] border border-[#333]">
                    💾 Save Payment
                </button>
            </form>
        </div>
    )
}
