export const apiPrefix = '/api'

const endpointConfig = {
    signIn: '/api/auth/signIn',
    signOut: '/api/sign-out',
    signUp: '/api/auth/signUp',
    forgotPassword: '/api/forgot-password',
    resetPassword: '/api/reset-password',
    profileUpdate: '/api/users/update/profile',
    currentUser: '/api/users/currentUser',
    resetUserPassword: '/api/users/resetUserPassword',
    notificationCreate: '/api/userNotificationSettings',
    notificationUpdate: '/api/userNotificationSettings/update',
}

export default endpointConfig
