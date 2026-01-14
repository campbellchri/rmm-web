import { useState } from 'react'
import {
    User,
    Shield,
    Bell,
    FileText,
    Plus,
    ChevronDown,
    Eye,
    Check,
} from 'lucide-react'

export default function Profile() {
    const [selectedNav, setSelectedNav] = useState('profile')
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    })

    const [notificationSettings, setNotificationSettings] = useState({
        desktop: true,
        unreadBadge: false,
        email: true,
    })

    const navItems = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'notification', label: 'Notification', icon: Bell },
        { id: 'billing', label: 'Billing', icon: FileText },
    ]

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }))
    }

    const toggleNotification = (setting: keyof typeof notificationSettings) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [setting]: !prev[setting],
        }))
    }

    const transactionHistory = [
        {
            id: '#36223',
            product: 'Mock premium pack',
            status: 'pending',
            date: '12/10/2021',
            amount: '$39.90',
        },
        {
            id: '#34283',
            product: 'Business board basic subscription',
            status: 'paid',
            date: '11/13/2021',
            amount: '$59.90',
        },
        {
            id: '#32234',
            product: 'Business board basic subscription',
            status: 'paid',
            date: '10/13/2021',
            amount: '$59.90',
        },
        {
            id: '#31354',
            product: 'Business board basic subscription',
            status: 'paid',
            date: '09/13/2021',
            amount: '$59.90',
        },
    ]

    const subscriptionPlans = [
        {
            name: 'Basic',
            price: '$5',
            period: '/month',
            storage: '5 GB Storage',
            features: ['Photo uploads', 'Basic sharing', '1 year hosting'],
            current: false,
        },
        {
            name: 'Premium',
            price: '$15',
            period: '/month',
            storage: '15 GB Storage',
            features: [
                'Video uploads',
                'Advanced sharing',
                '5 year hosting',
                'Custom domain',
            ],
            current: true,
        },
        {
            name: 'Ultimate',
            price: '$25',
            period: '/month',
            storage: '50 GB Storage',
            features: [
                'Unlimited media',
                'Advanced analytics',
                'Lifetime hosting',
                'Custom domain',
                'Priority support',
            ],
            current: false,
        },
    ]

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto p-5">
                    <div className="bg-white rounded-2xl border border-[#E5E5E5] shadow-sm p-5">
                        <div className="flex gap-5">
                            {/* Sidebar Navigation */}
                            <div className="w-70 flex-shrink-0">
                                <div className="bg-white h-full">
                                    <nav className="space-y-2 pr-2">
                                        {navItems.map((item) => {
                                            const IconComponent = item.icon
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() =>
                                                        setSelectedNav(item.id)
                                                    }
                                                    className={`w-full flex items-center gap-2 p-3 rounded-lg text-left transition-colors ${
                                                        selectedNav === item.id
                                                            ? 'bg-[#FFFAF4] text-[#525252]'
                                                            : 'text-[#525252] hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <IconComponent
                                                        className="w-6 h-6"
                                                        strokeWidth={2}
                                                    />
                                                    <span className="font-poppins text-sm font-normal leading-[21px]">
                                                        {item.label}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </nav>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 pl-6">
                                <div className="space-y-8">
                                    {/* Page Header */}
                                    <div>
                                        {selectedNav === 'profile' && (
                                            <h1 className="font-dm-serif text-xl text-[#171717] leading-7">
                                                Personal information
                                            </h1>
                                        )}
                                        {selectedNav === 'security' && (
                                            <div className="space-y-1">
                                                <h1 className="font-dm-serif text-xl text-[#171717] leading-7">
                                                    Password
                                                </h1>
                                                <p className="font-poppins text-sm font-medium text-[#737373] leading-[21px]">
                                                    Remember, your password is
                                                    your digital key to your
                                                    account. Keep it safe, keep
                                                    it secure!
                                                </p>
                                            </div>
                                        )}
                                        {selectedNav === 'notification' && (
                                            <h1 className="font-dm-serif text-xl text-[#171717] leading-7">
                                                Notification
                                            </h1>
                                        )}
                                        {selectedNav === 'billing' && (
                                            <h1 className="font-poppins text-xl font-bold text-[#171717] leading-7">
                                                Billing
                                            </h1>
                                        )}
                                    </div>

                                    {/* Profile Tab Content */}
                                    {selectedNav === 'profile' && (
                                        <>
                                            {/* Profile Image Section */}
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-[90px] h-[90px] rounded-full border-4 border-white bg-[#F5F5F5] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] p-1">
                                                        <img
                                                            src="https://api.builder.io/api/v1/image/assets/TEMP/c3a907805cc2ed46951553fa92d51390341a3196?width=164"
                                                            alt="Profile"
                                                            className="w-full h-full rounded-full object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <button className="flex items-center gap-1 bg-[#C7A30D] text-white font-inter font-bold text-sm px-3 py-2.5 rounded-xl hover:bg-[#B8940C] transition-colors">
                                                        <Plus
                                                            className="w-4 h-4"
                                                            strokeWidth={1.5}
                                                        />
                                                        Upload Image
                                                    </button>
                                                    <button className="border border-[#D4D4D4] bg-white text-[#525252] font-poppins font-bold text-sm px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Personal Information Form */}
                                            <div className="space-y-6">
                                                {/* Name Fields */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                            First name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value="Angelina"
                                                            className="w-full px-3 py-4 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-poppins font-semibold text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                            Last name
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value="Gotelli"
                                                            className="w-full px-3 py-4 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-poppins font-semibold text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                            readOnly
                                                        />
                                                    </div>
                                                </div>

                                                {/* Email Field */}
                                                <div className="space-y-2">
                                                    <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                        Email
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="email"
                                                            value="carolyn_h@hotmail.com"
                                                            className="w-full px-3 py-4 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-poppins font-semibold text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                            readOnly
                                                        />
                                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 font-inter font-semibold text-sm text-[#C7A30D]">
                                                            Verified
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Phone Number Field */}
                                                <div className="space-y-2">
                                                    <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                        Phone number
                                                    </label>
                                                    <div className="flex gap-4">
                                                        <div className="w-36 relative">
                                                            <div className="flex items-center bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl p-3 h-12">
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src="https://api.builder.io/api/v1/image/assets/TEMP/7af0490344c9bc75ac7fca0fc554665ce8f9ad31?width=40"
                                                                        alt="US Flag"
                                                                        className="w-5 h-5 rounded-full"
                                                                    />
                                                                    <span className="font-inter font-semibold text-sm text-[#262626]">
                                                                        +1
                                                                    </span>
                                                                </div>
                                                                <ChevronDown className="w-6 h-6 text-[#737373] ml-auto" />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                type="tel"
                                                                value="121231234"
                                                                className="w-full px-3 py-4 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-poppins font-semibold text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                                readOnly
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Address Information Section */}
                                                <div className="pt-8">
                                                    <h2 className="font-dm-serif text-xl text-[#171717] leading-7 mb-6">
                                                        Address information
                                                    </h2>

                                                    <div className="space-y-6">
                                                        {/* Country Field */}
                                                        <div className="space-y-2">
                                                            <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                                Country
                                                            </label>
                                                            <div className="relative">
                                                                <div className="flex items-center bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl p-3 h-12">
                                                                    <div className="flex items-center gap-3">
                                                                        <img
                                                                            src="https://api.builder.io/api/v1/image/assets/TEMP/7af0490344c9bc75ac7fca0fc554665ce8f9ad31?width=40"
                                                                            alt="US Flag"
                                                                            className="w-5 h-5 rounded-full"
                                                                        />
                                                                        <span className="font-poppins font-semibold text-sm text-[#262626]">
                                                                            United
                                                                            States
                                                                        </span>
                                                                    </div>
                                                                    <ChevronDown className="w-6 h-6 text-[#737373] ml-auto" />
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Address Field */}
                                                        <div className="space-y-2">
                                                            <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                                Address
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value="123 Main St"
                                                                className="w-full px-3 py-4 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-poppins font-semibold text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                                readOnly
                                                            />
                                                        </div>

                                                        {/* City and Postal Code */}
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                                    City
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value="New York"
                                                                    className="w-full px-3 py-4 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-poppins font-semibold text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                                    readOnly
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                                    Postal Code
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value="10001"
                                                                    className="w-full px-3 py-4 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-poppins font-semibold text-sm text-[#262626] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                                    readOnly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Save Button */}
                                                <div className="flex justify-end pt-4">
                                                    <button className="bg-[#C7A30D] text-white font-poppins font-bold text-sm px-5 py-3.5 rounded-xl hover:bg-[#B8940C] transition-colors">
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {/* Security Tab Content */}
                                    {selectedNav === 'security' && (
                                        <div className="space-y-7">
                                            {/* Password Fields */}
                                            <div className="space-y-6">
                                                {/* Current Password */}
                                                <div className="space-y-2">
                                                    <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                        Current password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={
                                                                showPasswords.current
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            value="password123"
                                                            className="w-full px-3 py-4 pr-12 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-inter font-semibold text-sm text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                            placeholder="•••••••••"
                                                            readOnly
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                togglePasswordVisibility(
                                                                    'current',
                                                                )
                                                            }
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                        >
                                                            <svg
                                                                width="30"
                                                                height="30"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M15 5C5 5 1.25 15 1.25 15C1.25 15 5 25 15 25C25 25 28.75 15 28.75 15C28.75 15 25 5 15 5ZM15 7.5C21.595 7.5 24.9307 12.8339 26.0107 14.9951C24.9295 17.1414 21.5688 22.5 15 22.5C8.405 22.5 5.06926 17.1661 3.98926 15.0049C5.07176 12.8586 8.43125 7.5 15 7.5ZM15 10C12.2387 10 10 12.2387 10 15C10 17.7613 12.2387 20 15 20C17.7613 20 20 17.7613 20 15C20 12.2387 17.7613 10 15 10ZM15 12.5C16.3813 12.5 17.5 13.6187 17.5 15C17.5 16.3813 16.3813 17.5 15 17.5C13.6187 17.5 12.5 16.3813 12.5 15C12.5 13.6187 13.6187 12.5 15 12.5Z"
                                                                    fill="#C6C7C9"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* New Password */}
                                                <div className="space-y-2">
                                                    <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                        New password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={
                                                                showPasswords.new
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            value="newpassword"
                                                            className="w-full px-3 py-4 pr-12 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-inter font-semibold text-sm text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                            placeholder="•••••••••"
                                                            readOnly
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                togglePasswordVisibility(
                                                                    'new',
                                                                )
                                                            }
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                        >
                                                            <svg
                                                                width="30"
                                                                height="30"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M15 5C5 5 1.25 15 1.25 15C1.25 15 5 25 15 25C25 25 28.75 15 28.75 15C28.75 15 25 5 15 5ZM15 7.5C21.595 7.5 24.9307 12.8339 26.0107 14.9951C24.9295 17.1414 21.5688 22.5 15 22.5C8.405 22.5 5.06926 17.1661 3.98926 15.0049C5.07176 12.8586 8.43125 7.5 15 7.5ZM15 10C12.2387 10 10 12.2387 10 15C10 17.7613 12.2387 20 15 20C17.7613 20 20 17.7613 20 15C20 12.2387 17.7613 10 15 10ZM15 12.5C16.3813 12.5 17.5 13.6187 17.5 15C17.5 16.3813 16.3813 17.5 15 17.5C13.6187 17.5 12.5 16.3813 12.5 15C12.5 13.6187 13.6187 12.5 15 12.5Z"
                                                                    fill="#C6C7C9"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Confirm New Password */}
                                                <div className="space-y-2">
                                                    <label className="block font-poppins font-semibold text-sm text-[#737373] leading-[21px]">
                                                        Confirm new password
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type={
                                                                showPasswords.confirm
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            value="newpassword"
                                                            className="w-full px-3 py-4 pr-12 bg-[#F5F5F5] border border-[#F5F5F5] rounded-xl font-inter font-semibold text-sm text-[#A3A3A3] focus:outline-none focus:ring-2 focus:ring-[#C7A30D] focus:border-transparent"
                                                            placeholder="•••••••••"
                                                            readOnly
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                togglePasswordVisibility(
                                                                    'confirm',
                                                                )
                                                            }
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                        >
                                                            <svg
                                                                width="30"
                                                                height="30"
                                                                viewBox="0 0 30 30"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M15 5C5 5 1.25 15 1.25 15C1.25 15 5 25 15 25C25 25 28.75 15 28.75 15C28.75 15 25 5 15 5ZM15 7.5C21.595 7.5 24.9307 12.8339 26.0107 14.9951C24.9295 17.1414 21.5688 22.5 15 22.5C8.405 22.5 5.06926 17.1661 3.98926 15.0049C5.07176 12.8586 8.43125 7.5 15 7.5ZM15 10C12.2387 10 10 12.2387 10 15C10 17.7613 12.2387 20 15 20C17.7613 20 20 17.7613 20 15C20 12.2387 17.7613 10 15 10ZM15 12.5C16.3813 12.5 17.5 13.6187 17.5 15C17.5 16.3813 16.3813 17.5 15 17.5C13.6187 17.5 12.5 16.3813 12.5 15C12.5 13.6187 13.6187 12.5 15 12.5Z"
                                                                    fill="#C6C7C9"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Update Button */}
                                            <div className="flex justify-end pt-4">
                                                <button className="bg-[#C7A30D] text-white font-poppins font-bold text-sm px-5 py-3.5 rounded-xl hover:bg-[#B8940C] transition-colors">
                                                    Update
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Notification Tab Content */}
                                    {selectedNav === 'notification' && (
                                        <div className="space-y-0">
                                            {/* Desktop Notification */}
                                            <div className="flex items-center justify-between py-6 border-b border-[#E5E5E5]">
                                                <div className="space-y-1">
                                                    <h3 className="font-poppins text-lg font-medium text-[#171717]">
                                                        Enable desktop
                                                        notification
                                                    </h3>
                                                    <p className="font-poppins text-sm font-medium text-[#737373]">
                                                        Decide whether you want
                                                        to be notified of new
                                                        message & updates
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        toggleNotification(
                                                            'desktop',
                                                        )
                                                    }
                                                    className={`relative w-11 h-6 rounded-full transition-colors ${
                                                        notificationSettings.desktop
                                                            ? 'bg-[#C7A30D]'
                                                            : 'bg-[#E5E5E5]'
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                            notificationSettings.desktop
                                                                ? 'translate-x-5.5'
                                                                : 'translate-x-0.5'
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Unread Notification Badge */}
                                            <div className="flex items-center justify-between py-6 border-b border-[#E5E5E5]">
                                                <div className="space-y-1">
                                                    <h3 className="font-poppins text-lg font-medium text-[#171717]">
                                                        Enable unread
                                                        notification badge
                                                    </h3>
                                                    <p className="font-poppins text-sm font-medium text-[#737373]">
                                                        Display a red indicator
                                                        on of the notification
                                                        icon when you have
                                                        unread message
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        toggleNotification(
                                                            'unreadBadge',
                                                        )
                                                    }
                                                    className={`relative w-11 h-6 rounded-full transition-colors ${
                                                        notificationSettings.unreadBadge
                                                            ? 'bg-[#C7A30D]'
                                                            : 'bg-[#E5E5E5]'
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                            notificationSettings.unreadBadge
                                                                ? 'translate-x-5.5'
                                                                : 'translate-x-0.5'
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {/* Email Notification */}
                                            <div className="flex items-center justify-between py-6">
                                                <div className="space-y-1">
                                                    <h3 className="font-poppins text-lg font-medium text-[#171717]">
                                                        Email notification
                                                    </h3>
                                                    <p className="font-poppins text-sm font-medium text-[#737373]">
                                                        Substance can send you
                                                        email notification for
                                                        any new direct message
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        toggleNotification(
                                                            'email',
                                                        )
                                                    }
                                                    className={`relative w-11 h-6 rounded-full transition-colors ${
                                                        notificationSettings.email
                                                            ? 'bg-[#C7A30D]'
                                                            : 'bg-[#E5E5E5]'
                                                    }`}
                                                >
                                                    <div
                                                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                                                            notificationSettings.email
                                                                ? 'translate-x-5.5'
                                                                : 'translate-x-0.5'
                                                        }`}
                                                    />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Billing Tab Content */}
                                    {selectedNav === 'billing' && (
                                        <div className="space-y-8">
                                            {/* Current Subscription */}
                                            <div className="bg-[#F5F5F5] rounded-xl p-6">
                                                <div className="space-y-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#00BC7D] rounded-full flex items-center justify-center">
                                                            <svg
                                                                width="20"
                                                                height="21"
                                                                viewBox="0 0 20 21"
                                                                fill="none"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path
                                                                    d="M16.7076 10.3016L7.95759 19.6766C7.86487 19.7755 7.74247 19.8416 7.60888 19.8649C7.47528 19.8882 7.33773 19.8674 7.21699 19.8057C7.09625 19.7439 6.99886 19.6446 6.93953 19.5227C6.88019 19.4007 6.86213 19.2628 6.88806 19.1297L8.03338 13.4008L3.53103 11.7102C3.43434 11.674 3.34811 11.6144 3.28005 11.5368C3.21199 11.4592 3.16422 11.3659 3.14101 11.2653C3.11779 11.1647 3.11986 11.0599 3.14702 10.9603C3.17418 10.8607 3.22559 10.7694 3.29666 10.6945L12.0467 1.31953C12.1394 1.22057 12.2618 1.15446 12.3954 1.13117C12.529 1.10788 12.6665 1.12867 12.7873 1.19041C12.908 1.25215 13.0054 1.35148 13.0647 1.47342C13.1241 1.59537 13.1421 1.7333 13.1162 1.86641L11.9677 7.60156L16.4701 9.28984C16.5661 9.32626 16.6516 9.38575 16.7191 9.46307C16.7867 9.54039 16.8341 9.63315 16.8573 9.73315C16.8805 9.83316 16.8786 9.93734 16.852 10.0365C16.8253 10.1356 16.7747 10.2267 16.7045 10.3016H16.7076Z"
                                                                    fill="#F5F5F5"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="font-poppins text-base font-bold text-[#171717]">
                                                                    Business
                                                                    board basic
                                                                </h3>
                                                                <span className="bg-[rgba(5,235,118,0.14)] text-[#10B981] text-xs font-inter font-semibold px-2.5 py-1 rounded-md capitalize">
                                                                    active
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm font-poppins font-semibold text-[#737373]">
                                                                <span>
                                                                    Billing
                                                                    monthly |
                                                                    Next payment
                                                                    on
                                                                    02/10/2025
                                                                </span>
                                                                <span>for</span>
                                                                <span className="text-[#171717] font-bold">
                                                                    $59.90
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-5">
                                                        <button className="border border-[#C7A30D] text-[#C7A30D] font-poppins font-bold text-sm px-3 py-2.5 rounded-xl hover:bg-[#C7A30D]/10 transition-colors">
                                                            Cancel Subscription
                                                        </button>
                                                        <button className="bg-[#C7A30D] text-white font-poppins font-bold text-sm px-3 py-2.5 rounded-xl hover:bg-[#B8940C] transition-colors">
                                                            Upgrade Plan
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Method */}
                                            <div className="space-y-4">
                                                <h2 className="font-poppins text-lg font-bold text-[#171717]">
                                                    Payment method
                                                </h2>
                                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src="https://api.builder.io/api/v1/image/assets/TEMP/8edca8828a151f4b2c1d17658eb4240905dbcce0?width=120"
                                                            alt="Mastercard"
                                                            className="w-15 h-6"
                                                        />
                                                        <div>
                                                            <div className="font-poppins font-semibold text-sm text-[#171717]">
                                                                Carolyn Perkins
                                                                •••• 8461
                                                            </div>
                                                            <div className="font-poppins text-sm text-[#737373]">
                                                                Expired Jun 2025
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button className="border border-[#D4D4D4] bg-white text-[#525252] font-poppins font-bold text-sm px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                                                        Update Card Information
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Transaction History */}
                                            <div className="space-y-4">
                                                <h2 className="font-poppins text-lg font-bold text-[#171717]">
                                                    Transaction history
                                                </h2>
                                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                                    {/* Table Header */}
                                                    <div className="bg-gray-50 border-b border-[#E5E5E5]">
                                                        <div className="grid grid-cols-5 gap-4 p-6">
                                                            <div className="font-inter text-xs font-semibold text-[#737373] uppercase tracking-wider">
                                                                Date & Time
                                                            </div>
                                                            <div className="font-poppins text-xs font-semibold text-[#737373] uppercase tracking-wider">
                                                                Product
                                                            </div>
                                                            <div className="font-poppins text-xs font-semibold text-[#737373] uppercase tracking-wider">
                                                                Status
                                                            </div>
                                                            <div className="font-poppins text-xs font-semibold text-[#737373] uppercase tracking-wider">
                                                                Date
                                                            </div>
                                                            <div className="font-inter text-xs font-semibold text-[#737373] uppercase tracking-wider">
                                                                Amount
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Table Body */}
                                                    <div className="divide-y divide-[#E5E5E5]">
                                                        {transactionHistory.map(
                                                            (transaction) => (
                                                                <div
                                                                    key={
                                                                        transaction.id
                                                                    }
                                                                    className="grid grid-cols-5 gap-4 p-6"
                                                                >
                                                                    <div className="font-inter text-sm font-bold text-[#171717]">
                                                                        {
                                                                            transaction.id
                                                                        }
                                                                    </div>
                                                                    <div className="font-poppins text-sm font-semibold text-[#737373]">
                                                                        {
                                                                            transaction.product
                                                                        }
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <div
                                                                            className={`w-3 h-3 rounded-full ${
                                                                                transaction.status ===
                                                                                'paid'
                                                                                    ? 'bg-[#00BC7D]'
                                                                                    : 'bg-[#FFB900]'
                                                                            }`}
                                                                        ></div>
                                                                        <span className="font-poppins text-sm font-bold text-[#171717] capitalize">
                                                                            {
                                                                                transaction.status
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                    <div className="font-poppins text-sm text-[#737373]">
                                                                        {
                                                                            transaction.date
                                                                        }
                                                                    </div>
                                                                    <div className="font-inter text-sm text-[#737373]">
                                                                        {
                                                                            transaction.amount
                                                                        }
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Subscription Plans */}
                                            <div className="space-y-6">
                                                <h2 className="font-poppins text-lg font-bold text-black">
                                                    Subscription Plans
                                                </h2>

                                                <div className="bg-white rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] p-6">
                                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                                        {subscriptionPlans.map(
                                                            (plan) => (
                                                                <div
                                                                    key={
                                                                        plan.name
                                                                    }
                                                                    className={`relative rounded-xl border-2 p-6 ${
                                                                        plan.current
                                                                            ? 'border-[#C7A30D] bg-[#FFFAF4]'
                                                                            : 'border-[#E5E7EB] bg-white'
                                                                    }`}
                                                                >
                                                                    {plan.current && (
                                                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                                            <span className="bg-[#DDBA8C] text-black text-sm font-inter px-3 py-1 rounded-full">
                                                                                Current
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    <div className="space-y-6">
                                                                        {/* Plan Name */}
                                                                        <h3 className="text-center text-xl font-dm-serif text-black">
                                                                            {
                                                                                plan.name
                                                                            }
                                                                        </h3>

                                                                        {/* Price */}
                                                                        <div className="text-center">
                                                                            <span className="text-3xl font-inter font-bold text-black">
                                                                                {
                                                                                    plan.price
                                                                                }
                                                                            </span>
                                                                            <span className="text-lg font-poppins text-[#6B7280]">
                                                                                {
                                                                                    plan.period
                                                                                }
                                                                            </span>
                                                                        </div>

                                                                        {/* Storage */}
                                                                        <div className="text-center py-2">
                                                                            <span className="text-lg font-poppins text-black">
                                                                                {
                                                                                    plan.storage
                                                                                }
                                                                            </span>
                                                                        </div>

                                                                        {/* Features */}
                                                                        <div className="space-y-3">
                                                                            {plan.features.map(
                                                                                (
                                                                                    feature,
                                                                                    index,
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            index
                                                                                        }
                                                                                        className="flex items-center gap-2"
                                                                                    >
                                                                                        <svg
                                                                                            width="17"
                                                                                            height="17"
                                                                                            viewBox="0 0 17 17"
                                                                                            fill="none"
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                        >
                                                                                            <path
                                                                                                d="M13.8959 4.4767L6.28547 12.0872L2.82617 8.62786"
                                                                                                stroke="#22C55E"
                                                                                                strokeWidth="1.38372"
                                                                                                strokeLinecap="round"
                                                                                                strokeLinejoin="round"
                                                                                            />
                                                                                        </svg>
                                                                                        <span className="text-base font-poppins text-black">
                                                                                            {
                                                                                                feature
                                                                                            }
                                                                                        </span>
                                                                                    </div>
                                                                                ),
                                                                            )}
                                                                        </div>

                                                                        {/* Button */}
                                                                        <div className="pt-4">
                                                                            {plan.current ? (
                                                                                <button className="w-full bg-white text-[#C7A30D] font-poppins text-base py-2 rounded-lg border border-[#C7A30D]">
                                                                                    Current
                                                                                    Plan
                                                                                </button>
                                                                            ) : (
                                                                                <button className="w-full bg-[#C7A30D] text-white font-poppins text-base py-2 rounded-lg hover:bg-[#B8940C] transition-colors">
                                                                                    Upgrade
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>

                                                    {/* Payment Security */}
                                                    <div className="flex items-center justify-center gap-2 mt-6 pt-6">
                                                        <span className="text-xs font-poppins text-[#6B7280]">
                                                            Payments secured by
                                                        </span>
                                                        <svg
                                                            width="58"
                                                            height="24"
                                                            viewBox="0 0 58 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <g clipPath="url(#clip0_64_1122)">
                                                                <path
                                                                    d="M57.3825 13.8236C57.3825 19.6783 52.679 24.3813 46.8237 24.3813H11.1155C5.26013 24.3813 0.556641 19.6783 0.556641 13.8236C0.556641 7.96882 5.26013 3.26584 11.1155 3.26584H46.8237C52.679 3.26584 57.3825 7.96882 57.3825 13.8236Z"
                                                                    fill="#6772E5"
                                                                />
                                                                <path
                                                                    d="M16.875 14.2076C16.875 13.3437 17.5469 12.6718 18.4108 12.6718C19.2747 12.6718 19.9467 13.3437 19.9467 14.2076C19.9467 15.0716 19.2747 15.7435 18.4108 15.7435C17.5469 15.7435 16.875 15.0716 16.875 14.2076Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M20.9062 14.2076C20.9062 13.3437 21.5782 12.6718 22.4421 12.6718C23.306 12.6718 23.9779 13.3437 23.9779 14.2076C23.9779 15.0716 23.306 15.7435 22.4421 15.7435C21.5782 15.7435 20.9062 15.0716 20.9062 14.2076Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M24.9375 14.2076C24.9375 13.3437 25.6094 12.6718 26.4733 12.6718C27.3372 12.6718 28.0092 13.3437 28.0092 14.2076C28.0092 15.0716 27.3372 15.7435 26.4733 15.7435C25.6094 15.7435 24.9375 15.0716 24.9375 14.2076Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M28.9688 14.2076C28.9688 13.3437 29.6407 12.6718 30.5046 12.6718C31.3685 12.6718 32.0404 13.3437 32.0404 14.2076C32.0404 15.0716 31.3685 15.7435 30.5046 15.7435C29.6407 15.7435 28.9688 15.0716 28.9688 14.2076Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M33 14.2076C33 13.3437 33.6719 12.6718 34.5358 12.6718C35.3997 12.6718 36.0717 13.3437 36.0717 14.2076C36.0717 15.0716 35.3997 15.7435 34.5358 15.7435C33.6719 15.7435 33 15.0716 33 14.2076Z"
                                                                    fill="white"
                                                                />
                                                                <path
                                                                    d="M37.0312 14.2076C37.0312 13.3437 37.7032 12.6718 38.5671 12.6718C39.431 12.6718 40.1029 13.3437 40.1029 14.2076C40.1029 15.0716 39.431 15.7435 38.5671 15.7435C37.7032 15.7435 37.0312 15.0716 37.0312 14.2076Z"
                                                                    fill="white"
                                                                />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_64_1122">
                                                                    <rect
                                                                        width="57.5938"
                                                                        height="23.9974"
                                                                        fill="white"
                                                                        transform="translate(0.171875 0.00131226)"
                                                                    />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
