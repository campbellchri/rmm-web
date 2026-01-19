import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type MediaResponse = {
    fileURL: string
    fileId: string
    mimeType: string
    size: number
}

type MediaStoreState = {
    uploadedMedia: Record<string, MediaResponse>
}

type MediaStoreAction = {
    addMedia: (key: string, data: MediaResponse) => void
    getMedia: (key: string) => MediaResponse | undefined
    clearMedia: () => void
}

export const useMediaStore = create<MediaStoreState & MediaStoreAction>()(
    persist(
        (set, get) => ({
            uploadedMedia: {},
            addMedia: (key, data) =>
                set((state) => ({
                    uploadedMedia: { ...state.uploadedMedia, [key]: data }
                })),
            getMedia: (key) => get().uploadedMedia[key],
            clearMedia: () => set({ uploadedMedia: {} }),
        }),
        {
            name: 'media-storage',
        }
    )
)
