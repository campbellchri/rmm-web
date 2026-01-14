export interface SubscriptionPackage {
    id: string
    packageName: string
    iconId: string
    iconURL: string
    price: number
    priceUnit: string
    storageAmount: number
    storageUnit: string
    features: string[]
    isActive: boolean
    sortOrder: number
    createdAt: string
    updatedAt: string
}
