import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/utils/db'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
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
                
                if (user) {
                    const match_password = await bcrypt.compare(credentials.password,user.password)
                    if (match_password) {
                        return { id: user._id, email: user.email }
                    }
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
