import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../auth/[...nextauth]/authOptions'
import { connectDB } from '@/utils/db'
import Debt from '@/models/Debt'
import Payment from '@/models/Payment'

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        await connectDB()
        const { debtId } = params
        const { amount, date } = await req.json()
        if (!amount || !date) {
            return NextResponse.json({ error: 'Amount and date are required.' }, { status: 400 })
        }
        const debt = await Debt.findOne({ _id: debtId, user: session.userId })
        if (!debt) {
            return NextResponse.json({ error: 'Debt not found.' }, { status: 404 })
        }
        const payment = await Payment.create({ debt: debtId, amount, date, user: session.userId })
        return NextResponse.json({ payment }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        await connectDB()
        const { debtId } = params
        const payments = await Payment.find({ debt: debtId, user: session.userId })
        return NextResponse.json({ payments }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
