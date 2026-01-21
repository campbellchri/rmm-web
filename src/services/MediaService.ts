import ApiService from './ApiService'

export async function apiUploadMedia<T>(formData: FormData) {
    return ApiService.fetchDataWithAxios<T, any>({
        url: '/user-media/upload',
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function apiDeleteMedia<T>(id: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/user-media/${id}`,
        method: 'delete',
    })
}
