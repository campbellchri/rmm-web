import PasswordInput from '@/components/shared/PasswordInput'
import { useState } from 'react'
import { apiResetPassword } from '@/services/axios/ProfileService'
import { Notification, toast } from '@/components/ui'

export default function Security() {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmNewPassword, setConfirmNewPassword] = useState('')
    const [loading, setLoading] = useState(false)

    const handleUpdate = async () => {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            toast.push(
                <Notification title="Validation Error" type="danger">
                    Please fill in all password fields.
                </Notification>,
            )
            return
        }

        if (newPassword !== confirmNewPassword) {
            toast.push(
                <Notification title="Validation Error" type="danger">
                    New passwords do not match.
                </Notification>,
            )
            return
        }

        try {
            setLoading(true)
            await apiResetPassword({
                currentPassword,
                newPassword,
                confirmNewPassword,
            })

            toast.push(
                <Notification title="Success" type="success">
                    Password updated successfully.
                </Notification>,
            )
            setCurrentPassword('')
            setNewPassword('')
            setConfirmNewPassword('')
        } catch (error: any) {
            toast.push(
                <Notification title="Error" type="danger">
                    {error?.response?.data?.message ||
                        'Failed to update password.'}
                </Notification>,
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="mb-8 space-y-2">
                <p className="DMSerif text-xl text-[#ffffff] ">Password</p>
                <p className="font-poppins text-sm text-[#ffffff] leading-[21px] ">
                    Remember, your password is your digital key to your account.
                    Keep it safe, keep it secure!
                </p>
            </div>
            <div className="space-y-7 min-h-screen">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                            Current password
                        </label>
                        <div className="relative">
                            <PasswordInput
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                className="w-full pr-12 bg-[#383c56] border-none rounded-xl font-inter font-semibold text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                placeholder="•••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                            New password
                        </label>
                        <div className="relative">
                            <PasswordInput
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full  pr-12 bg-[#383c56] border-none rounded-xl font-inter font-semibold text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                placeholder="•••••••••"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-poppins font-semibold text-sm text-[#ffffff] leading-[21px]">
                            Confirm new password
                        </label>
                        <div className="relative">
                            <PasswordInput
                                value={confirmNewPassword}
                                onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                }
                                className="w-full pr-12 bg-[#383c56] border-none rounded-xl font-inter font-semibold text-sm text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                placeholder="•••••••••"
                            />
                        </div>
                    </div>
                </div>

                {/* Update Button */}
                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="bg-[#C7A30D] text-white font-poppins font-bold text-sm px-5 py-3.5 rounded-xl hover:bg-[#B8940C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </div>
        </>
    )
}
