import { useEffect, useState } from 'react'
import { apiSetFeaturedMemorial, apiGetMemorialById } from '@/services/axios/MemorialModeService'
import { useMemorialStore } from '@/store/memorialStore'
import { toast, Notification } from '@/components/ui'
import { ArrowLeft, Copy, Facebook, Play, QrCode, Twitter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MemberAvatar from '../../../public//img//others/member-avatar-4.jpg.png'
import videoFrame12 from '../../../public/img/others/FRAME (12).png'
import videoFrame13 from '../../../public/img/others/FRAME (13).png'
import videoFrame14 from '../../../public/img/others/FRAME (14).png'
import VideoFrame from '../../../public//img/others/FRAME (11).png'
import LogoFrame from '../../../public//img/others/FRAME (16).png'

export default function VideoMemorial() {
    const [activeVideo, setActiveVideo] = useState<string | null>(null)
    const [copiedUrl, setCopiedUrl] = useState(false)
    const [memorialDetails, setMemorialDetails] = useState<any>(null)
    const { memorials, fetchMemorials, activeMemorialId } = useMemorialStore()
    const memorialId = activeMemorialId

    const navigate = useNavigate()

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
        navigator.clipboard.writeText('memorial.com/robert-johnson')
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
    }

    const handlePlayVideo = (videoId: string) => {
        setActiveVideo(videoId)
        // Video play logic would go here
    }

    const galleryItems = [
        {
            id: 'personal-journey',
            title: 'Personal Journey',
            subtitle: 'A life of adventure and exploration',
            thumbnail: videoFrame12,
            hasPlayButton: true,
        },
        {
            id: 'celebrations',
            title: 'Celebrations',
            subtitle: 'Special moments of joy and accomplishment',
            thumbnail: videoFrame13,

            hasPlayButton: true,
        },
        {
            id: 'historical-photos',
            title: 'Historical Photographs',
            subtitle: 'Memories preserved through the years',
            thumbnail: videoFrame14,
            hasPlayButton: true,
        },
    ]

    return (
        <>
            <div className="flex items-center justify-between gap-4 p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft />
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
                    className="md:px-6 px-3 md:py-2.5 py-1 border border-[#FFB84C] text-[#FFB84C] rounded-md font-poppins text-base hover:bg-[#FFB84C]/10 transition-colors"
                >
                    Set As Featured
                </button>
            </div>
            <div className="min-h-screen">
                {/* Hero Section with Profile and Testimonial */}
                <div
                    className="relative w-full bg-cover bg-center"
                // style={{
                //     backgroundImage:
                //         "url('https://api.builder.io/api/v1/image/assets/TEMP/2f525d80d45fde76e6bf817c53bf3e2a59dc45ea?width=2880')",
                // }}
                >
                    {/* Overlay */}
                    <div className="absolute inset-0"></div>

                    <div className="relative max-w-7xl mx-auto px-6 py-12">
                        {/* Profile Info + Quote wrapper */}
                        <div className="flex flex-col md:items-center md:justify-between lg:flex-row lg:items-end lg:justify-between gap-8">
                            {/* Profile Info */}
                            <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8">
                                <div className="flex justify-center sm:justify-start">
                                    <img
                                        src={MemberAvatar}
                                        alt="James William Thompson"
                                        className="w-[140px] h-[170px] sm:w-[164px] sm:h-[201px] rounded-[10px] object-cover shadow-lg"
                                    />
                                </div>
                                <div className="flex flex-col gap-2.5 text-center sm:text-left">
                                    <div className="space-y-1">
                                        <p className="DMSerif text-[28px] sm:text-[42px] leading-[34px] sm:leading-[50px] text-[#ffffff]">
                                            {memorialDetails?.personName || (
                                                <>
                                                    James William
                                                    <br />
                                                    Thompson
                                                </>
                                            )}
                                        </p>
                                        <div className="font-poppins text-lg sm:text-2xl text-[#ffffff]">
                                            1945–2023
                                        </div>
                                    </div>
                                    <div className="monteCarlo text-lg sm:text-[22px] text-[#ffffff]">
                                        A Life Well Lived
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial Quote */}
                            <div className="md:max-w-[500px] w-full">
                                <div className="bg-white/80 md:bg-transparent rounded-lg md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                                    <p className="font-poppins text-base sm:text-[19px] text-[#ffffff] leading-relaxed mb-4 sm:mb-6 text-center md:text-left">
                                        James was always the first to offer help
                                        when anyone needed it. I remember when
                                        our family was going through a difficult
                                        time...
                                    </p>
                                    <div className="flex justify-center lg:justify-end">
                                        <button
                                            onClick={() =>
                                                navigate(
                                                    '/dashboard/edit-memorial',
                                                )
                                            }
                                            className="text-black font-poppins text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 rounded-[1000px] transition-colors"
                                            style={{
                                                background: "linear-gradient(96.23deg, #ECA024 5.01%, #F9C94F 50.03%, #EAA32A 95.05%)"
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

                {/* Main Tribute Gallery Section */}
                <div className="py-12">
                    <div className="max-w-4xl mx-auto px-6">
                        {/* Main Video Player */}
                        <div className="mb-8">
                            <div className="relative">
                                {/* Golden Border Frame */}
                                <div className="border-2 border-[#C7A30D] bg-white/30 p-3.5 rounded-lg">
                                    <div className="relative md:w-full md:h-[452px] rounded-lg overflow-hidden">
                                        <img
                                            src={VideoFrame}
                                            alt="Tribute Gallery Main Video"
                                            className="md:w-full md:h-full object-cover"
                                        />

                                        {/* Play Button Overlay */}
                                        {activeVideo !== 'main' && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <button
                                                    onClick={() =>
                                                        handlePlayVideo('main')
                                                    }
                                                    className="w-15 h-15 bg-[#C7A30D] rounded-full flex items-center justify-center hover:bg-[#B8940C] transition-colors shadow-lg"
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

                            {/* Section Title */}
                            <div className="text-center mt-8 space-y-2">
                                <p className="DMSerif md:text-[40px] text-2xl text-white leading-tight text-[#2E2117]">
                                    Tribute Gallery
                                </p>
                                <p className="monteCarlo text-xl text-white">
                                    Honoring the cherished memories and
                                    celebrating a remarkable life
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gallery Sections */}
                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {galleryItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col items-center space-y-4"
                                >
                                    {/* Video/Image Frame */}
                                    <div className="relative">
                                        <div className="border-2 border-[#C7A30D] bg-white/30 p-3.5 rounded-lg">
                                            <div className="relative w-80 h-60 rounded-lg overflow-hidden">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* Play Button Overlay */}
                                                {item.hasPlayButton &&
                                                    activeVideo !== item.id && (
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                            <button
                                                                onClick={() =>
                                                                    handlePlayVideo(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="w-10 h-10 bg-[#C7A30D] rounded-full flex items-center justify-center hover:bg-[#B8940C] transition-colors shadow-lg"
                                                            >
                                                                <Play
                                                                    className="w-5 h-5 text-white ml-0.5"
                                                                    fill="currentColor"
                                                                />
                                                            </button>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Title and Subtitle */}
                                    <div className="text-center space-y-1">
                                        <p className="DMSerif md:text-2xl text-xl text-[#fff]">
                                            {item.title}
                                        </p>
                                        <p className="monteCarlo text-base text-[#fff]">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Decorative Divider */}
                <div className="flex items-center justify-center gap-6 py-8">
                    <div className="w-[200px] h-0.5 bg-gradient-to-r from-transparent via-[#B99F6B] to-transparent"></div>

                    {/* Cross/Star Icon */}
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

                {/* Footer */}
                <section className="bg-[#2F3349] border border-[#F3F4F6] rounded-lg p-6 shadow-sm">
                    <p className="font-poppins text-lg text-[#ffffff] mb-4">
                        Share Memorial Page
                    </p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Social Sharing */}
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

                            {/* URL Copy */}
                            <div className="space-y-1">
                                <label className="font-poppins text-sm text-[#ffffff]">
                                    Memorial URL
                                </label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value="memorial.com/robert-johnson"
                                        readOnly
                                        className="flex-1 px-3 py-2 bg-transparent border border-[#D1D5DB] rounded-l-md font-poppins text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D]"
                                    />
                                    <button
                                        // onClick={handleCopyUrl}
                                        className={`px-3 py-2 border border-[#D1D5DB] border-l-0 rounded-r-md bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors ${copiedUrl ? 'bg-green-100' : ''}`}
                                    >
                                        <Copy className="w-4 h-4 text-[#ffffff]" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center border-l border-[#E5E7EB] pl-6">
                            <div className="w-[120px] h-[120px] bg-[#1F2937] rounded-lg flex items-center justify-center mb-3">
                                <QrCode className="w-20 h-20 text-white" />
                            </div>
                            <p className="font-poppins text-sm text-[#ffffff] text-center mb-2">
                                Scan for in-person sharing
                            </p>
                            <button className="font-poppins text-sm text-[#C7A30D] hover:underline">
                                Download QR Code
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
