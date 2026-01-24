
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { apiGetPublicMemorial } from "@/services/axios/MemorialModeService"

import FullMemorialPublic from "./FullMemorialPublic"
import EventMemorialPublic from "./EventMemorialPublic"
import VideoOnlyMemorialPublic from "./VideoOnlyMemorialPublic"
import { Memorial } from "./types"

export default function PublicMemorial() {
  const { slug } = useParams<{ slug: string }>()
  const [memorial, setMemorial] = useState<Memorial | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetch = async () => {
      try {
        const data = await apiGetPublicMemorial<Memorial>(slug)
        setMemorial(data)
      } catch (err) {
        console.error(err)
        setError("Memorial not found")
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [slug])

  if (loading) return <div className="text-white text-center mt-10">Loading...</div>
  if (error || !memorial) return <div className="text-white text-center mt-10">{error || "No memorial data"}</div>

  switch (memorial.landingMode?.landingModeType) {
    case "full-mode":
      return <FullMemorialPublic memorial={memorial} />
    case "event-mode":
      return <EventMemorialPublic memorial={memorial} />
    case "video-only-mode":
      return <VideoOnlyMemorialPublic memorial={memorial} />
    default:
      return <div className="text-white text-center mt-10">Unsupported memorial type</div>
  }
}
