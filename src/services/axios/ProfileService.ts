import endpointConfig from "@/configs/endpoint.config";
import ApiService from "../ApiService";

export async function apiProfileUpdate(data: {
    firstName: string
    lastName: string
    email: string
    password?: string
    gender?: string
    callingCode?: string
    phone?: string
    street1?: string
    street2?: string
    city?: string
    state?: string
    postal?: string
    country?: string
    photoId?: string
}) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.profileUpdate,
        method: 'patch',
        data,
    })
}

export async function apiGetCurrentUser<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.currentUser,
        method: 'get',
    })
}

export async function apiResetPassword<T extends Record<string, unknown> | undefined, R>(data: T) {
    return ApiService.fetchDataWithAxios<R>({
        url: endpointConfig.resetUserPassword,
        method: 'patch',
        data,
    })
}