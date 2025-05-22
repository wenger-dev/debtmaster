import { NextResponse } from 'next/server'
import { connectDB } from '@/utils/db'
import User from '@/models/User'

export async function POST(req) {
    try {
        await connectDB()
        const { email, password } = await req.json()
        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
        }
        const exists = await User.findOne({ email })
        if (exists) {
            return NextResponse.json({ error: 'Email already registered.' }, { status: 400 })
        }
        const user = await User.create({ email, password })
        return NextResponse.json({ user: { email: user.email, _id: user._id } }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
