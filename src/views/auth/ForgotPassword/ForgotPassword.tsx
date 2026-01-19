import { useState } from 'react'
import Alert from '@/components/ui/Alert'
import Button from '@/components/ui/Button'
import ActionLink from '@/components/shared/ActionLink'
import ForgotPasswordForm from './components/ForgotPasswordForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useNavigate } from 'react-router-dom'

type ForgotPasswordProps = {
    signInUrl?: string
}

export const ForgotPasswordBase = ({
    signInUrl = '/sign-in',
}: ForgotPasswordProps) => {
    const [emailSent, setEmailSent] = useState(false)
    const [message, setMessage] = useTimeOutMessage()
    const [submittedEmail, setSubmittedEmail] = useState<string>('')

    const navigate = useNavigate()

    const handleEmailSent = (email: string) => {
        setSubmittedEmail(email)
        setEmailSent(true)
    }

    const handleTryAgain = () => {
        setEmailSent(false)
        setSubmittedEmail('')
    }

    return (
        <div>
            <div className="mb-6">
                {emailSent ? (
                    <>
                        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={handleTryAgain}>
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M19 12H5"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 19L5 12L12 5"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <h3 className="text-white font-DMSerif font-[400]">
                                Forgot Password
                            </h3>
                        </div>
                        <h3 className="mb-2 text-white font-poppins font-[400] text-[20px]">Check Your Email</h3>
                        <p className="font-outfit text-white text-[16px]">
                            We've sent a password reset link to <span className="font-bold">{submittedEmail}</span>
                        </p>
                        <br />
                        <p className="font-outfit text-white text-[16px]">
                            Please check your inbox for an email from Checkmate Health with a link to reset your password.
                        </p>
                        <br />
                        <p className="font-outfit text-[#FFB84C] text-[16px]">
                            <span className="font-bold">Didn't receive the email?</span> <span className='text-white'>
                                Check your spam folder or click "Try Again" to request a new reset link.
                            </span>
                        </p>
                        <div className="mt-6">
                            <Button
                                block
                                variant="solid"
                                type="button"
                                onClick={handleTryAgain}
                                className="
                                    bg-[linear-gradient(96.23deg,#ECA024_5.01%,#F9C94F_50.03%,#EAA32A_95.05%)]
                                    rounded-full
                                    font-poppins
                                    font-medium
                                    text-[20px]
                                    leading-none
                                    tracking-normal       
                                    text-center
                                    align-middle
                                    text-black
                                "
                            >
                                Try Again
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-6">
                            <h3 className="text-white font-DMSerif font-[400]">Forgot Password</h3>
                        </div>
                        <p className="font-semibold heading-text text-white font-[400] font-poppins">
                            Reset Password
                        </p>
                    </>
                )}
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            {!emailSent && (
                <ForgotPasswordForm
                    emailSent={emailSent}
                    setMessage={setMessage}
                    setEmailSent={setEmailSent}
                    onEmailSent={handleEmailSent}
                >

                </ForgotPasswordForm>
            )}
            <div className="mt-4 text-center">
                <span className='text-white font-[400] font-poppins'>Remember your password?</span> &nbsp;
                <ActionLink
                    to={signInUrl}
                    className="text-[#FFB84C] font-[400] font-poppins hover:underline"
                    themeColor={false}
                >
                    Back to Login
                </ActionLink>
            </div>
        </div>
    )
}

const ForgotPassword = () => {
    return <ForgotPasswordBase />
}

export default ForgotPassword
