import { useEffect, useState, useRef } from 'react'
import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { apiGetMemorialById } from '@/services/axios/MemorialModeService'
import { useParams } from 'react-router-dom'
import { Copy, Facebook, Play, QrCode, Twitter } from 'lucide-react'

import VideoFrame from '../../../public/img/others/FRAME (11).png'
import LogoFrame from '../../../public/img/others/FRAME (16).png'

export default function VideoOnlyMemorialPublic({ memorial }: { memorial: any }) {
    const [activeVideo, setActiveVideo] = useState<string | null>(null)
    const [copiedUrl, setCopiedUrl] = useState(false)

    const { slug } = useParams<{ slug: string }>()
    const qrRef = useRef<HTMLCanvasElement>(null)

    const handleCopyUrl = () => {
        if (!memorial?.slug) return
        const url = `${window.location.origin}/memorials/public/${memorial.slug}`
        navigator.clipboard.writeText(url)
        setCopiedUrl(true)
        setTimeout(() => setCopiedUrl(false), 2000)
    }

    const handlePlayVideo = (videoId: string) => {
        setActiveVideo(videoId)
    }

    const handleDownloadQRCode = () => {
        if (!qrRef.current) return
        const canvas = qrRef.current
        const url = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.href = url
        link.download = `memorial-qr-${memorial?.personName || 'code'}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const featuredVideo = memorial?.userMedia?.find(
        (m: any) => m.category === 'featured' && m.type === 'video'
    )

    return (
        <React.Fragment>
            <div className='bg-[#25293c]'>
                <div className="relative w-full bg-cover bg-center">
                    <div className="relative max-w-7xl mx-auto px-6 py-12">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-6">
                                <img
                                    src={memorial?.personProfilePicture}
                                    alt={memorial?.personName}
                                    className="w-[140px] h-[170px] sm:w-[164px] sm:h-[201px] rounded-[10px] object-cover shadow-lg"
                                />

                                <div className="text-center sm:text-left space-y-2">
                                    <p className="DMSerif text-[28px] sm:text-[42px] text-white">
                                        {memorial?.personName}
                                    </p>
                                    <p className="font-poppins text-lg sm:text-2xl text-white">
                                        {memorial?.personBirthDate &&
                                            new Date(memorial.personBirthDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                        {' - '}
                                        {memorial?.personDeathDate &&
                                            new Date(memorial.personDeathDate).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}
                                    </p>
                                    <p className="monteCarlo text-lg sm:text-[22px] text-white">
                                        A Life Well Lived
                                    </p>
                                </div>
                            </div>

                            {memorial?.favQuote && (
                                <div className="max-w-[500px] text-center md:text-left">
                                    <p className="font-poppins text-base sm:text-[19px] text-white">
                                        {memorial.favQuote}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="py-12">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="border-2 border-[#C7A30D] bg-white/30 p-3.5 rounded-lg">
                            <div className="relative h-[452px] rounded-lg overflow-hidden bg-black">
                                {featuredVideo?.fileURL ? (
                                    <>
                                        <video
                                            src={featuredVideo.fileURL}
                                            controls={activeVideo === 'main'}
                                            autoPlay={activeVideo === 'main'}
                                            className="w-full h-full object-contain"
                                        />
                                        {activeVideo !== 'main' && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                                <button
                                                    onClick={() => handlePlayVideo('main')}
                                                    className="w-16 h-16 bg-[#C7A30D] rounded-full flex items-center justify-center"
                                                >
                                                    <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <img src={VideoFrame} className="w-full h-full object-cover opacity-60" />
                                )}
                            </div>
                        </div>

                        <div className="text-center mt-8 space-y-2">
                            <p className="DMSerif text-2xl md:text-[40px] text-white">
                                {featuredVideo?.videoTitle || 'Tribute Gallery'}
                            </p>
                            <p className="monteCarlo text-xl text-white">
                                {featuredVideo?.videoDescription}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="py-8">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {memorial?.videos?.map((item: any) => (
                            <div key={item.fileId} className="text-center space-y-4">
                                <div className="border-2 border-[#C7A30D] bg-white/30 p-3.5 rounded-lg">
                                    <div className="relative w-full h-60 bg-black rounded-lg overflow-hidden">
                                        {item.fileURL ? (
                                            <>
                                                <video
                                                    src={item.fileURL}
                                                    controls={activeVideo === item.fileId}
                                                    autoPlay={activeVideo === item.fileId}
                                                    className="w-full h-full object-contain"
                                                />
                                                {activeVideo !== item.fileId && (
                                                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                        <button
                                                            onClick={() => handlePlayVideo(item.fileId)}
                                                            className="w-10 h-10 bg-[#C7A30D] rounded-full"
                                                        >
                                                            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <img src={LogoFrame} className="w-full h-full object-cover opacity-60" />
                                        )}
                                    </div>
                                </div>

                                <p className="DMSerif text-xl text-white">{item.videoTitle}</p>
                                <p className="monteCarlo text-base text-white">{item.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <section className="bg-[#2F3349] rounded-lg p-6 shadow-sm max-w-7xl mx-auto mb-16">
                    <p className="font-poppins text-lg text-white mb-4">Share Memorial Page</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <button className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center">
                                    <Facebook className="w-5 h-5 text-white" fill="currentColor" />
                                </button>
                                <button className="w-10 h-10 bg-[#60A5FA] rounded-full flex items-center justify-center">
                                    <Twitter className="w-5 h-5 text-white" fill="currentColor" />
                                </button>
                            </div>

                            <div className="flex">
                                <input
                                    value={`${window.location.origin}/memorials/public/${memorial?.slug || ''}`}
                                    readOnly
                                    className="flex-1 px-3 py-2 bg-transparent border border-[#D1D5DB] rounded-l-md text-white"
                                />
                                <button
                                    onClick={handleCopyUrl}
                                    className={`px-3 py-2 bg-gray-100 rounded-r-md ${copiedUrl ? 'bg-green-200' : ''}`}
                                >
                                    <Copy className="w-4 h-4 text-gray-700" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <div className="w-[140px] h-[140px] bg-white rounded-lg flex items-center justify-center mb-3">
                                {memorial?.pageURL ? (
                                    <QRCodeCanvas
                                        ref={qrRef}
                                        value={memorial.pageURL}
                                        size={120}
                                    />
                                ) : (
                                    <QrCode className="w-20 h-20 text-gray-400" />
                                )}
                            </div>
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
        </React.Fragment>
    )
}
