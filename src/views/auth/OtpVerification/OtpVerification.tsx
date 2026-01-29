import Alert from '@/components/ui/Alert'
import OtpVerificationForm from './components/OtpVerificationForm'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useAuth } from '@/auth'
import type { CommonProps } from '@/@types/common'

interface OtpVerificationProps extends CommonProps {
    userId: string
    email: string
    onVerifySuccess?: () => void
}

export const OtpVerificationBase = ({ userId, email, onVerifySuccess, className }: OtpVerificationProps) => {
    const [otpVerified, setOtpVerified] = useTimeOutMessage()
    const [otpResend, setOtpResend] = useTimeOutMessage()
    const [message, setMessage] = useTimeOutMessage()
    const { resendOtp } = useAuth()

    const handleResendOtp = async () => {
        try {
            await resendOtp({ email })
            setOtpResend('We have sent you One Time Password.')
        } catch (errors: any) {
            setMessage?.(
                errors?.response?.data?.message || 'Some error occurred!',
            )
        }
    }

    const handleVerifySuccess = () => {
        setOtpVerified('OTP verified successfully!')
        onVerifySuccess?.()
    }

    return (
        <div className={className}>
            {/* <div className="mb-8">
                <h3 className="mb-2">OTP Verification</h3>
                <p className="font-semibold heading-text">
                    We have sent you One Time Password to {email}.
                </p>
            </div> */}
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            {otpResend && (
                <Alert showIcon className="mb-4" type="info">
                    <span className="break-all">{otpResend}</span>
                </Alert>
            )}
            {otpVerified && (
                <Alert showIcon className="mb-4" type="success">
                    <span className="break-all">{otpVerified}</span>
                </Alert>
            )}
            <OtpVerificationForm
                userId={userId}
                email={email}
                setMessage={setMessage}
                setOtpVerified={setOtpVerified}
                onVerifySuccess={handleVerifySuccess}
            />
            <button
                className="heading-text font-outfit font-[600] text-[#FFB84C] w-full my-2"
                onClick={handleResendOtp}
            >
                Resend OTP
            </button>
            <div className="mt-4">
                <p className='font-[outfit] text-[#FFFFFF] font-[400]'>
                    Please check your inbox and enter the verification code above to reset your password.
                </p>
                <p className='font-[outfit] text-[#FFB84C] font-[600]'>
                    Didn't receive the code?
                </p>
                <p className='font-[outfit] text-[#FFFFFF] font-[400]'>
                    Check your spam folder or click "Resend Code" to request a new one.
                </p>
            </div>
        </div>
    )
}

const OtpVerification = (props: OtpVerificationProps) => {
    return <OtpVerificationBase {...props} />
}

export default OtpVerification
