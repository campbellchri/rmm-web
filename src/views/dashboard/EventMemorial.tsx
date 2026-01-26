import { useEffect, useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { apiSetFeaturedMemorial, apiGetMemorialById, apiDeleteMemorial } from '@/services/axios/MemorialModeService'
import { useMemorialStore } from '@/store/memorialStore'
import { toast, Notification } from '@/components/ui'
import { ArrowLeft, Copy, Facebook, Play, QrCode, Twitter, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MediaType } from '@/constants/memorial.constant'

export default function EventMemorial() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [copiedUrl, setCopiedUrl] = useState(false)
    const [memorialDetails, setMemorialDetails] = useState<any>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const { fetchMemorials, activeMemorialId } = useMemorialStore()
    const memorialId = activeMemorialId
    const navigate = useNavigate()
    const qrRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        fetchMemorials()
        if (memorialId) {
            fetchMemorialDetails()
        }
    }, [fetchMemorials, memorialId])

    const fetchMemorialDetails = async () => {
        try {
            const data = await apiGetMemorialById(memorialId!)
            setMemorialDetails(data)
        } catch (error) {
            console.error('Error fetching memorial details:', error)
        }
    }

    const handleCopyUrl = () => {
    if (!memorialDetails?.slug) return

    const url = `${window.location.origin}/memorials/public/${memorialDetails.slug}`
    navigator.clipboard.writeText(url)

    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
}


    const videoUrl = memorialDetails?.userMedia?.find(
        (m: any) => m.type === MediaType.VIDEO
    )?.fileURL

    const handlePlayVideo = () => {
        setIsPlaying(true)
    }

    const handleDownloadQRCode = () => {
        if (qrRef.current) {
            const canvas = qrRef.current
            const url = canvas.toDataURL('image/png')
            const link = document.createElement('a')
            link.href = url
            link.download = `memorial-qr-${memorialDetails?.personName || 'code'}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const handleDeleteMemorial = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this memorial? This action cannot be undone.'
        )
        if (!confirmed) return

        try {
            setIsDeleting(true)
            if (!memorialId) {
                toast.push(
                    <Notification type="danger" title="Error" duration={2000}>
                        Memorial ID not found.
                    </Notification>,
                    { placement: 'top-center' }
                )
                return
            }
            await apiDeleteMemorial(memorialId)
            toast.push(
                <Notification
                    type="success"
                    title="Success"
                    duration={2000}
                >
                    Memorial deleted successfully!
                </Notification>,
                { placement: 'top-center' }
            )
            await fetchMemorials()
            navigate('/dashboard')
        } catch (error) {
            console.error('Error deleting memorial:', error)
            toast.push(
                <Notification
                    type="danger"
                    title="Error"
                    duration={2000}
                >
                    Failed to delete memorial.
                </Notification>,
                { placement: 'top-center' }
            )
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <div className="min-h-screen">
                <div className=" py-16 relative">
                    <div className="absolute top-3 w-full px-6 flex justify-between items-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft />
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={async () => {
                                    try {
                                        if (!memorialId) {
                                            toast.push(
                                                <Notification type="danger" title="Error" duration={2000}>
                                                    Memorial ID not found.
                                                </Notification>,
                                                { placement: 'top-center' }
                                            )
                                            return
                                        }
                                        await apiSetFeaturedMemorial({ memorialId })
                                        toast.push(
                                            <Notification
                                                type="success"
                                                title="Success"
                                                duration={2000}
                                            >
                                                Memorial set as featured successfully!
                                            </Notification>,
                                            { placement: 'top-center' }
                                        )
                                    } catch (error) {
                                        console.error(
                                            'Error setting featured memorial:',
                                            error
                                        )
                                        toast.push(
                                            <Notification
                                                type="danger"
                                                title="Error"
                                                duration={2000}
                                            >
                                                Failed to set memorial as featured.
                                            </Notification>,
                                            { placement: 'top-center' }
                                        )
                                    }
                                }}
                                className="md:px-6 px-3 md:py-2.5 py-1 border border-[#FFB84C] text-[#FFB84C] rounded-md font-poppins text-base hover:bg-[#FFB84C]/10 transition-colors"
                            >
                                Set As Featured
                            </button>
                            <button
                                onClick={handleDeleteMemorial}
                                disabled={isDeleting}
                                className="md:px-6 px-3 md:py-2.5 py-1 border border-red-500 text-red-500 rounded-md font-poppins text-base hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                {isDeleting ? 'Deleting...' : 'Delete Memorial'}
                            </button>
                        </div>
                    </div>
                    <div className="max-w-4xl mx-auto text-center px-6">
                        <p className="DMSerif md:text-[42px] text-2xl leading-tight text-[#ffffff] mb-2">
                            {memorialDetails?.personName || 'James William Thompson'}
                        </p>
                        <p className="font-poppins md:text-2xl text:2xl font-[500] text-[#ffffff] mb-2.5">
                            {memorialDetails?.personName}
                        </p>
                        <p className="monteCarlo text-[22px] text-[#ffffff]">
                            {memorialDetails?.personName}
                        </p>
                    </div>
                </div>

                <div className="py-12">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="mb-8">
                            <div className="relative">
                                <div className="border-2 border-[#C7A30D] bg-transparent p-4 rounded-lg">
                                    <div className="relative md:w-full md:h-[585px] rounded-lg overflow-hidden bg-black flex items-center justify-center">
                                        {videoUrl ? (
                                            <video
                                                src={videoUrl}
                                                className="md:w-full md:h-full object-contain"
                                                controls={isPlaying}
                                                onPlay={() => setIsPlaying(true)}
                                                onPause={() => setIsPlaying(false)}
                                                onEnded={() => setIsPlaying(false)}
                                                autoPlay={isPlaying}
                                            />
                                        ) : (
                                            <img
                                                src="https://api.builder.io/api/v1/image/assets/TEMP/04b24a281d67806b9ac0bcb3134cd859cf474329?width=2540"
                                                alt="Memorial Service Video Placeholder"
                                                className="md:w-full md:h-full object-cover"
                                            />
                                        )}

                                        {!isPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                                                <button
                                                    onClick={handlePlayVideo}
                                                    className="w-15 h-15 bg-[#C7A30D] rounded-full flex items-center justify-center hover:bg-[#B8940C] transition-colors shadow-lg pointer-events-auto"
                                                >
                                                    <Play
                                                        className="w-8 h-8 text-white ml-1"
                                                        fill="currentColor"
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center mt-8 space-y-2">
                                <p className="DMSerif md:text-[40px] text-2xl leading-tight text-[#ffffff]">
                                    Memorial Service {memorialDetails?.eventStart && new Date(memorialDetails.eventStart).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </p>
                                <p className="monteCarlo text-[22px] text-[#ffffff]">
                                    A Life Well Lived
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-6 py-8">
                    <div className="w-[200px] h-0.5 bg-gradient-to-r from-transparent via-[#B99F6B] to-transparent"></div>

                    <div className="w-8 h-8 text-[#C7A30D]">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M1.23438 0.902374C4.9555 7.9205 10.1412 13.5493 15.7519 19.1972L15.9785 19.4316L15.9824 19.4277C17.3466 20.7984 18.7349 22.1729 20.1328 23.5684C18.9543 24.4942 17.6969 25.3309 16.3866 26.0879L18.1699 27.871L22.4647 23.5762C25.1108 25.3034 27.2326 27.5541 28.9706 30.1893L30.7246 28.4356C28.0702 26.7172 25.7408 24.6727 24.0977 21.9433L28.4062 17.6347L26.6231 15.8516C25.9284 17.2174 25.0973 18.4775 24.1562 19.6386C21.4154 16.9011 18.7523 14.2735 16.0234 11.7967C16.0094 11.7841 15.9964 11.7704 15.9824 11.7577C11.4765 7.67187 6.78219 3.99437 1.23438 0.902374ZM30.7266 0.902374C25.5367 3.79487 21.0939 7.20112 16.8534 10.9746L18.2793 12.3222L21.8299 8.7715L22.6562 9.59569L19.1288 13.1232L20.6659 14.5723C24.5286 10.3898 28.0159 6.01481 30.7266 0.902374ZM10.1309 8.7715L22.6659 21.3046C22.3934 21.5823 22.1134 21.8542 21.8281 22.1191L9.30469 9.59562L10.1309 8.7715ZM5.33781 15.8515L3.55656 17.6348L7.86325 21.9414C6.22012 24.6709 3.89262 26.7173 1.23825 28.4356L2.99219 30.1893C4.73012 27.5541 6.85206 25.3034 9.49806 23.5762L13.7929 27.871L15.5761 26.0879C14.2659 25.3308 13.0086 24.4941 11.83 23.5683C12.9466 22.4539 14.0556 21.3538 15.1523 20.2577L13.5996 18.6543L10.1327 22.1209C9.84744 21.8561 9.56937 21.5822 9.29688 21.3046L12.7871 17.8143L11.254 16.2284C10.1115 17.3444 8.96637 18.4822 7.80662 19.6406C6.86487 18.4789 6.03287 17.2182 5.33781 15.8515Z"
                                fill="currentColor"
                            />
                        </svg>
                    </div>

                    <div className="w-[200px] h-0.5 bg-gradient-to-r from-transparent via-[#B99F6B] to-transparent"></div>
                </div>

                <section className="bg-[#2F3349] rounded-lg p-6 shadow-sm">
                    <p className="font-poppins text-lg text-[#ffffff] mb-4">
                        Share Memorial Page
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <p className="font-poppins text-base text-[#ffffff]">
                                Share this memorial page with friends and family
                            </p>
                            <div className="flex gap-3">
                                <button className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center hover:bg-[#1D4ED8] transition-colors">
                                    <Facebook
                                        className="w-5 h-5 text-white"
                                        fill="currentColor"
                                    />
                                </button>
                                <button className="w-10 h-10 bg-[#60A5FA] rounded-full flex items-center justify-center hover:bg-[#3B82F6] transition-colors">
                                    <Twitter
                                        className="w-5 h-5 text-white"
                                        fill="currentColor"
                                    />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <label className="font-poppins text-sm text-[#ffffff]">
                                    Memorial URL
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                         value={
                                            memorialDetails?.slug
                                                ? `${window.location.origin}/memorials/public/${memorialDetails.slug}`
                                                : ''
                                        }
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-transparent border border-[#D1D5DB] rounded-l-md font-poppins text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D]"
                                    />
                                    <button
                                        onClick={handleCopyUrl}
                                        className={`px-3 py-2 border border-[#D1D5DB] border-l-0 rounded-r-md bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors ${copiedUrl ? 'bg-green-100' : ''}`}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center border-l border-[#E5E7EB] pl-6">
                            <div className="w-[140px] h-[140px] bg-white rounded-lg flex items-center justify-center mb-3 p-3 shadow-inner">
                                {memorialDetails?.pageURL ? (
                                    <QRCodeCanvas
                                        ref={qrRef}
                                        value={memorialDetails?.qrCode?.qrCodeData || memorialDetails?.pageURL}
                                        size={120}
                                        marginSize={2}
                                        level="H"
                                    />
                                ) : (
                                    <QrCode className="w-20 h-20 text-gray-400" />
                                )}
                            </div>
                            <p className="font-poppins text-sm text-[#ffffff] text-center mb-2">
                                Scan for in-person sharing
                            </p>
                            <button
                                onClick={handleDownloadQRCode}
                                className="font-poppins text-sm text-[#C7A30D] hover:underline"
                            >
                                Download QR Code
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
