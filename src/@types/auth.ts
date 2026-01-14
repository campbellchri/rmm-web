export type SignInCredential = {
    email: string
    password: string
}

export type SignInResponse = {
    userId: string
    name: string
    surName: string
    refreshToken: string
    accessToken: string
    token: string  // Keep for backward compatibility
    role: string[]
    user?: {  // Optional nested user object for backward compatibility
        userId: string
        userName: string
        authority: string[]
        avatar: string
        email: string
    }
}

export type SignUpResponse = SignInResponse

export type SignUpCredential = {
    name: string
    email: string
    password: string
}

export type ForgotPassword = {
    email: string
}

export type ResetPassword = {
    password: string
}

export type AuthRequestStatus = 'success' | 'failed' | ''

export type AuthResult = Promise<{
    status: AuthRequestStatus
    message: string
}>

export type User = {
    userId?: string | null
    avatar?: string | null
    userName?: string | null
    name?: string | null
    surName?: string | null
    email?: string | null
    authority?: string[]
    role?: string[]
    notificationSettingsId?: string
}

export type Token = {
    accessToken: string
    refreshToken?: string
}

export type OauthSignInCallbackPayload = {
    onSignIn: (tokens: Token, user?: User) => void
    redirect: () => void
}
