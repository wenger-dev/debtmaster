'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function ClientProfile() {
    const { id } = useParams()
    const [client, setClient] = useState(null)
    const [debts, setDebts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [copiedDebtId, setCopiedDebtId] = useState(null)

    function formatCurrency(number) {
        try {
            return Number(number).toLocaleString() + ' RWF'
        } catch {
            return `${number} RWF`
        }
    }

    function formatNumber(number) {
        try {
            return Number(number).toLocaleString()
        } catch {
            return String(number)
        }
    }

    function formatDate(value) {
        try {
            const d = new Date(value)
            const dd = String(d.getDate()).padStart(2, '0')
            const mm = String(d.getMonth() + 1).padStart(2, '0')
            const yyyy = d.getFullYear()
            return `${dd}/${mm}/${yyyy}`
        } catch {
            return String(value)
        }
    }

    function formatDebtSmsText(clientObj, debtObj) {
        const total = (debtObj.products || []).reduce((sum, p) => sum + (Number(p.price) * Number(p.quantity)), 0)
        const paid = (debtObj.payments || []).reduce((sum, p) => sum + Number(p.amount), 0)
        const due = total - paid

        const header = `Debt for ${clientObj?.name} (${clientObj?.phone})`
        const dates = `Taken: ${formatDate(debtObj.takenDate)} | Due: ${formatDate(debtObj.dueDate)}`
        const lines = (debtObj.products || []).map(p => `${p.name} ${formatNumber(p.price)}*${p.quantity}=${formatNumber(Number(p.price) * Number(p.quantity))}`)
        const totals = `Total: ${formatCurrency(total)} | Paid: ${formatCurrency(paid)}`

        // Keep SMS-friendly, single text block
        return [header, dates, ...lines, totals].join('\n')
    }

    async function handleCopyDebt(debt) {
        try {
            const text = formatDebtSmsText(client, debt)
            await navigator.clipboard.writeText(text)
            setCopiedDebtId(debt._id)
            setTimeout(() => setCopiedDebtId(null), 1500)
        } catch (e) {
            setError('Failed to copy text')
            setTimeout(() => setError(''), 1500)
        }
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError('')
            try {
                // Fetch client info
                const clientRes = await fetch(`/api/clients`)
                const clientData = await clientRes.json()
                const found = (clientData.clients || []).find(c => c._id === id)
                setClient(found || null)
                // Fetch debts for this client
                const debtsRes = await fetch(`/api/clients/${id}/debts`)
                const debtsData = await debtsRes.json()
                // For each debt, fetch payments
                const debtsWithPayments = await Promise.all(
                    (debtsData.debts || []).map(async debt => {
                        const paymentsRes = await fetch(`/api/payments/${debt._id}`)
                        const paymentsData = await paymentsRes.json()
                        return { ...debt, payments: paymentsData.payments || [] }
                    })
                )
                setDebts(debtsWithPayments)
            } catch (err) {
                setError('Failed to load client data')
            } finally {
                setLoading(false)
            }
        }
        if (id) fetchData()
    }, [id])

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/clients" className="text-blue-400 hover:underline">&larr; Back to Clients</Link>
                {loading ? (
                    <div className="text-center py-8">Loading client profile...</div>
                ) : error ? (
                    <div className="bg-red-600 text-white px-4 py-2  text-center mb-4">{error}</div>
                ) : !client ? (
                    <div className="text-gray-400 text-center py-8">Client not found.</div>
                ) : (
                    <div className="bg-[#181818] -2xl shadow-lg p-8 border border-[#222] mt-6">
                        <h1 className="text-3xl font-bold mb-1 text-white">{client.name}</h1>
                        <div className="mb-6 text-gray-400 text-lg">Phone: <span className="text-white font-mono">{client.phone}</span></div>
                        <h2 className="text-2xl font-semibold mb-4 border-b border-[#333] pb-2">Debts</h2>
                        {debts.length === 0 ? (
                            <div className="text-gray-400">No debts found for this client.</div>
                        ) : (
                            <ul className="space-y-8">
                                {debts.map(debt => {
                                    const total = debt.products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
                                    const paid = (debt.payments || []).reduce((sum, p) => sum + p.amount, 0)
                                    const due = total - paid
                                    const dueColor = due > 0 ? 'text-red-400' : 'text-green-400'
                                    const isPaid = due <= 0
                                    return (
                                        <li key={debt._id} className="bg-[#232323] -xl p-6 border border-[#333] shadow flex flex-col gap-3 relative overflow-hidden">
                                            {isPaid && (
                                                <div className="absolute inset-0 bg-green-900/60 flex items-center justify-center z-10 pointer-events-none select-none -xl">
                                                    <span className="text-2xl font-bold text-white opacity-80 tracking-widest">PAID</span>
                                                </div>
                                            )}
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
                                                <div>
                                                    <span className="font-bold text-base text-gray-300">Debt ID:</span> <span className="text-gray-400 font-mono">{debt._id}</span>
                                                </div>
                                                <div className="flex gap-2 mt-2 sm:mt-0">
                                                    <span className="bg-[#181818] px-2 py-1  text-xs border border-[#333]">Taken: {new Date(debt.takenDate).toLocaleDateString()}</span>
                                                    <span className="bg-[#181818] px-2 py-1  text-xs border border-[#333]">Due: {new Date(debt.dueDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-200">Products:</span>
                                                <ul className="ml-4 mt-1 list-disc text-sm text-gray-300">
                                                    {debt.products.map((prod, i) => (
                                                        <li key={i} className="flex gap-2 items-center">
                                                            <span className="font-mono text-white">{prod.name}</span>
                                                            <span className="text-gray-400">× {prod.quantity}</span>
                                                            <span className="text-gray-400">@ {prod.price.toLocaleString()} RWF</span>
                                                            <span className="ml-2 text-green-300 font-semibold">= {(prod.price * prod.quantity).toLocaleString()} RWF</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <span className="bg-[#181818] px-3 py-1  text-sm border border-[#333] font-semibold text-blue-300">Total: {total.toLocaleString()} RWF</span>
                                                <span className="bg-[#181818] px-3 py-1  text-sm border border-[#333] font-semibold text-green-300">Paid: {paid.toLocaleString()} RWF</span>
                                                <span className={`bg-[#181818] px-3 py-1  text-sm border border-[#333] font-semibold ${dueColor}`}>Due: {due.toLocaleString()} RWF</span>
                                            </div>
                                            <div>
                                                <span className="font-semibold text-gray-200">Payments:</span>
                                                {(!debt.payments || debt.payments.length === 0) ? (
                                                    <span className="ml-2 text-gray-400">No payments yet.</span>
                                                ) : (
                                                    <ul className="ml-4 mt-1 list-disc text-sm text-green-300">
                                                        {debt.payments.map((pay, i) => (
                                                            <li key={i} className="flex gap-2 items-center">
                                                                <span className="font-mono">{new Date(pay.date).toLocaleDateString()}</span>
                                                                <span className="text-white">{pay.amount.toLocaleString()} RWF</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                            <div className="mt-2">
                                                <Link href={`/debts/${debt._id}/add-payment`}>
                                                    <span className="px-3 py-1  border border-[#333] bg-[#181818] hover:bg-black transition text-sm">Add Payment</span>
                                                </Link>
                                                <button
                                                    onClick={() => handleCopyDebt(debt)}
                                                    className="ml-2 px-3 py-1  border border-[#333] bg-[#181818] hover:bg-black transition text-sm"
                                                >
                                                    {copiedDebtId === debt._id ? 'Copied' : 'Copy'}
                                                </button>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
