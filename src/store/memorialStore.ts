import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiGetMemorialList } from '@/services/axios/MemorialModeService'

export type Memorial = {
    id: string
    personName: string
    // add other fields as needed based on API response
}

type MemorialState = {
    memorials: Memorial[]
    activeMemorialId: string | null
    loading: boolean
    fetched: boolean
}

type MemorialAction = {
    setMemorials: (memorials: Memorial[]) => void
    setActiveMemorialId: (id: string | null) => void
    fetchMemorials: (force?: boolean) => Promise<void>
    setLoading: (loading: boolean) => void
}

export const useMemorialStore = create<MemorialState & MemorialAction>()(
    persist(
        (set, get) => ({
            memorials: [],
            activeMemorialId: null,
            loading: false,
            fetched: false,
            setMemorials: (memorials) => set({ memorials, fetched: true }),
            setActiveMemorialId: (id) => set({ activeMemorialId: id }),
            setLoading: (loading) => set({ loading }),
            fetchMemorials: async (force = false) => {
                if (get().fetched && !force) return
                set({ loading: true })
                try {
                    const response: any = await apiGetMemorialList()
                    if (response) {
                        set({ memorials: response, fetched: true })
                    }
                } catch (error) {
                    console.error('Error fetching memorials:', error)
                } finally {
                    set({ loading: false })
                }
            },
        }),
        {
            name: 'memorial-storage',
            partialize: (state) => ({ activeMemorialId: state.activeMemorialId }),
        }
    )
)
