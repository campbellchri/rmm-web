import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import React from 'react'

export interface Plan {
    id: string
    name: string
    price: number
    storage: string
    features: string[]
    icon?: React.ReactNode
}

interface BillingState {
    hasSubscription: boolean
    activePlan: Plan | null
    isUpgrading: boolean
}

interface BillingActions {
    setSubscription: (hasSubscription: boolean) => void
    setActivePlan: (plan: Plan | null) => void
    setIsUpgrading: (isUpgrading: boolean) => void
    clearSubscription: () => void
}

export const useBillingStore = create<BillingState & BillingActions>()(
    persist(
        (set) => ({
            hasSubscription: false,
            activePlan: null,
            isUpgrading: false,

            setSubscription: (hasSubscription) => set({ hasSubscription }),
            setActivePlan: (plan) => set({ activePlan: plan }),
            setIsUpgrading: (isUpgrading) => set({ isUpgrading }),
            clearSubscription: () => set({ hasSubscription: false, activePlan: null, isUpgrading: false }),
        }),
        {
            name: 'billing-storage',
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name)
                    if (!str) return null
                    return JSON.parse(str)
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value))
                },
                removeItem: (name) => localStorage.removeItem(name),
            },
        }
    )
)
