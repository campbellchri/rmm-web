import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignUpForm from './components/SignUpForm'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'
import OauthSignIn from '../SignIn/components/OauthSignIn'

type SignUpProps = {
    disableSubmit?: boolean
    signInUrl?: string
}

export const SignUpBase = ({
    signInUrl = '/sign-in',
    disableSubmit,
}: SignUpProps) => {
    const [message, setMessage] = useTimeOutMessage()
    const mode = useThemeStore((state) => state.mode)

    return (
        <>
            {/* Optional Logo */}
            {/* <div className="flex justify-center mb-8">
                <Logo type="streamline" mode={mode} imgClass="mx-auto" logoWidth={60} />
            </div> */}

            {/* Heading Section */}
            <div className="flex flex-col gap-2 sm:gap-4">
                <h2 className="text-[clamp(1.125rem,1vw+1rem,1.5rem)] DMSerifPro leading-tight text-[#ffffff]">
                    Welcome Back 👋
                </h2>
                <p className="text-[clamp(0.875rem,0.6vw+0.75rem,1rem)] font-poppins leading-relaxed text-[#ffffff]">
                    Today is a new day. It's your day. You shape it. Sign in to
                    start managing your projects.
                </p>
            </div>

            {/* Error Alert */}
            {message && (
                <Alert showIcon className="mt-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}

            {/* Form */}
            <div className="mt-6 sm:mt-8">
                <SignUpForm
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                />
            </div>

            {/* OR Divider */}
            <div className="mt-8 flex flex-col gap-6">
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
            </div>

            {/* Sign In Link */}
            <div className="mt-6 text-center font-poppins font-[400] text-[16px]">
                <span className="text-gray-700 dark:text-gray-300">
                    Already have an account?{' '}
                </span>
                <ActionLink
                    to={signInUrl}
                    className="font-bold font-poppins  text-[16px] text-[#C7A30D] hover:underline"
                    themeColor={false}
                >
                    Sign in
                </ActionLink>
            </div>
        </>
    )
}

const SignUp = () => {
    return <SignUpBase />
}

export default SignUp
