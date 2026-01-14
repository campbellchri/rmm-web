import Logo from '@/components/template/Logo'
import Alert from '@/components/ui/Alert'
import SignInForm from './components/SignInForm'
import OauthSignIn from './components/OauthSignIn'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { useThemeStore } from '@/store/themeStore'

type SignInProps = {
    signUpUrl?: string
    forgetPasswordUrl?: string
    disableSubmit?: boolean
}

export const SignInBase = ({
    signUpUrl = '/sign-up',
    forgetPasswordUrl = '/forgot-password',
    disableSubmit,
}: SignInProps) => {
    const [message, setMessage] = useTimeOutMessage()

    const mode = useThemeStore((state) => state.mode)

    return (
        <>
            {/* <div className="mb-8">
                <Logo
                    type="streamline"
                    mode={mode}
                    imgClass="mx-auto"
                    logoWidth={60}
                />
            </div> */}
            <div className="sm:mb-6  flex flex-col gap-2 sm:gap-4">
                <h2 className=" sm:mb-2 text-lg sm:text-2xl DMSerif Pro Rounded text-[#ffffff]">
                    Welcome Back 👋
                </h2>
                <p className="heading-text text-[#ffffff] text-poppins text-sm sm:text-base  ">
                    Today is a new day. It's your day. You shape it. Sign in to
                    start managing your projects.
                </p>
            </div>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    <span className="break-all">{message}</span>
                </Alert>
            )}
            <SignInForm
                disableSubmit={disableSubmit}
                setMessage={setMessage}
                passwordHint={
                    <div className="mb-7 mt-2 text-right ">
                        <ActionLink
                            to={forgetPasswordUrl}
                            className=" heading-text mt-2 font-poppins  text-[#ffffff]"
                            themeColor={false}
                        >
                            Forgot password
                        </ActionLink>
                    </div>
                }
            />
            <div className="mt-8">
                <div className="flex items-center gap-2 mb-6">
                    <div className="border-t border-[#CFDFE2] dark:border-gray-800 flex-1 mt-[1px]" />
                    <p className=" heading-text text-[#ffffff]">or</p>
                    <div className="border-t border-[#CFDFE2] dark:border-gray-800 flex-1 mt-[1px]" />
                </div>
                <OauthSignIn
                    disableSubmit={disableSubmit}
                    setMessage={setMessage}
                />
            </div>
            <div>
                <div className="mt-6 text-center font-poppins font-[400] text-[16px]">
                    <span className='text-[#ffffff]'>{`Don't have an account yet?`} </span>
                    <ActionLink
                        to={signUpUrl}
                        className="heading-text font-poppins text-[16px] font-semibold text-[#C7A30D] "
                        themeColor={false}
                    >
                        Sign up
                    </ActionLink>
                </div>
            </div>
        </>
    )
}

const SignIn = () => {
    return <SignInBase />
}

export default SignIn
