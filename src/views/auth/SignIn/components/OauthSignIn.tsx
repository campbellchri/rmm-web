import Button from '@/components/ui/Button'
import { useAuth } from '@/auth'
import {
    apiGoogleOauthSignIn,
    apiGithubOauthSignIn,
} from '@/services/OAuthServices'
import facebokIcon from '../../../../../public/img/others/Facebook.png'

type OauthSignInProps = {
    setMessage?: (message: string) => void
    disableSubmit?: boolean
}

const OauthSignIn = ({ setMessage, disableSubmit }: OauthSignInProps) => {
    const { oAuthSignIn } = useAuth()

    const handleGoogleSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGoogleOauthSignIn()
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                    }
                } catch (error) {
                    setMessage?.((error as string)?.toString() || '')
                }
            })
        }
    }

    const handleGithubSignIn = async () => {
        if (!disableSubmit) {
            oAuthSignIn(async ({ redirect, onSignIn }) => {
                try {
                    const resp = await apiGithubOauthSignIn()
                    if (resp) {
                        const { token, user } = resp
                        onSignIn({ accessToken: token }, user)
                        redirect()
                    }
                } catch (error) {
                    setMessage?.((error as string)?.toString() || '')
                }
            })
        }
    }

    return (
        <div className="flex items-center flex-row w-full gap-4">
            <Button
                className="flex-1 w-full bg-[#383C56] border-none rounded-[1200px]"
                type="button"
                onClick={handleGoogleSignIn}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px]"
                        src="/img/others/google.png"
                        alt="Google sign in"
                    />
                    <span className='md:text-base text-sm font-poppins text-[#ffffff]'>Sign In</span>
                </div>
            </Button>
            <Button
                className="flex-1 w-full bg-[#383C56] border-none rounded-[1200px]"
                type="button"
                onClick={handleGithubSignIn}
            >
                <div className="flex items-center justify-center gap-2">
                    <img
                        className="h-[25px] w-[25px]"
                        src={facebokIcon}
                        alt="Google sign in"
                    />
                    <span className='md:text-base text-sm font-poppins text-[#ffffff]'>Sign In</span>
                </div>
            </Button>
        </div>
    )
}

export default OauthSignIn
