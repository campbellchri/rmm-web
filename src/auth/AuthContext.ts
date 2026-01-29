import { createContext } from 'react'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    User,
    OauthSignInCallbackPayload,
    VerifyOtpRequest,
    VerifyOtpResponse,
    ResendOtpRequest,
    ResendOtpResponse,
} from '@/@types/auth'

type Auth = {
    authenticated: boolean
    user: User
    signIn: (values: SignInCredential) => AuthResult
    signUp: (values: SignUpCredential) => AuthResult
    signOut: () => void
    oAuthSignIn: (
        callback: (payload: OauthSignInCallbackPayload) => void,
    ) => void
    verifyOtp: (values: VerifyOtpRequest, email: string) => Promise<VerifyOtpResponse>
    resendOtp: (values: ResendOtpRequest) => Promise<ResendOtpResponse>
}

const defaultFunctionPlaceHolder = async (): AuthResult => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    return {
        status: '',
        message: '',
    }
}

const defaultOtpPlaceholder = async <T,>(data: any): Promise<T> => {
    await new Promise((resolve) => setTimeout(resolve, 0))
    return {} as T
}

const defaultOAuthSignInPlaceHolder = (
    callback: (payload: OauthSignInCallbackPayload) => void,
): void => {
    callback({
        onSignIn: () => {},
        redirect: () => {},
    })
}

const AuthContext = createContext<Auth>({
    authenticated: false,
    user: {},
    signIn: async () => defaultFunctionPlaceHolder(),
    signUp: async () => defaultFunctionPlaceHolder(),
    signOut: () => {},
    oAuthSignIn: defaultOAuthSignInPlaceHolder,
    verifyOtp: defaultOtpPlaceholder,
    resendOtp: defaultOtpPlaceholder,
})

export default AuthContext
