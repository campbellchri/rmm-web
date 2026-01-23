import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type AvatarState = {
    avatar: string
    photoId: string | null
    photoURL: string | null
}

type AvatarAction = {
    setAvatar: (avatar: string) => void
    setPhotoId: (photoId: string | null) => void
    setPhotoURL: (photoURL: string | null) => void
    clearAvatar: () => void
}

const initialState: AvatarState = {
    avatar: '',
    photoId: null,
    photoURL: null,
}

export const useAvatarStore = create<AvatarState & AvatarAction>()(
    persist(
        (set) => ({
            ...initialState,
            setAvatar: (avatar) => set({ avatar }),
            setPhotoId: (photoId) => set({ photoId }),
            setPhotoURL: (photoURL) => set({ photoURL }),
            clearAvatar: () => set(initialState),
        }),
        {
            name: 'persistentAvatar',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
