'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function ClientLayout({ children }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const pathname = usePathname()
    const isAuthPage = pathname === '/login' || pathname === '/register'

    useEffect(() => {
        if (status === 'loading') return
        if (!session && !isAuthPage) {
            router.replace('/login')
        }
        if (session && isAuthPage) {
            router.replace('/dashboard')
        }
    }, [session, status, pathname])

    return children
}
