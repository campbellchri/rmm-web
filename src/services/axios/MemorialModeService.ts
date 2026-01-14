import ApiService from "../ApiService"


export async function apiGetMemorialModeList() {
    return ApiService.fetchDataWithAxios({
        url: '/landing-mode',
        method: 'get',
    })
}

export async function apiGetMemorialTemplateList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/templates',
        method: 'get',
    })
}

export async function apiGetMemorialList<T>() {
    return ApiService.fetchDataWithAxios<T>({
        url: '/memorials',
        method: 'get',
    })
}

export async function apiCreateMemorial<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/memorials',
        method: 'post',
        data,
    })
}

export async function apiSetFeaturedMemorial<T, U extends Record<string, unknown>>(
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: '/user-featured-memorials',
        method: 'post',
        data,
    })
}

export async function apiGetMemorialById<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/memorials/readById/${id}`,
        method: 'get',
    })
}


export async function apiUpdateMemorial<T, U extends Record<string, unknown>>(
    id: string,
    data: U,
) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/memorials/${id}`,
        method: 'patch',
        data,
    })
}
