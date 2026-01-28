import { useEffect, useState, useRef } from 'react'
import React from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { apiGetMemorialById } from '@/services/axios/MemorialModeService'
import { useParams } from 'react-router-dom'
import { Copy, Facebook, Play, QrCode, Twitter } from 'lucide-react'

import VideoFrame from '../../../public/img/others/FRAME (11).png'
import LogoFrame from '../../../public/img/others/FRAME (16).png'
import HomeNavbar from '../Home/HomeNavbar'
import dayjs from 'dayjs'

export default function VideoOnlyMemorialPublic({ memorial }: { memorial: any }) {
    const [activeVideo, setActiveVideo] = useState<string | null>(null)
    const [copiedUrl, setCopiedUrl] = useState(false)

    const { slug } = useParams<{ slug: string }>()
    const qrRef = useRef<HTMLCanvasElement>(null)
    const LogoLink = '/img/others/Link.png'

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
            <div className='bg-[url("/img/others/full_memorial_bg.png")] bg-cover bg-center w-full'>
                <HomeNavbar />
                <div className="flex-shrink-0 flex items-center justify-center ">
                    <img
                        src={LogoLink}
                        alt="Remember Memorials Logo"
                        className="h-32 sm:h-40 md:h-52 lg:h-70 w-auto mt-[-40px] sm:mt-[-60px] md:mt-[-75px] lg:mt-[-100px]"
                    />
                </div>
                <div className="relative w-full bg-cover bg-center">
                    <div className="relative max-w-7xl mx-auto px-6 py-12">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 relative">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
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
                                        {memorial?.personBirthDate && memorial?.personDeathDate && (
                                            <div className="font-poppins text-lg md:text-2xl text-[#ffffff]">
                                                {`${dayjs(memorial.personBirthDate).format('YYYY')}-${dayjs(
                                                    memorial.personDeathDate
                                                ).format('YYYY')}`}
                                            </div>
                                        )}
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
                            <svg width="112" height="82" viewBox="0 0 112 82" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute top-0 right-95'>
                                <path opacity="0.1" d="M29.8698 81.4629C21.384 81.4629 14.256 78.5778 8.48575 72.8075C2.82861 66.924 3.39787e-05 58.4949 3.39787e-05 47.52C3.39787e-05 38.808 2.31946 30.888 6.95832 23.76C11.7103 16.5189 18.4423 10.7486 27.1543 6.44918C35.9795 2.14975 45.144 3.78895e-05 54.648 3.78895e-05L58.0423 4.75204C55.2138 4.75204 51.5932 5.31775 47.1806 6.44918C42.768 7.46747 38.412 9.05147 34.1126 11.2012C29.8132 13.3509 26.2492 16.0663 23.4206 19.3475C19.1212 24.3258 16.9715 28.3989 16.9715 31.5669C17.8766 30.3223 19.9132 29.2475 23.0812 28.3423C26.2492 27.324 29.6435 26.8149 33.264 26.8149C42.3155 26.8149 49.2172 30.5486 53.9692 38.016C55.6663 30.4355 59.0606 23.8166 64.152 18.1595C69.3566 12.5023 75.6926 8.08976 83.16 4.92176C90.7406 1.64061 98.8869 3.78895e-05 107.599 3.78895e-05L110.993 4.75204C108.165 4.75204 104.544 5.31775 100.131 6.44918C95.7189 7.46747 91.3629 9.05147 87.0635 11.2012C82.764 13.3509 79.2 16.0663 76.3715 19.3475C72.072 24.3258 69.9223 28.3989 69.9223 31.5669C70.8275 30.3223 72.864 29.2475 76.032 28.3423C79.2 27.324 82.5943 26.8149 86.2149 26.8149C91.1932 26.8149 95.5492 28.0029 99.2829 30.3789C103.017 32.7549 105.958 35.9795 108.108 40.0526C110.258 44.0126 111.333 48.4252 111.333 53.2903C111.333 61.4366 108.73 68.1686 103.526 73.4863C98.4343 78.804 91.5326 81.4629 82.8206 81.4629C76.9372 81.4629 71.6195 79.992 66.8675 77.0503C62.1155 74.1086 58.608 70.0355 56.3452 64.8309C54.1955 70.0355 50.8578 74.1086 46.332 77.0503C41.8063 79.992 36.3189 81.4629 29.8698 81.4629Z" fill="white" />
                            </svg>
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

                <section className="bg-[#2F3349] rounded-lg p-6 shadow-sm max-w-[76rem] mx-auto mb-16">
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
