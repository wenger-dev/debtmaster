'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { signOut } from 'next-auth/react'

export default function Dashboard() {
    const [clients, setClients] = useState([])
    const [debts, setDebts] = useState([])
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function fetchAll() {
            setLoading(true)
            setError('')
            try {
                const [clientsRes, debtsRes, paymentsRes] = await Promise.all([
                    fetch('/api/clients'),
                    fetch('/api/debts'),
                    fetch('/api/payments')
                ])
                if (!clientsRes.ok) throw new Error('Failed to fetch clients')
                if (!debtsRes.ok) throw new Error('Failed to fetch debts')
                if (!paymentsRes.ok) throw new Error('Failed to fetch payments')
                const clientsData = await clientsRes.json()
                const debtsData = await debtsRes.json()
                const paymentsData = await paymentsRes.json()
                setClients(clientsData.clients || [])
                setDebts(debtsData.debts || [])
                setPayments(paymentsData.payments || [])
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchAll()
    }, [])

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Debt Management Dashboard</h1>
                <div className="flex flex-wrap gap-4 justify-center mb-8">
                    <Link href="/dashboard">
                        <span className="px-4 py-2  border border-[#333] bg-[#181818] hover:bg-black transition">Dashboard</span>
                    </Link>
                    <Link href="/clients/add">
                        <span className="px-4 py-2  border border-[#333] bg-[#181818] hover:bg-black transition">Add Client</span>
                    </Link>
                    <Link href="/clients">
                        <span className="px-4 py-2  border border-[#333] bg-[#181818] hover:bg-black transition">View All Clients</span>
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <span className="px-4 py-2  border border-[#333] bg-[#181818] hover:bg-black transition">Logout</span>
                    </button>
                </div>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="bg-[#181818] border border-[#222] -xl p-6 text-center shadow">
                        <div className="text-2xl font-bold">{clients.length}</div>
                        <div className="text-gray-400 mt-1">Clients</div>
                    </div>
                    <div className="bg-[#181818] border border-[#222] -xl p-6 text-center shadow">
                        <div className="text-2xl font-bold">{debts.length}</div>
                        <div className="text-gray-400 mt-1">Debts</div>
                    </div>
                    <div className="bg-[#181818] border border-[#222] -xl p-6 text-center shadow">
                        <div className="text-2xl font-bold">{payments.length}</div>
                        <div className="text-gray-400 mt-1">Payments</div>
                    </div>
                </div>
                {error && <div className="bg-red-600 text-white px-4 py-2  text-center mb-4">{error}</div>}
                {loading ? (
                    <div className="text-center py-8">Loading data...</div>
                ) : (
                    <div className="bg-[#181818] -xl shadow-lg p-6 border border-[#222]">
                        <h2 className="text-xl font-semibold mb-4">Clients</h2>
                        {clients.length === 0 ? (
                            <div className="text-gray-400">No clients found.</div>
                        ) : (
                            <ul className="divide-y divide-[#222]">
                                {clients.map(client => (
                                    <li key={client._id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <div className='flex flex-col'>
                                            <span className="font-bold text-lg">{client.name}</span>
                                            <span className="ml-2 text-gray-400">Phone: {client.phone}</span>
                                        </div>
                                        <div className="flex gap-2 flex-wrap">
                                            <Link href={`/clients/${client._id}`}>
                                                <span className="px-3 py-2  border border-[#333] bg-[#222] hover:bg-black transition">Profile</span>
                                            </Link>
                                            <Link href={`/clients/${client._id}/add/add-debt`}>
                                                <span className="px-3 py-2  border border-[#333] bg-[#222] hover:bg-black transition">Add Debt</span>
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
