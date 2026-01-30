import { Key, useEffect, useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useForm } from 'react-hook-form'
import CommonInput from '@/components/shared/CommonInput'
import { apiSetFeaturedMemorial, apiGetMemorialById, apiDeleteMemorial } from '@/services/axios/MemorialModeService'
import { useMemorialStore } from '@/store/memorialStore'
import { toast, Notification } from '@/components/ui'
import { Play, Facebook, Twitter, Copy, QrCode, ArrowLeft, Trash2, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/shared/ConfirmModal'
import { generateThumbnail } from '@/utils'

export default function Memorial() {
    const [copiedUrl, setCopiedUrl] = useState(false)
    const [memorialDetails, setMemorialDetails] = useState<any>(null)
    const { fetchMemorials, activeMemorialId } = useMemorialStore()
    const memorialId = activeMemorialId
    const navigate = useNavigate()
    const qrRef = useRef<HTMLCanvasElement>(null)
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
    const [currentVideo, setCurrentVideo] = useState<any>(null)
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
    const [currentPhoto, setCurrentPhoto] = useState<any>(null)
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [videoThumbnails, setVideoThumbnails] = useState<{ [key: string]: string }>({})


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

    const handlePlayVideo = (video: any, index: number) => {
        setCurrentVideo(video)
        setCurrentVideoIndex(index)
        setIsVideoModalOpen(true)
    }

    const handleCloseVideoModal = () => {
        setIsVideoModalOpen(false)
        setCurrentVideo(null)
        setCurrentVideoIndex(0)
    }

    const handlePreviousVideo = () => {
        if (memorialDetails?.videos?.length > 0) {
            const newIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : memorialDetails.videos.length - 1
            setCurrentVideoIndex(newIndex)
            setCurrentVideo(memorialDetails.videos[newIndex])
        }
    }

    const handleNextVideo = () => {
        if (memorialDetails?.videos?.length > 0) {
            const newIndex = currentVideoIndex < memorialDetails.videos.length - 1 ? currentVideoIndex + 1 : 0
            setCurrentVideoIndex(newIndex)
            setCurrentVideo(memorialDetails.videos[newIndex])
        }
    }

    const handleViewPhoto = (photo: any, index: number) => {
        setCurrentPhoto(photo)
        setCurrentPhotoIndex(index)
        setIsPhotoModalOpen(true)
    }

    const handleClosePhotoModal = () => {
        setIsPhotoModalOpen(false)
        setCurrentPhoto(null)
        setCurrentPhotoIndex(0)
    }

    const handlePreviousPhoto = () => {
        if (memorialDetails?.photos?.length > 0) {
            const newIndex = currentPhotoIndex > 0 ? currentPhotoIndex - 1 : memorialDetails.photos.length - 1
            setCurrentPhotoIndex(newIndex)
            setCurrentPhoto(memorialDetails.photos[newIndex])
        }
    }

    const handleNextPhoto = () => {
        if (memorialDetails?.photos?.length > 0) {
            const newIndex = currentPhotoIndex < memorialDetails.photos.length - 1 ? currentPhotoIndex + 1 : 0
            setCurrentPhotoIndex(newIndex)
            setCurrentPhoto(memorialDetails.photos[newIndex])
        }
    }

    const handleDeleteMemorial = async () => {

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

    const LogoLink = '/img/others/Link.png'


    useEffect(() => {
    memorialDetails?.videos?.forEach(async (video) => {
        if (!video.thumbnail && video.fileURL) {
        try {
            const thumb = await generateThumbnail(video.fileURL)
            setVideoThumbnails(prev => ({ ...prev, [video.id]: thumb }))
        } catch (err) {
            console.error('Thumbnail generation failed', err)
        }
        }
    })
    }, [memorialDetails])


    return (
        <>
        <ConfirmModal
            open={showDeleteModal}
            title="Delete Memorial"
            description="Are you sure you want to delete this memorial? This action cannot be undone."
            confirmText="Yes, Delete"
            cancelText="Cancel"
            loading={isDeleting}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleDeleteMemorial}
            />
            <div className="bg-[url('/img/others/full_memorial_bg.png')] bg-cover bg-center w-full">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 p-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                        >
                            <ArrowLeft className='text-[#ffffff]' />
                        </button>
                    </div>
                </div>
                <div
                    className="relative w-full bg-cover bg-center"
                >
                    <div className="absolute inset-0 bg-transparent"></div>

                    <div className="flex-shrink-0 flex items-center justify-center ">
                        <img
                            src={LogoLink}
                            alt="Remember Memorials Logo"
                            className="h-32 sm:h-40 md:h-52 lg:h-70 w-auto mt-[-20px]"
                        />
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 py-8">
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
                                </div>
                            </div>

                            <div className="lg:max-w-[500px] w-full">
                                <div className="bg-transparent rounded-lg md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                                    <p className="font-poppins text-base md:text-[19px] text-[#ffffff] leading-relaxed mb-4 sm:mb-6 text-center md:text-left">
                                        {memorialDetails?.favQuote}
                                    </p>
                                    <div className="flex justify-center gap-3 lg:justify-end">
                                         <button
                                            onClick={() => setShowDeleteModal(true)}
                                                disabled={isDeleting}
                                                className="md:px-6 px-3 md:py-2.5 py-1 flex items-center gap-1 w-[max-content] border border-[#FFFFFF] text-[#FFFFFF] rounded-[46px] font-poppins text-[14px] font-[500] hover:bg-[#FFFFFF]/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                {isDeleting ? 'Deleting...' : 'Delete Memorial'}
                                            </button>
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
                                            className="md:px-6 px-3 md:py-2.5 py-1 border border-[#FFFFFF] text-[#FFFFFF] rounded-[46px] font-poppins text-[14px] font-[500] hover:bg-[#FFFFFF]/10 transition-colors"
                                        >
                                            Set As Featured
                                        </button>
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
                                            className="text-[#222D38] font-[500] text-[16px] font-poppins px-4 sm:px-6 py-2 sm:py-2.5 rounded-[1000px] transition-colors"
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
                <div className="max-w-7xl mx-auto px-6 py-8">
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
                            <div className="flex items-center justify-between">
                                <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">
                                    Videos
                                </p>
                                {memorialDetails?.videos?.length > 4 && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const container = document.getElementById('video-container')
                                                if (container) {
                                                    container.scrollBy({ left: -200, behavior: 'smooth' })
                                                }
                                            }}
                                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const container = document.getElementById('video-container')
                                                if (container) {
                                                    container.scrollBy({ left: 200, behavior: 'smooth' })
                                                }
                                            }}
                                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <div
                                    id="video-container"
                                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {memorialDetails?.videos?.map((video: { id: Key | null | undefined; thumbnail: string | undefined; title: string | undefined; fileURL: string | undefined }, index: number) => (
                                        <div key={video.id} className="flex-shrink-0 w-[200px] space-y-2">
                                            <div className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm" onClick={() => handlePlayVideo(video, index)}>
                                                <img
                                                    src={video.thumbnail || videoThumbnails[video.id]}
                                                    alt={video.videoTitle}
                                                    className="w-full h-[140px] object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                                        <Play
                                                            className="w-4 h-4 text-[#263859] ml-0.5"
                                                            fill="currentColor"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="font-poppins font-[400] text-sm text-[#ffffff] line-clamp-2">
                                                {video.videoTitle}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">
                                    Photos
                                </p>
                                {memorialDetails?.photos?.length > 6 && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                const container = document.getElementById('photo-container')
                                                if (container) {
                                                    container.scrollBy({ left: -200, behavior: 'smooth' })
                                                }
                                            }}
                                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                const container = document.getElementById('photo-container')
                                                if (container) {
                                                    container.scrollBy({ left: 200, behavior: 'smooth' })
                                                }
                                            }}
                                            className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <div
                                    id="photo-container"
                                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                                >
                                    {memorialDetails?.photos?.map((photo: { fileId: Key | null | undefined; fileURL: string | undefined; photoCaption: string | undefined }, index: number) => (
                                        <div key={photo?.fileId} className="flex-shrink-0 w-[200px] space-y-2">
                                            <div className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm" onClick={() => handleViewPhoto(photo, index)}>
                                                <img
                                                    src={photo?.fileURL}
                                                    alt={`Photo ${photo?.photoCaption || index + 1}`}
                                                    className="w-full h-[180px] object-cover"
                                                />
                                            
                                            </div>
                                            <p className="font-poppins font-[400] text-sm text-[#ffffff] line-clamp-2">
                                                {photo?.photoCaption}
                                            </p>
                                        </div>
                                    ))}
                                </div>
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
            </div>


            {/* Video Modal */}
            {isVideoModalOpen && currentVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl mx-4">
                        <button
                            onClick={handleCloseVideoModal}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        
                        {/* Video Navigation Arrows */}
                        {memorialDetails?.videos?.length > 1 && (
                            <>
                                <button
                                    onClick={handlePreviousVideo}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white hover:text-gray-300 transition-colors z-10"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={handleNextVideo}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:text-gray-300 transition-colors z-10"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}
                        
                        <div className="bg-black rounded-lg overflow-hidden">
                            <video
                                src={currentVideo.fileURL}
                                controls
                                autoPlay
                                className="w-full h-auto max-h-[70vh]"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="p-4 bg-gray-900">
                                <h3 className="text-white font-poppins text-lg">
                                    {currentVideo.title}
                                </h3>
                                {memorialDetails?.videos?.length > 1 && (
                                    <p className="text-gray-400 text-sm mt-1">
                                        {currentVideoIndex + 1} of {memorialDetails.videos.length}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Photo Modal */}
            {isPhotoModalOpen && currentPhoto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl mx-4">
                        <button
                            onClick={handleClosePhotoModal}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
                        >
                            <X className="w-8 h-8" />
                        </button>
                        
                        {/* Photo Navigation Arrows */}
                        {memorialDetails?.photos?.length > 1 && (
                            <>
                                <button
                                    onClick={handlePreviousPhoto}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-white hover:text-gray-300 transition-colors z-10"
                                >
                                    <ChevronLeft className="w-8 h-8" />
                                </button>
                                <button
                                    onClick={handleNextPhoto}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-white hover:text-gray-300 transition-colors z-10"
                                >
                                    <ChevronRight className="w-8 h-8" />
                                </button>
                            </>
                        )}
                        
                        <div className="bg-black rounded-lg overflow-hidden">
                            <img
                                src={currentPhoto?.fileURL}
                                alt={`Photo ${currentPhotoIndex + 1}`}
                                className="w-full h-auto max-h-[70vh] object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                            <div className="p-4 bg-gray-900">
                                <h3 className="text-white font-poppins text-lg">
                                    {currentPhoto?.photoCaption || `Photo ${currentPhotoIndex + 1}`}
                                </h3>
                                {memorialDetails?.photos?.length > 1 && (
                                    <p className="text-gray-400 text-sm mt-1">
                                        {currentPhotoIndex + 1} of {memorialDetails.photos.length}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
