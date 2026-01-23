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

export async function apiDeleteMedia<T>(userId: string, uploadId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/user-media/remove/${userId}/${uploadId}`,
        method: 'delete',
    })
}

export async function apiDeleteProfilePhoto<T>(photoId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/users/profile-photo/remove/${photoId}`,
        method: 'delete',
    })
}

export async function apiDeleteGCPFile<T>(uploadId: string) {
    return ApiService.fetchDataWithAxios<T>({
        url: `/gcp-storage/delete-file/${uploadId}`,
        method: 'delete',
    })
}
