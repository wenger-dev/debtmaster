import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import authOptions from '../auth/[...nextauth]/authOptions'
import { connectDB } from '@/utils/db'
import Debt from '@/models/Debt'

export async function GET(req) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        await connectDB()
        const debts = await Debt.find({ user: session.userId })
        return NextResponse.json({ debts }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
