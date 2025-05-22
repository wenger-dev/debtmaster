'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ClientsPage() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchClients() {
            setLoading(true)
            setError('')
            try {
                const res = await fetch('/api/clients')
                if (!res.ok) throw new Error('Failed to fetch clients')
                const data = await res.json()
                setClients(data.clients || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchClients()
    }, [])

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center">All Clients</h1>
                <div className="mb-6 text-center">
                    <Link href="/clients/add">
                        <span className="px-4 py-2  border border-[#333] bg-[#181818] hover:bg-black transition">Add Client</span>
                    </Link>
                </div>
                {error && <div className="bg-red-600 text-white px-4 py-2  text-center mb-4">{error}</div>}
                {loading ? (
                    <div className="text-center py-8">Loading clients...</div>
                ) : (
                    <ul className="divide-y divide-[#222] bg-[#181818] -xl shadow-lg p-6 border border-[#222]">
                        {clients.length === 0 ? (
                            <div className="text-gray-400">No clients found.</div>
                        ) : (
                            clients.map(client => (
                                <li key={client._id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                    <div className='flex flex-col'>
                                        <span className="font-bold text-lg">{client.name}</span>
                                        
                                        <span className="ml-2 text-gray-400">Phone: {client.phone}</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        <Link href={`/clients/${client._id}`}>
                                            <span className="px-3 py-1  border border-[#333] bg-[#222] hover:bg-black transition py-2">Profile</span>
                                        </Link>
                                        <Link href={`/clients/${client._id}/add/add-debt`}>
                                            <span className="px-3 py-1  border border-[#333] bg-[#222] hover:bg-black transition py-2">Add Debt</span>
                                        </Link>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}
