import ApiService from './ApiService'
import type { SubscriptionPackage } from '@/@types/subscription'

export async function apiGetSubscriptionPackages() {
    return ApiService.fetchDataWithAxios<SubscriptionPackage[]>({
        url: '/subscription-packages/getAll',
        method: 'get',
    })
}
