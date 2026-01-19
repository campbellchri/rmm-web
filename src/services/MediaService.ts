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
