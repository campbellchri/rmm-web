export interface UserMedia {
  id: string
  type: 'photo' | 'video'
  fileURL: string
  videoTitle?: string
  isMainVideo?: boolean
}

export interface LandingMode {
  id: string
  title: string
  description: string
  landingModeType: 'full-mode' | 'event-mode' | 'video-only-mode'
  iconURL: string
}

export interface QRCodeData {
  qrCodeData: string
}

export interface Memorial {
  id: string
  personName: string
  personProfilePicture?: string
  favQuote?: string
  slug: string
  eventStart?: string
  userMedia?: UserMedia[]
  landingMode?: LandingMode
  pageURL: string
  qrCode?: QRCodeData
}
