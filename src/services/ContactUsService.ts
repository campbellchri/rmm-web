import ApiService from './ApiService'

export type ContactUsDetailResponse = {
    id: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    zipCode: string
    country: string
    phoneNumber: string
    emailAddress: string
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    linkedinUrl: string
    createdAt: string
    updatedAt: string
}

export async function apiGetContactUsDetails() {
    return ApiService.fetchDataWithAxios<ContactUsDetailResponse>({
        url: '/contact-us/get',
        method: 'get',
    })
}

export type ComplaintRequest = {
    userName: string
    userEmail: string
    userPhoneNumber: string
    messageType: 'complaint' | 'suggestion' | 'message'
    subject: string
    messageContent: string
}

export async function apiPostComplaint(data: ComplaintRequest) {
    return ApiService.fetchDataWithAxios<void>({
        url: '/complaints',
        method: 'post',
        data,
    })
}
