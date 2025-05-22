import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import authOptions from '../auth/[...nextauth]/authOptions'
import { connectDB } from '@/utils/db'
import Client from '@/models/Client'

export async function POST(req) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        await connectDB()
        const { name, phone } = await req.json()
        if (!name || !phone) {
            return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
        }
        const client = await Client.create({ name, phone, user: session.userId })
        return NextResponse.json({ client }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function GET(req) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        await connectDB()
        const clients = await Client.find({ user: session.userId })
        return NextResponse.json({ clients }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
