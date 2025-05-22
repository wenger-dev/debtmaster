import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import authOptions from '../../../auth/[...nextauth]/authOptions'
import { connectDB } from '@/utils/db'
import Client from '@/models/Client'
import Debt from '@/models/Debt'

export async function POST(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        await connectDB()
        const { id } = await params
        const { products, takenDate, dueDate } = await req.json()
        if (!products || !Array.isArray(products) || products.length === 0) {
            return NextResponse.json({ error: 'At least one product is required.' }, { status: 400 })
        }
        if (!takenDate || !dueDate) {
            return NextResponse.json({ error: 'takenDate and dueDate are required.' }, { status: 400 })
        }
        const client = await Client.findOne({ _id: id, user: session.userId })
        if (!client) {
            return NextResponse.json({ error: 'Client not found.' }, { status: 404 })
        }
        const debt = await Debt.create({ client: id, products, takenDate, dueDate, user: session.userId })
        return NextResponse.json({ debt }, { status: 201 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    try {
        await connectDB()
        const { id } = params
        const debts = await Debt.find({ client: id, user: session.userId })
        return NextResponse.json({ debts }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
