'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password
        })
        if (res.ok) {
            router.push('/dashboard')
        } else {
            setError('Invalid email or password')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#121212]">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-8 bg-[#181818] shadow-xl -2xl space-y-6 border border-[#222]">
                <h2 className="text-2xl font-bold text-white mb-2 text-center">Sign In</h2>
                {error && <div className="bg-red-600 text-white px-4 py-2  text-center">{error}</div>}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        className="w-full border-2 border-[#222] focus:border-blue-500 focus:ring-2 focus:ring-blue-900 -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-white" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        className="w-full border-2 border-[#222] focus:border-blue-500 focus:ring-2 focus:ring-blue-900 -lg p-3 transition-all outline-none bg-[#121212] placeholder-gray-400 text-white"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#121212] text-white py-3 -lg font-semibold text-lg shadow-md hover:bg-black transition-all focus:outline-none focus:ring-2 focus:ring-[#222] border border-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="text-center text-gray-400 text-sm">
                    Don&apos;t have an account? <a href="/register" className="text-blue-400 hover:underline">Register</a>
                </div>
            </form>
        </div>
    )
}
