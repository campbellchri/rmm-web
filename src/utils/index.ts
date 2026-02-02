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

export const validateGalleryPhotoAspectRatio = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            const { width, height } = img
            URL.revokeObjectURL(url)

            const aspectRatio = width / height
            const tolerance = 0.1
            
            const is3by2 = Math.abs(aspectRatio - 1.5) < tolerance
            const is16by9 = Math.abs(aspectRatio - (16/9)) < tolerance

            if (!is3by2 && !is16by9) {
                reject('Photo must have an aspect ratio of 3:2 or 16:9')
                return
            }

            resolve()
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject('Invalid image file')
        }

        img.src = url
    })
}  

export const validateFeaturedImage = (
file: File,
requiredWidth = 1200,
requiredHeight = 800
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            const { width, height } = img
            URL.revokeObjectURL(url)

            if (width !== requiredWidth || height !== requiredHeight) {
                reject(
                    `Featured photo must be exactly ${requiredWidth} x ${requiredHeight}px`
                )
                return
            }

            resolve()
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject('Invalid image file')
        }

        img.src = url
    })
}