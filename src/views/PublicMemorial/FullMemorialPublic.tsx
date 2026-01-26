import { useState, useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { useForm } from 'react-hook-form'
import CommonInput from '@/components/shared/CommonInput'
import { Play, Facebook, Twitter, Copy, QrCode } from 'lucide-react'

export default function FullMemorialPublic({ memorial }: { memorial: any }) {
    const [copiedUrl, setCopiedUrl] = useState(false)
    const { control, setValue } = useForm({
        defaultValues: { memorialUrl: '' },
    })
    const qrRef = useRef<HTMLCanvasElement>(null)
    const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

 
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

    return (
        <div className=" px-6 py-10 space-y-16 bg-[#25293C]">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8">
                    <div className="flex justify-center sm:justify-start">
                        <img
                            src={memorial?.personProfilePicture}
                            alt={memorial?.personName}
                            className="w-[140px] h-[170px] sm:w-[164px] sm:h-[201px] rounded-[10px] object-cover shadow-lg"
                        />
                    </div>
                    <div className="flex flex-col gap-2.5 text-center sm:text-left">
                        <p className="DMSerif text-[28px] md:text-[42px] text-[#ffffff]">
                            {memorial?.personName || 'Unknown'}
                        </p>
                        {memorial?.personBirthDate && memorial?.personDeathDate && (
                            <div className="font-poppins text-lg md:text-2xl text-[#ffffff]">
                                {`${new Date(memorial.personBirthDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })} - ${new Date(memorial.personDeathDate).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}`}
                            </div>
                        )}
                        <div className="monteCarlo text-lg sm:text-[22px] text-[#ffffff]">
                            A Life Well Lived
                        </div>
                    </div>
                </div>

                {memorial?.favQuote && (
                    <div className="bg-transparent rounded-lg p-4 md:p-0 shadow-sm md:shadow-none text-center md:text-left">
                        <p className="font-poppins text-base md:text-[19px] text-[#ffffff] leading-relaxed">
                            {memorial.favQuote}
                        </p>
                    </div>
                )}
            </div>

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
                                                src={video.thumbnail}
                                                alt={video.title}
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
                                    {video.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

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

            <section className="bg-[#2F3349] rounded-lg p-6 shadow-sm">
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
                        <div className="w-[140px] h-[140px] bg-white rounded-lg flex items-center justify-center mb-3 p-3 shadow-inner">
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
    )
}
