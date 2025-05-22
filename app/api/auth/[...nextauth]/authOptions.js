import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/utils/db'
import User from '@/models/User'

const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                await connectDB()
                const user = await User.findOne({ email: credentials.email })
                if (user && user.password === credentials.password) {
                    return { id: user._id, email: user.email }
                }
                return null
            }
        })
    ],
    session: { strategy: 'jwt' },
    callbacks: {
        async session({ session, token }) {
            if (token?.sub) session.userId = token.sub
            return session
        }
    },
    pages: {
        signIn: '/login'
    }
}

export default authOptions
