import { create } from 'zustand'

export type UserProfile = {
    id: string
    firstName: string
    lastName: string
    roles: string[]
    email: string
    gender: string
    phone: string
    callingCode: string
    photoId: string | null
    photoURL: string | null
    street1: string
    street2: string
    city: string
    state: string
    postal: string
    country: string
    createdAt: string
    updatedAt: string
}

type ProfileState = {
    profile: UserProfile | null
    loading: boolean
    isSaving: boolean
    password?: string
}

type ProfileAction = {
    setProfile: (profile: UserProfile) => void
    updateProfileField: (field: keyof UserProfile, value: any) => void
    setLoading: (loading: boolean) => void
    setIsSaving: (isSaving: boolean) => void
    setPassword: (password: string) => void
}

export const useProfileStore = create<ProfileState & ProfileAction>((set) => ({
    profile: null,
    loading: false,
    isSaving: false,
    password: '',
    setProfile: (profile) => set({ profile }),
    updateProfileField: (field, value) =>
        set((state) => ({
            profile: state.profile ? { ...state.profile, [field]: value } : null,
        })),
    setLoading: (loading) => set({ loading }),
    setIsSaving: (isSaving) => set({ isSaving }),
    setPassword: (password) => set({ password }),
}))
