import { Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import type { CommonProps } from '@/@types/common'
import { useAuth } from '@/auth'

const TemplatesLayout = ({ children }: CommonProps) => {
    const { authenticated } = useAuth()

    if (!authenticated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500">
                    You must be logged in to view this page.
                </p>
            </div>
        )
    }

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col min-h-screen">
                    <Loading loading={true} />
                </div>
            }
        >
            <div className="flex flex-col min-h-screen bg-gray-50">
                {/* 🔹 Add your feature-specific sidebar / navbar here */}
                <header className="p-4 shadow bg-white">
                    Auth Feature Header
                </header>
                <main className="flex-1 p-6">{children}</main>
            </div>
        </Suspense>
    )
}

export default TemplatesLayout
