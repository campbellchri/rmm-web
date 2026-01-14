import { useEffect, useState } from 'react'
import { apiSetFeaturedMemorial, apiGetMemorialById } from '@/services/axios/MemorialModeService'
import { useMemorialStore } from '@/store/memorialStore'
import { toast, Notification } from '@/components/ui'
import { Play, Facebook, Twitter, Copy, QrCode, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import MemberAvatar from '../../../public/img/others/member-avatar-4.jpg.png'
import FeaturedExperice from '../../../public//img/others/FRAMEFRAME.png'
import videoFrame1 from '../../../public/img//others/FRAME (1).png'
import videoFrame2 from '../../../public/img//others/FRAME (2).png'
import videoFrame3 from '../../../public/img//others/FRAME (3).png'
import photoFrame4 from '../../../public/img//others/FRAME (4).png'
import photoFrame5 from '../../../public/img//others/FRAME (5).png'
import photoFrame6 from '../../../public/img//others/FRAME (6).png'
import photoFrame7 from '../../../public/img//others/FRAME (7).png'

export default function Memorial() {
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

    const videos = [
        {
            id: 1,
            title: '70th Birthday Celebration',
            thumbnail: videoFrame1,
        },
        {
            id: 2,
            title: 'Family Vacation - Italy 2018',
            thumbnail: videoFrame2,
        },
        {
            id: 3,
            title: 'Retirement Speech',
            thumbnail: videoFrame3,
        },
    ]

    const photoAlbums = [
        {
            id: 1,
            image: photoFrame4,
        },
        {
            id: 2,
            image: photoFrame5,
        },
        {
            id: 3,
            image: photoFrame6,
        },
        {
            id: 4,
            image: photoFrame7,
        },
    ]

    const favoriteSayings = [
        {
            id: 1,
            quote: 'The best way to find yourself is to lose yourself in the service of others.',
            attribution: 'Often quoted by James',
        },
        {
            id: 2,
            quote: 'Life is 10% what happens to you and 90% how you react to it.',
            attribution: "James' personal motto",
        },
        {
            id: 3,
            quote: "In the end, we'll all become stories. Make yours a good one.",
            attribution: 'James to his grandchildren',
        },
    ]

    return (
        <>
        <div className="flex items-center justify-between">

            <div className="flex items-center  gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft />
                </button>
            </div>
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
            {/* Hero Section with Profile and Testimonial */}
            <div
                className="relative w-full bg-cover bg-center"
                // style={{
                //     backgroundImage:
                //         "url('https://api.builder.io/api/v1/image/assets/TEMP/2f525d80d45fde76e6bf817c53bf3e2a59dc45ea?width=2880')",
                // }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-transparent"></div>

                <div className="relative max-w-7xl mx-auto px-6 py-12">
                    {/* Profile Info + Quote wrapper */}
                    <div className="flex flex-col md:items-center md:justify-center lg:flex-row lg:items-end lg:justify-between gap-8">
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
                                        1945–2023
                                    </div>
                                </div>
                                <div className="monteCarlo text-lg sm:text-[22px] text-[#ffffff]">
                                    A Life Well Lived
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Quote */}
                        <div className="lg:max-w-[500px] w-full">
                            <div className="bg-transparent rounded-lg md:rounded-none p-4 md:p-0 shadow-sm md:shadow-none">
                                <p className="font-poppins text-base md:text-[19px] text-[#ffffff] leading-relaxed mb-4 sm:mb-6 text-center md:text-left">
                                    James was always the first to offer help
                                    when anyone needed it. I remember when our
                                    family was going through a difficult time...
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

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="space-y-16">
                    {/* Featured Experience */}
                    <section className="space-y-6">
                        <p className="DMSerif md:text-[28px] text-lg text-[#ffffff]">
                            Featured Experience
                        </p>
                        <div className="rounded-lg shadow-md overflow-hidden">
                            <img
                                src={FeaturedExperice}
                                alt="Featured Experience"
                                className="md:w-full md:h-[420px] object-cover"
                            />
                            <div className="bg-[#2F3349] p-6 space-y-2">
                                <p className="font-poppins text-base  font-[400] text-[#ffffff]">
                                    A collection of James' most cherished
                                    moments throughout his life, from childhood
                                    adventures to his last family gathering.
                                </p>
                                <p className="font-poppins italic font-[400] text-sm text-[#ffffff]">
                                    Selected by family
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Videos Section */}
                    <section className="space-y-6">
                        <p className="DMSerif md:text-2xl text-lg text-[#263859]">
                            Videos
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                            {videos.map((video) => (
                                <div key={video.id} className="space-y-2">
                                    <div className="relative group cursor-pointer rounded-lg overflow-hidden shadow-sm">
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-[140px] object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                            <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                                <Play
                                                    className="w-4 h-4 text-[#263859] ml-0.5"
                                                    fill="currentColor"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="font-poppins font-[400] md:text-base text-sm text-[#ffffff]">
                                        {video.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Photo Albums */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">
                                Photo Albums
                            </p>
                            {/* <button className="font-lora text-sm text-[#263859] hover:underline">
                                View All Albums (8)
                            </button> */}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {photoAlbums.map((album) => (
                                <div
                                    key={album.id}
                                    className="cursor-pointer group"
                                >
                                    <img
                                        src={album.image}
                                        alt={`Photo Album ${album.id}`}
                                        className="w-full h-[180px] object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Favorite Sayings */}
                    {/* <section className="space-y-6">
                        <p className="DMSerif md:text-2xl text-lg text-[#263859]">
                            Favorite Sayings
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favoriteSayings.map((saying) => (
                                <div
                                    key={saying.id}
                                    className="bg-[#F5F5F5] rounded-lg p-6 shadow-sm relative"
                                >
                                    <div className="font-lora text-4xl text-[#C7A30D] absolute top-2 left-4">
                                        ❝
                                    </div>
                                    <div className="pt-8 space-y-4">
                                        <p className="font-poppins italic md:text-lg text-base text-[#333333] leading-relaxed">
                                            {saying.quote}
                                        </p>
                                        <p className="font-poppins text-sm text-[#6B7280] text-right">
                                            ― {saying.attribution}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section> */}

                    {/* Life Story */}
                    <section className="space-y-6">
                        <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">
                            Life Story
                        </p>
                        <div className="bg-[#2F3349] rounded-lg p-6 shadow-sm">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex-shrink-0 flex justify-center md:justify-start">
                                    <img
                                        src={MemberAvatar}
                                        alt="James William Thompson"
                                        className="w-[220px] h-[280px] object-cover rounded-md"
                                    />
                                </div>
                                <div className="flex-1 space-y-6">
                                    <p className="font-poppins text-base text-[#ffffff] leading-relaxed">
                                        James William Thompson was born on March
                                        15, 1945, in Portland, Oregon, to
                                        William and Eleanor Thompson. The eldest
                                        of three siblings, James showed an early
                                        interest in science and nature, often
                                        exploring the woods behind their family
                                        home and collecting specimens for his
                                        makeshift laboratory.
                                    </p>
                                    <p className="font-poppins text-base text-[#ffffff] leading-relaxed">
                                        After graduating with honors from
                                        Lincoln High School in 1963, James
                                        attended Stanford University, where he
                                        earned his bachelor's degree in Biology.
                                        It was during his university years that
                                        he met his future wife, Catherine
                                        Miller, at a campus debate society
                                        meeting. They married in 1968, shortly
                                        after graduation.
                                    </p>
                                    <p className="font-poppins text-base text-[#ffffff] leading-relaxed">
                                        James began his professional career at
                                        Pacific Northwest Research Institute,
                                        where his groundbreaking work on
                                        cellular regeneration earned him
                                        recognition in the scientific
                                        community...
                                    </p>
                                    <button className="font-poppins text-base text-[#ffffff] hover:underline">
                                        Read Full Biography
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Share Memorial Page */}
                    <section className="bg-[#2F3349] border border-[#F3F4F6] rounded-lg p-6 shadow-sm">
                        <p className="font-poppins text-lg text-[#ffffff] mb-4">
                            Share Memorial Page
                        </p>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Social Sharing */}
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

                                {/* URL Copy */}
                                <div className="space-y-1">
                                    <label className="font-poppins text-sm text-[#4B5563]">
                                        Memorial URL
                                    </label>
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value="memorial.com/robert-johnson"
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-white border border-[#D1D5DB] rounded-l-md font-poppins text-sm text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#C7A30D]"
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
            </div>
        </>
    )
}
