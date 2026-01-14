import type { ReactNode, CSSProperties } from 'react'

export interface CommonProps {
    id?: string
    className?: string
    children?: ReactNode
    style?: CSSProperties
}

export type TableQueries = {
    total?: number
    pageIndex?: number
    pageSize?: number
    query?: string
    sort?: {
        order: 'asc' | 'desc' | ''
        key: string | number
    }
}

export type TraslationFn = (
    key: string,
    fallback?: string | Record<string, string | number>,
) => string
/**
 * API response type
 */
export interface MemorialMode {
    id: string
    title: string
    description: string
    landingModeType: 'full-mode' | 'video-only-mode' | 'event-mode'
    iconId: string
    iconURL: string
    isActive: boolean
    createdAt: string
    updatedAt: string
}
