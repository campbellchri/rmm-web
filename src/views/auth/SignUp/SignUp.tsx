import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignUpForm from './components/SignUpForm'
import OtpVerification from '../OtpVerification/OtpVerification'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'
import OauthSignIn from '../SignIn/components/OauthSignIn'
import { useState } from 'react'

type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const [showOtpVerification, setShowOtpVerification] = useState(false)
    const [otpData, setOtpData] = useState({ userId: '', email: '' })
    const mode = useThemeStore((state) => state.mode)

    const handleSignUpSuccess = (userId: string, email: string) => {
        setOtpData({ userId, email })
        setShowOtpVerification(true)
    }

    const handleOtpVerified = () => {
        // OTP verification successful - redirect to dashboard
        window.location.href = '/dashboard'
    }

    const handleBackToSignUp = () => {
        setShowOtpVerification(false)
        setOtpData({ userId: '', email: '' })
    }

    return (
        <>
            {/* Optional Logo */}
            {/* <div className="flex justify-center mb-8">
                <Logo type="streamline" mode={mode} imgClass="mx-auto" logoWidth={60} />
            </div> */}

            <div className="flex flex-col gap-2 sm:gap-4">
                <h2 className="text-[clamp(1.125rem,1vw+1rem,1.5rem)] font-DMSerif font-[400] leading-tight text-[#ffffff]">
                    {showOtpVerification ? 'Verify OTP' : 'Welcome Back 👋'}
                </h2>
                <p className='font-[400] text-[20px] text-[#ffffff] font-poppins'>
                    Enter Verification Code
                </p>

                <p className="text-[clamp(0.875rem,0.6vw+0.75rem,1rem)] font-outfit text-[16px] leading-relaxed text-[#ffffff]">
                    {showOtpVerification 
                        ? `We've sent a verification code to ${otpData.email}`
                        : 'Today is a new day. It\'s your day. You shape it. Sign in to start managing your projects.'
                    }
                </p>
            </div>

            {message && (
                <Alert showIcon className="mt-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}

            <div className="mt-6 sm:mt-8">
                {showOtpVerification ? (
                    <OtpVerification
                        userId={otpData.userId}
                        email={otpData.email}
                        onVerifySuccess={handleOtpVerified}
                    />
                ) : (
                    <SignUpForm
                        disableSubmit={disableSubmit}
                        setMessage={setMessage}
                        onSignUpSuccess={handleSignUpSuccess}
                    />
                )}
            </div>

            {/* OR Divider */}
            {/* <div className="mt-8 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        or
                    </p>
                    <div className="flex-1 border-t border-gray-200 dark:border-gray-800" />
                </div>
                <OauthSignIn
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                />
            </div> */}

            <div className="mt-6 text-center font-poppins font-[400] text-[16px]">
                <span className="text-[#ffffff] dark:text-gray-300">
                    {showOtpVerification ? 'Back to' : 'Already have an account?'}
                </span> &nbsp;
                <ActionLink
                    to={showOtpVerification ? '#' : signInUrl}
                    onClick={showOtpVerification ? handleBackToSignUp : undefined}
                    className="font-[500] font-Inter text-[16px] text-[#ffffff]"
                    themeColor={false}
                >
                    {showOtpVerification ? 'Login' : 'Sign in'}
                </ActionLink>
            </div>
        </>
    )
}

const SignUp = () => {
    return <SignUpBase />
}

export default SignUp
