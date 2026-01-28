import { useState, useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { Play, Copy, Facebook, Twitter, QrCode } from "lucide-react"
import { Memorial } from "./types"
import HomeNavbar from "../Home/HomeNavbar"

interface EventMemorialProps {
  memorial: Memorial
}

export default function EventMemorialPublic({ memorial }: EventMemorialProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)
  const qrRef = useRef<HTMLCanvasElement>(null)

  const videoUrl = memorial.userMedia?.find((m) => m.type === "video")?.fileURL
  const imageUrl = memorial.personProfilePicture

  const handlePlayVideo = () => setIsPlaying(true)

  const handleCopyUrl = () => {
    if (!memorial.pageURL) return
    navigator.clipboard.writeText(memorial.pageURL)
    setCopiedUrl(true)
    setTimeout(() => setCopiedUrl(false), 2000)
  }

  const handleDownloadQRCode = () => {
    if (qrRef.current) {
      const url = qrRef.current.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = url
      link.download = `memorial-qr-${memorial.personName || "code"}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div className="min-h-screen bg-[url('/img/others/full_memorial_bg.png')] bg-cover bg-center w-full">
      <HomeNavbar />
          <div className="flex-shrink-0 flex items-center justify-center ">
              <img
                  src="/img/others/Link.png"
                  alt="Remember Memorials Logo"
                  className="h-32 sm:h-40 md:h-52 lg:h-70 w-auto mt-[-40px] sm:mt-[-60px] md:mt-[-75px] lg:mt-[-130px]"
              />
          </div>
      <div className="py-16 relative">
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="DMSerif md:text-[42px] font-[400] text-[#FFFFFF] text-2xl mb-2">
            {memorial.personName}
          </p>
          {memorial?.favQuote && <p className="font-poppins text-[#FFFFFF] font-[500] text-[22px]">{memorial.favQuote}</p>}
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="relative border-2 border-[#C7A30D] rounded-lg overflow-hidden bg-black p-4">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  className="md:w-full md:h-[585px] object-contain"
                  controls={isPlaying}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  autoPlay={isPlaying}
                />
              ) : (
                <img src={imageUrl} alt="Memorial" className="md:w-full md:h-[585px] object-cover" />
              )}

              {!isPlaying && videoUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <button
                    onClick={handlePlayVideo}
                    className="w-15 h-15 bg-[#C7A30D] rounded-full flex items-center justify-center hover:bg-[#B8940C] transition-colors shadow-lg"
                  >
                    <Play className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>
              )}
            </div>

            {memorial.eventStart && (
              <div className="text-center mt-8 space-y-2">
                <p className="DMSerif md:text-[40px] text-[#FFFFFF] text-2xl leading-tight">
                  Memorial Service{" "}
                  {new Date(memorial.eventStart).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 py-8">
        <div className="w-[200px] h-0.5 bg-gradient-to-r from-transparent via-[#B99F6B] to-transparent"></div>
        <div className="w-8 h-8 text-[#C7A30D]">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M1.23438 0.902374C4.9555 7.9205 10.1412 13.5493 15.7519 19.1972L15.9785 19.4316L15.9824 19.4277C17.3466 20.7984 18.7349 22.1729 20.1328 23.5684C18.9543 24.4942 17.6969 25.3309 16.3866 26.0879L18.1699 27.871L22.4647 23.5762C25.1108 25.3034 27.2326 27.5541 28.9706 30.1893L30.7246 28.4356C28.0702 26.7172 25.7408 24.6727 24.0977 21.9433L28.4062 17.6347L26.6231 15.8516C25.9284 17.2174 25.0973 18.4775 24.1562 19.6386C21.4154 16.9011 18.7523 14.2735 16.0234 11.7967C16.0094 11.7841 15.9964 11.7704 15.9824 11.7577C11.4765 7.67187 6.78219 3.99437 1.23438 0.902374Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <div className="w-[200px] h-0.5 bg-gradient-to-r from-transparent via-[#B99F6B] to-transparent"></div>
      </div>

      <section className="bg-[#2F3349] rounded-lg p-6 shadow-sm max-w-[76rem] mx-auto my-6">
        <p className="font-poppins text-[#FFFFFF] text-lg mb-4">Share Memorial Page</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p className="font-poppins text-[#FFFFFF] text-base">Share this memorial page with friends and family</p>
            <div className="flex gap-3">
              <button className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center hover:bg-[#245cf7] transition-colors">
                <Facebook className="w-5 h-5 text-white" />
              </button>
              <button className="w-10 h-10 bg-[#60A5FA] rounded-full flex items-center justify-center hover:bg-[#3B82F6] transition-colors">
                <Twitter className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="font-poppins text-sm text-[#ffffff]">Memorial URL</label>
              <div className="flex">
                <input
                  type="text"
                  value={memorial.pageURL}
                  readOnly
                  className="flex-1 px-3 py-2 bg-transparent border border-[#D1D5DB] rounded-l-md font-poppins text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D]"
                />
                <button
                  onClick={handleCopyUrl}
                  className={`px-3 py-2 border border-[#D1D5DB] border-l-0 rounded-r-md bg-[#F3F4F6] hover:bg-[#E5E7EB] transition-colors ${copiedUrl ? "bg-green-100" : ""}`}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-l border-[#E5E7EB] pl-6">
            <div className="w-[140px] h-[140px] bg-white rounded-lg flex items-center justify-center mb-3 p-3 shadow-inner">
              {memorial.pageURL ? (
                <QRCodeCanvas ref={qrRef} value={memorial.qrCode?.qrCodeData || memorial.pageURL} size={120} marginSize={2} level="H" />
              ) : (
                <QrCode className="w-20 h-20 text-gray-400" />
              )}
            </div>
            <p className="font-poppins text-sm text-[#ffffff] text-center mb-2">Scan for in-person sharing</p>
            <button onClick={handleDownloadQRCode} className="font-poppins text-sm text-[#C7A30D] hover:underline">
              Download QR Code
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
