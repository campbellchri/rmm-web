import React, { useState } from 'react'
import { useSessionUser } from '@/store/authStore'
import {
    apiCreateNotificationSettings,
    apiUpdateNotificationSettings,
    NotificationSettingsPayload,
    NotificationSettingsUpdatePayload,
} from '@/services/NotificationService'

export default function Notification() {
    const { user, setUser } = useSessionUser((state) => state)
    const [desktopNotif, setDesktopNotif] = useState(false)
    const [unreadBadge, setUnreadBadge] = useState(false)
    const [emailNotif, setEmailNotif] = useState(true)
    const [isAppNotif, setIsAppNotif] = useState(false) // Assuming there is a UI for this or default false as per payload

    const handleNotificationChange = async (
        key: keyof NotificationSettingsPayload,
        value: boolean,
    ) => {
        // Update local state based on key
        if (key === 'IsDesktopNotificationAllowed') setDesktopNotif(value)
        if (key === 'IsUnreadBadgeEnabled') setUnreadBadge(value)
        if (key === 'IsEmailAllowed') setEmailNotif(value)
        if (key === 'IsInAppAllowed') setIsAppNotif(value)

        const currentSettings = {
            IsInAppAllowed: isAppNotif,
            IsEmailAllowed: emailNotif,
            IsDesktopNotificationAllowed: desktopNotif,
            IsUnreadBadgeEnabled: unreadBadge,
        }

        const settingsToCheck = {
            ...currentSettings,
            [key]: value,
        }

        try {
            if (user.notificationSettingsId) {
                const payload: NotificationSettingsUpdatePayload = {
                    IsInAppAllowed: settingsToCheck.IsInAppAllowed,
                    IsEmailAllowed: settingsToCheck.IsEmailAllowed,
                    IsDesktopNotificationAllowed:
                        settingsToCheck.IsDesktopNotificationAllowed,
                    IsUnreadBadgeEnabled: settingsToCheck.IsUnreadBadgeEnabled,
                }
                await apiUpdateNotificationSettings(
                    user.notificationSettingsId,
                    payload,
                )
            } else {
                const payload: NotificationSettingsPayload = {
                    userId: user.userId || undefined,
                    ...settingsToCheck,
                }
                const response = await apiCreateNotificationSettings(payload)
                if (response?.id) {
                    setUser({ ...user, notificationSettingsId: response.id })
                }
            }
        } catch (error) {
            console.error('Error updating notification settings', error)
        }
    }

    return (
        <div className=" mx-auto  p-6 rounded-lg  min-h-screen">
            <p className="text-xl DMSerif text-[#ffffff]  mb-6">Notification</p>

            {/* Desktop Notification */}
            <div className="flex items-center justify-between py-4 border-b">
                <div className="mb-3 mt-3">
                    <p className="text-lg font-poppins font-[500] text-[#ffffff]">
                        Enable desktop notification
                    </p>
                    <p className="text-[#ffffff] text-sm">
                        Decide whether you want to be notified of new message &
                        updates
                    </p>
                </div>
                <button
                    onClick={() =>
                        handleNotificationChange(
                            'IsDesktopNotificationAllowed',
                            !desktopNotif,
                        )
                    }
                    className={`relative w-12 h-6 flex-shrink-0 rounded-full transition-colors duration-300 ${
                        desktopNotif ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            desktopNotif ? 'translate-x-6' : ''
                        }`}
                    ></span>
                </button>
            </div>

            {/* Unread Badge */}
            <div className="flex items-center justify-between py-4 border-b">
                <div className="mb-3 mt-3">
                    <p className="text-lg font-poppins font-[500] text-[#ffffff]">
                        Enable unread notification badge
                    </p>
                    <p className="text-[#ffffff] text-sm">
                        Display a red indicator on the notification icon when
                        you have unread message
                    </p>
                </div>
                <button
                    onClick={() =>
                        handleNotificationChange(
                            'IsUnreadBadgeEnabled',
                            !unreadBadge,
                        )
                    }
                    className={`relative w-12 h-6 flex-shrink-0 rounded-full transition-colors duration-300 ${
                        unreadBadge ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            unreadBadge ? 'translate-x-6' : ''
                        }`}
                    ></span>
                </button>
            </div>

            {/* Email Notification */}
            <div className="flex items-center justify-between py-4">
                <div className=" mb-3 mt-3">
                    <p className="text-lg font-poppins font-[500] text-[#ffffff]">
                        Email notification
                    </p>
                    <p className="text-[#ffffff] text-sm">
                        Substance can send you email notification for any new
                        direct message
                    </p>
                </div>
                <button
                    onClick={() =>
                        handleNotificationChange('IsEmailAllowed', !emailNotif)
                    }
                    className={`relative w-12 h-6 flex-shrink-0 rounded-full transition-colors duration-300 ${
                        emailNotif ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                >
                    <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                            emailNotif ? 'translate-x-6' : ''
                        }`}
                    ></span>
                </button>
            </div>
        </div>
    )
}
