import { useState, useRef, useEffect } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useForm } from 'react-hook-form'
import CommonInput from '@/components/shared/CommonInput'
import { Play, Facebook, Twitter, Copy, QrCode } from 'lucide-react'
import Header from '@/components/template/Header'
import HomeNavbar from '../Home/HomeNavbar'
import dayjs from 'dayjs'
import { generateThumbnail } from '@/utils'

export default function FullMemorialPublic({ memorial }: { memorial: any }) {
    const [copiedUrl, setCopiedUrl] = useState(false)
    const { control, setValue } = useForm({
        defaultValues: { memorialUrl: '' },
    })
    const qrRef = useRef<HTMLCanvasElement>(null)
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
    const [videoThumbnails, setVideoThumbnails] = useState<{ [key: string]: string }>({})


    const handleCopyUrl = () => {
        if (!memorial?.slug) return

        const url = `${window.location.origin}/memorials/public/${memorial.slug}`
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
            link.download = `memorial-qr-${memorial?.personName || 'code'}.png`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    const handlePlayVideo = (videoId: string) => {
        setActiveVideoId(videoId)
    }

    const LogoLink = '/img/others/Link.png'

        useEffect(() => {
        memorial?.videos?.forEach(async (video) => {
            if (!video.thumbnail && video.fileURL) {
            try {
                const thumb = await generateThumbnail(video.fileURL)
                setVideoThumbnails(prev => ({ ...prev, [video.id]: thumb }))
            } catch (err) {
                console.error('Thumbnail generation failed', err)
            }
            }
        })
        }, [memorial])   

    return (
        <>
            <div className="space-y-16 bg-[url('/img/others/full_memorial_bg.png')] bg-cover bg-center w-full">
                <HomeNavbar />
                <div className="flex-shrink-0 flex items-center justify-center ">
                    <img
                        src={LogoLink}
                        alt="Remember Memorials Logo"
                        className="h-32 sm:h-40 md:h-52 lg:h-70 w-auto mt-[-40px] sm:mt-[-60px] md:mt-[-75px] lg:mt-[-150px]"
                    />
                </div>
                <div className='relative max-w-7xl mx-auto px-6 py-12'>
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 relative">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
                            <div className="flex justify-center sm:justify-start">
                                <img
                                    src={memorial?.personProfilePicture}
                                    alt={memorial?.personName}
                                    className="w-[140px] h-[170px] sm:w-[164px] sm:h-[201px] rounded-[10px] object-cover shadow-lg"
                                />
                            </div>
                            <div className="flex flex-col gap-2.5 text-center sm:text-left">
                            <p className="font-DMSerif text-[28px] font-[400] md:text-[42px] text-[#ffffff]">
                                    {memorial?.personName || 'Unknown'}
                                </p>
                             {memorial?.personBirthDate && memorial?.personDeathDate && (
                                <div className="font-poppins text-lg md:text-2xl text-[#ffffff]">
                                    {`${dayjs(memorial.personBirthDate).format('YYYY')}-${dayjs(
                                    memorial.personDeathDate
                                    ).format('YYYY')}`}
                                </div>
                                )}
                            </div>
                        </div>
                        {memorial?.favQuote && (
                            <div className="bg-transparent rounded-lg p-4 md:p-0 shadow-sm md:shadow-none text-center md:text-left">
                                <p className="font-poppins text-base md:text-[19px] text-[#ffffff] leading-relaxed">
                                    {memorial.favQuote}
                                </p>
                            </div>
                        )}

                        <svg width="112" height="82" viewBox="0 0 112 82" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute top-10 right-40'>
                         <path opacity="0.1" d="M29.8698 81.4629C21.384 81.4629 14.256 78.5778 8.48575 72.8075C2.82861 66.924 3.39787e-05 58.4949 3.39787e-05 47.52C3.39787e-05 38.808 2.31946 30.888 6.95832 23.76C11.7103 16.5189 18.4423 10.7486 27.1543 6.44918C35.9795 2.14975 45.144 3.78895e-05 54.648 3.78895e-05L58.0423 4.75204C55.2138 4.75204 51.5932 5.31775 47.1806 6.44918C42.768 7.46747 38.412 9.05147 34.1126 11.2012C29.8132 13.3509 26.2492 16.0663 23.4206 19.3475C19.1212 24.3258 16.9715 28.3989 16.9715 31.5669C17.8766 30.3223 19.9132 29.2475 23.0812 28.3423C26.2492 27.324 29.6435 26.8149 33.264 26.8149C42.3155 26.8149 49.2172 30.5486 53.9692 38.016C55.6663 30.4355 59.0606 23.8166 64.152 18.1595C69.3566 12.5023 75.6926 8.08976 83.16 4.92176C90.7406 1.64061 98.8869 3.78895e-05 107.599 3.78895e-05L110.993 4.75204C108.165 4.75204 104.544 5.31775 100.131 6.44918C95.7189 7.46747 91.3629 9.05147 87.0635 11.2012C82.764 13.3509 79.2 16.0663 76.3715 19.3475C72.072 24.3258 69.9223 28.3989 69.9223 31.5669C70.8275 30.3223 72.864 29.2475 76.032 28.3423C79.2 27.324 82.5943 26.8149 86.2149 26.8149C91.1932 26.8149 95.5492 28.0029 99.2829 30.3789C103.017 32.7549 105.958 35.9795 108.108 40.0526C110.258 44.0126 111.333 48.4252 111.333 53.2903C111.333 61.4366 108.73 68.1686 103.526 73.4863C98.4343 78.804 91.5326 81.4629 82.8206 81.4629C76.9372 81.4629 71.6195 79.992 66.8675 77.0503C62.1155 74.1086 58.608 70.0355 56.3452 64.8309C54.1955 70.0355 50.8578 74.1086 46.332 77.0503C41.8063 79.992 36.3189 81.4629 29.8698 81.4629Z" fill="white"/>
                        </svg>
                    </div>
                </div>

                <div className='relative max-w-7xl mx-auto px-6 py-10'>
                    {memorial?.featuredPhotoURL && (
                        <section className="space-y-6">
                            <p className="DMSerif md:text-[28px] text-lg text-[#ffffff]">
                                Featured Experience
                            </p>
                            <div className="rounded-lg shadow-md overflow-hidden">
                                <img
                                    src={memorial.featuredPhotoURL}
                                    alt="Featured Experience"
                                    className="md:w-full md:h-[420px] object-cover"
                                />
                                <div className="bg-[#2F3349] p-6 space-y-2">
                                    <p className="font-poppins text-base text-[#ffffff]">
                                        {memorial?.favoriteSayings?.[0]?.content}
                                    </p>
                                    <p className="font-poppins italic text-sm text-[#ffffff]">
                                        {memorial?.favoriteSayings?.[0]?.authorName}
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <div className='relative max-w-7xl mx-auto px-6 py-10'>
                    {memorial?.videos?.length > 0 && (
                        <section className="space-y-6">
                            <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">Videos</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                                {memorial.videos.map((video: any) => (
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
                                                       src={video.thumbnail || videoThumbnails[video.id]}
                                                        alt={video.videoTitle}
                                                        className="w-full h-[140px] object-cover"
                                                        onClick={() => handlePlayVideo(video.id)}
                                                    />
                                                    <div
                                                        className="absolute inset-0 bg-black/30 flex items-center justify-center"
                                                        onClick={() => handlePlayVideo(video.id)}
                                                    >
                                                        <div className="w-12 h-12 bg-white/80 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                                            <Play
                                                                className="w-4 h-4 text-[#263859]"
                                                                fill="currentColor"
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <p className="font-poppins text-sm md:text-base text-[#ffffff]">
                                            {video.videoTitle}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className='relative max-w-7xl mx-auto px-6 py-10'>
                    {memorial?.photos?.length > 0 && (
                        <section className="space-y-6">
                            <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">Photos</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                {memorial.photos.map((album: any) => (
                                    <div key={album.fileId} className="cursor-pointer group">
                                        <img
                                            src={album.fileURL}
                                            alt={album.photoCaption || 'Photo'}
                                            className="w-full h-[180px] object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
                <div className='relative max-w-7xl mx-auto px-6 py-10'>
                    {memorial?.lifeStoryText && (
                        <section className="space-y-6">
                            <p className="DMSerif md:text-2xl text-lg text-[#ffffff]">Life Story</p>
                            <div className="bg-[#2F3349] rounded-lg p-6 shadow-sm">
                                <div className="flex flex-col md:flex-row gap-8">
                                    <div className="flex-shrink-0 flex justify-center md:justify-start">
                                        <img
                                            src={memorial.lifeStoryImageURL}
                                            alt={memorial.personName}
                                            className="w-[220px] h-[280px] object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-poppins text-base text-[#ffffff] leading-relaxed">
                                            {memorial.lifeStoryText}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <section className="bg-[#2F3349] rounded-lg p-6 shadow-sm relative max-w-[76rem] mx-auto px-6 py-10 my-8">
                    <p className="font-poppins text-lg text-[#ffffff] mb-4">Share Memorial Page</p>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <p className="font-poppins text-base text-[#ffffff]">
                                Share this memorial page with friends and family
                            </p>
                            <div className="flex gap-3">
                                <button className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center hover:bg-[#1D4ED8] transition-colors">
                                    <Facebook className="w-5 h-5 text-white" fill="currentColor" />
                                </button>
                                <button className="w-10 h-10 bg-[#60A5FA] rounded-full flex items-center justify-center hover:bg-[#3B82F6] transition-colors">
                                    <Twitter className="w-5 h-5 text-white" fill="currentColor" />
                                </button>
                            </div>

                            <div className="space-y-1">
                                <label className="font-poppins text-sm text-[#ffffff]">Memorial URL</label>
                                <div className="flex">
                                    <CommonInput
                                        name="memorialUrl"
                                        control={control}
                                        value={
                                            memorial?.slug
                                                ? `${window.location.origin}/memorials/public/${memorial.slug}`
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
                            <div className="w-[140px] h-[140px] rounded-lg flex items-center justify-center mb-3 p-3 shadow-inner">
                                {memorial?.pageURL ? (
                                    <QRCodeCanvas
                                        ref={qrRef}
                                        value={memorial?.qrCode?.qrCodeData || memorial?.pageURL}
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
