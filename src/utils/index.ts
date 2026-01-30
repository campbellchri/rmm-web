export const generateThumbnail = async (videoURL: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = videoURL
    video.crossOrigin = 'anonymous'
    video.currentTime = 2 // time in seconds to capture frame
    video.muted = true

    video.addEventListener('loadeddata', () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        reject('Canvas context not available')
        return
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageURL = canvas.toDataURL('image/jpeg')
      resolve(imageURL)
    })

    video.addEventListener('error', (e) => {
      reject(e)
    })
  })
}