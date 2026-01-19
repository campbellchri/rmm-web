export const apiPrefix = '/api'

const endpointConfig = {
    signIn: 'auth/signIn',
    signOut: 'sign-out',
    signUp: 'auth/signUp',
    forgotPassword: 'auth/forgot-password',
    resetPassword: 'auth/reset-password',
    profileUpdate: 'users/update/profile',
    currentUser: 'users/currentUser',
    resetUserPassword: 'users/resetUserPassword',
    notificationCreate: 'userNotificationSettings',
    notificationUpdate: 'userNotificationSettings/update',
}

export default endpointConfig
