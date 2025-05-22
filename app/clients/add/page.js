'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddClientForm() {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setSuccess('')
        try {
            const res = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone }),
            })
            const data = await res.json()
            if (res.ok) {
                setSuccess('Client added!')
                setName('')
                setPhone('')
                router.back()
            } else {
                setError(data.error || 'Error adding client')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
            <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-[#181818] shadow-xl -2xl space-y-6 border border-[#222]">
                <button type="button" onClick={() => router.back()} className="mb-4 text-blue-400 hover:underline">&larr; Back</button>
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Add New Client</h2>
                {error && <div className="bg-red-600 text-white px-4 py-2  text-center">{error}</div>}
                {success && <div className="bg-green-600 text-white px-4 py-2  text-center">{success}</div>}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white" htmlFor="name">Full Name</label>
                    <input
                        id="name"
                        className="w-full border-2 border-[#222] focus:border-[#121212] focus:ring-2 focus:ring-[#121212] -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                        placeholder="Full Name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white" htmlFor="phone">Phone Number</label>
                    <input
                        id="phone"
                        className="w-full border-2 border-[#222] focus:border-[#121212] focus:ring-2 focus:ring-[#121212] -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#121212] text-white py-3 -lg font-semibold text-lg shadow-md hover:bg-black transition-all focus:outline-none focus:ring-2 focus:ring-[#222] border border-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : '💾 Save Client'}
                </button>
            </form>
        </div>
    )
}
