import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'
import type {
    SignInCredential,
    SignUpCredential,
    ForgotPassword,
    ResetPassword,
    SignInResponse,
    SignUpResponse,
    VerifyOtpRequest,
    VerifyOtpResponse,
    ResendOtpRequest,
    ResendOtpResponse,
} from '@/@types/auth'

export async function apiSignIn(data: SignInCredential) {
    return ApiService.fetchDataWithAxios<SignInResponse>({
        url: endpointConfig.signIn,
        method: 'post',
        data,
    })
}

export async function apiSignUp(data: SignUpCredential) {
    return ApiService.fetchDataWithAxios<SignUpResponse>({
        url: endpointConfig.signUp,
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword<T>(data: ForgotPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.forgotPassword,
        method: 'post',
        data,
    })
}

export async function apiResetPassword<T>(data: ResetPassword) {
    return ApiService.fetchDataWithAxios<T>({
        url: endpointConfig.resetPassword,
        method: 'post',
        data,
    })
}

export async function apiVerifyOtp(data: VerifyOtpRequest) {
    return ApiService.fetchDataWithAxios<VerifyOtpResponse>({
        url: endpointConfig.verifyOtp,
        method: 'post',
        data,
    })
}

export async function apiResendOtp(data: ResendOtpRequest) {
    return ApiService.fetchDataWithAxios<ResendOtpResponse>({
        url: endpointConfig.resendOtp,
        method: 'post',
        data,
    })
}
