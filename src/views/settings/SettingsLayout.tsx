import { useState } from 'react'
import { User, Lock, Bell, CreditCard } from 'lucide-react'
import classNames from 'classnames'
import Profile from './Profile'
import Security from './Security'
import Notification from './Notification'
import Billing from './Billing'

// Import subcomponents

const menuItems = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'notification', label: 'Notification', icon: <Bell size={18} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={18} /> },
]

export default function SettingsLayout() {
    const [activeTab, setActiveTab] = useState('profile')

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full flex-col  md:flex-row gap-2  rounded-xl bg-[#2f3349] shadow-sm p-6 flex">
                {/* Sidebar */}
                <aside className="w-full sm:w-1/4 sm:pr-6">
                    <ul className="flex flex-row sm:flex-col flex-wrap gap-2 sm:space-y-2 sm:gap-0">
                        {menuItems.map((item) => (
                            <li key={item.id} className="flex-1 sm:flex-none">
                                <button
                                    onClick={() => setActiveTab(item.id)}
                                    className={classNames(
                                        'flex items-center justify-center sm:justify-start w-full px-4 py-2 text-sm rounded-md transition',
                                        activeTab === item.id
                                            ? 'bg-[#FFB84C] text-[#2f3349] font-medium'
                                            : 'hover:bg-[#FFB84C] text-[#ffffff] font-medium',
                                    )}
                                >
                                    <div className="mr-2">{item.icon}</div>
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Content */}
                <main className="flex-1 md:pl-6 mt-8 md:mt-0">
                    {activeTab === 'profile' && <Profile />}
                    {activeTab === 'security' && <Security />}
                    {activeTab === 'notification' && <Notification />}
                    {activeTab === 'billing' && <Billing />}
                </main>
            </div>
        </div>
    )
}
