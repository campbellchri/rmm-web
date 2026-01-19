
import ResetPasswordForm from './components/ResetPasswordForm'

const ResetPassword = () => {
    return (
        <div className="flex flex-col gap-4">
            <div className="mb-8">
                <h3 className="mb-2 text-white font-DMSerif font-[400] text-[32px]">
                    Set a New Password
                </h3>
                <p className="font-outfit text-white text-[16px]">
                    Set a New Password
                </p>
            </div>
            <ResetPasswordForm />
        </div>
    )
}

export default ResetPassword
