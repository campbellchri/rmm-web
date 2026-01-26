import { Key, useEffect, useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useForm } from 'react-hook-form'
import CommonInput from '@/components/shared/CommonInput'
import { apiSetFeaturedMemorial, apiGetMemorialById, apiDeleteMemorial } from '@/services/axios/MemorialModeService'
import { useMemorialStore } from '@/store/memorialStore'
import { toast, Notification } from '@/components/ui'
import { Play, Facebook, Twitter, Copy, QrCode, ArrowLeft, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Memorial() {
    const [copiedUrl, setCopiedUrl] = useState(false)
    const [memorialDetails, setMemorialDetails] = useState<any>(null)
    const { fetchMemorials, activeMemorialId } = useMemorialStore()
    const memorialId = activeMemorialId
    const navigate = useNavigate()
    const qrRef = useRef<HTMLCanvasElement>(null)
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)


    const { control, setValue } = useForm({
        defaultValues: {
            memorialUrl: '',
        },
    })

    useEffect(() => {
        fetchMemorials()
        if (memorialId) {
            fetchMemorialDetails()
        }
    }, [fetchMemorials, memorialId])

    const fetchMemorialDetails = async () => {
        try {
            const data = await apiGetMemorialById<any>(memorialId!)
            console.log(data, 'memorial data per id ')
            setMemorialDetails(data)
            setValue('memorialUrl', data.pageURL)
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

    const handlePlayVideo = (videoId: string) => {
        setActiveVideoId(videoId)
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
            <div className="flex items-center justify-between">

                <div className="flex items-center  gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft />
                    </button>
                </div>
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
            <div
                className="relative w-full bg-cover bg-center"
            >
                <div className="absolute inset-0 bg-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    <div className="flex flex-col md:items-center md:justify-center lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8">
                            <div className="flex justify-center sm:justify-start">
                                <img
                                    src={memorialDetails?.personProfilePicture}
                                    alt="James William Thompson"
                                    className="w-[140px] h-[170px] sm:w-[164px] sm:h-[201px] rounded-[10px] object-cover shadow-lg"
                                />
                            </div>
                            <div className="flex flex-col gap-2.5 text-center sm:text-left">
                                <div className="space-y-1">
                                    <p className="DMSerif text-[28px] md:text-[42px] leading-[34px] sm:leading-[50px] text-[#ffffff]">
                                        {memorialDetails?.personName || (
                                            <>
                                                James William
                                                <br />
                                                Thompson
                                            </>
                                        )}
                                    </p>
                                    <div className="font-poppins text-lg md:text-2xl text-[#ffffff]">
                                        {memorialDetails && (
                                            `${new Date(memorialDetails.personBirthDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })} - ${new Date(memorialDetails.personDeathDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}`
                                        )}
                                    </div>
                                </div>
                                <div className="monteCarlo text-lg sm:text-[22px] text-[#ffffff]">
                                    A Life Well Lived
                                </div>
                            </div>
                        </div>

                        <div className="lg:max-w-[500px] w-full">
                            <div className="bg-transparent rounded-lg md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                                <p className="font-poppins text-base md:text-[19px] text-[#ffffff] leading-relaxed mb-4 sm:mb-6 text-center md:text-left">
                                    {memorialDetails?.favQuote}
                                </p>
                                <div className="flex justify-center  lg:justify-end">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                '/dashboard/classic-template',
                                                {
                                                    state: {
                                                        mode: 'edit',
                                                        memorialId: memorialId,
                                                    },
                                                },
                                            )
                                        }
                                        className="text-black font-poppins text-sm md:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-[1000px] transition-colors"
                                        style={{
                                            background:
                                                'linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)',
                                        }}
                                    >
                                        Edit Memory
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="space-y-16">
                    <section className="space-y-6">
                        <p className="DMSerif md:text-[28px] text-lg text-[#ffffff]">
                            Featured Experience
                        </p>
                        <div className="rounded-lg shadow-md overflow-hidden">
                            <img
                                src={memorialDetails?.featuredPhotoURL}
                                alt="Featured Experience"
                                className="md:w-full md:h-[420px] object-cover"
                            />
                            <div className="bg-[#2F3349] p-6 space-y-2">
                                <p className="font-poppins text-base font-[400] text-[#ffffff]">
                                    {memorialDetails?.favoriteSayings?.[0]?.content}
                                </p>
                                <p className="font-poppins italic font-[400] text-sm text-[#ffffff]">
                                    {memorialDetails?.favoriteSayings?.[0]?.authorName}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-6">
                        <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">
                            Videos
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                            {memorialDetails?.videos?.map((video: { id: Key | null | undefined; thumbnail: string | undefined; title: string | undefined; fileURL: string | undefined }) => (
                                <div key={video.id} className="space-y-2">

                                    <div className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm">
                                        {activeVideoId === video.id ? (
                                            <video
                                                src={video.fileURL}
                                                controls
                                                autoPlay
                                                className="w-full h-[140px] bg-black"
                                            />
                                        ) : (
                                            <>
                                                <img
                                                    src={video.thumbnail}
                                                    alt={video.title}
                                                    className="w-full h-[140px] object-cover"
                                                    onClick={() => handlePlayVideo(video.id as string)}
                                                />
                                                <div
                                                    className="absolute inset-0 bg-black/30 flex items-center justify-center"
                                                    onClick={() => handlePlayVideo(video.id as string)}
                                                >
                                                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                                        <Play
                                                            className="w-4 h-4 text-[#263859] ml-0.5"
                                                            fill="currentColor"
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <p className="font-poppins font-[400] md:text-base text-sm text-[#ffffff]">
                                        {video.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">
                                Photos
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {memorialDetails?.photos?.map((album: { fileId: Key | null | undefined; image: string | undefined }) => (
                                <div
                                    key={album?.fileId}
                                    className="cursor-pointer group"
                                >
                                    <img
                                        src={album?.fileURL}
                                        alt={`Photo Album ${album?.photoCaption}`}
                                        className="w-full h-[180px] object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-6">
                        <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">
                            Life Story
                        </p>
                        <div className="bg-[#2F3349] rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-shrink-0 flex justify-center md:justify-start">
                                    <img
                                        src={memorialDetails?.lifeStoryImageURL}
                                        alt="James William Thompson"
                                        className="w-[220px] h-[280px] object-cover rounded-md"
                                    />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <p className="font-poppins text-base text-[#ffffff] leading-relaxed">
                                        {memorialDetails?.lifeStoryText}
                                    </p>


                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="bg-[#2F3349] rounded-lg p-6 shadow-sm">
                        <p className="font-poppins text-lg text-[#ffffff] mb-4">
                            Share Memorial Page
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <p className="font-poppins text-base text-[#ffffff]">
                                    Share this memorial page with friends and
                                    family
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
                                        <CommonInput
                                            name="memorialUrl"
                                            control={control}
                                             value={
                                                memorialDetails?.slug
                                                    ? `${window.location.origin}/memorials/public/${memorialDetails.slug}`
                                                    : ''
                                            }
                                            readOnly
                                            className="w-full text-[#878787] bg-[#383C56] border-[#383C56] rounded-l-md rounded-r-none font-poppins text-sm focus:!ring-[#C7A30D] focus:!border-[#C7A30D] h-auto py-2"
                                            containerClassName="flex-1 mb-0"
                                        />
                                        <button
                                            onClick={handleCopyUrl}
                                            className={`px-3 py-2 border border-[#D1D5DB] border-l-0 rounded-r-md bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors ${copiedUrl ? 'bg-green-100' : ''}`}
                                        >
                                            <Copy className="w-4 h-4 text-[#4B5563]" />
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
            </div>
        </>
    )
}
