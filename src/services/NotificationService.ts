import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'

export type NotificationSettingsPayload = {
    userId?: string
    IsInAppAllowed: boolean
    IsEmailAllowed: boolean
    IsDesktopNotificationAllowed: boolean
    IsUnreadBadgeEnabled: boolean
}

export type NotificationSettingsUpdatePayload = {
    IsInAppAllowed: boolean
    IsEmailAllowed: boolean
    IsDesktopNotificationAllowed: boolean
    IsUnreadBadgeEnabled: boolean
}

export type NotificationSettingsResponse = {
    id: string
    userId: string
    IsInAppAllowed: boolean
    IsEmailAllowed: boolean
    IsDesktopNotificationAllowed: boolean
    IsUnreadBadgeEnabled: boolean
}

export async function apiCreateNotificationSettings(
    data: NotificationSettingsPayload,
) {
    return ApiService.fetchDataWithAxios<NotificationSettingsResponse>({
        url: endpointConfig.notificationCreate,
        method: 'post',
        data,
    })
}

export async function apiUpdateNotificationSettings(
    userSettingsId: string,
    data: NotificationSettingsUpdatePayload,
) {
    return ApiService.fetchDataWithAxios<NotificationSettingsResponse>({
        url: `${endpointConfig.notificationUpdate}/${userSettingsId}`,
        method: 'patch',
        data,
    })
}
