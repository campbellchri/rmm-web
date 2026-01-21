
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMemorialStore } from '@/store/memorialStore'
import { Spinner } from '@/components/ui'

export default function MemorialResolver() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const { memorials, fetchMemorials, setActiveMemorialId } = useMemorialStore()

    useEffect(() => {
        const resolveMemorial = async () => {
            await fetchMemorials()
        }
        resolveMemorial()
    }, [fetchMemorials])

    useEffect(() => {
        if (memorials.length > 0 && slug) {
            const memorial = memorials.find((m: any) => {
                const memorialSlug = m.personName.toLowerCase().replace(/\s+/g, '-')
                return memorialSlug === slug
            })

            if (memorial) {
                const mem = memorial as any
                setActiveMemorialId(mem.id)
                const landingMode =
                    mem.template?.landingMode?.landingModeType ||
                    mem.landingMode?.landingModeType ||
                    mem.landingModeType

                if (landingMode === 'video-only-mode') {
                    navigate('/dashboard/video-memorial')
                } else if (landingMode === 'event-mode') {
                    navigate('/dashboard/event-memorial')
                } else {
                    navigate('/dashboard/memorial')
                }
            } else {
                // If no memorial found, maybe go to dashboard or 404
                navigate('/dashboard')
            }
        }
    }, [memorials, slug, navigate, setActiveMemorialId])

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Spinner size={40} />
            <p className="mt-4 font-poppins text-white">Resolving Memorial...</p>
        </div>
    )
}
