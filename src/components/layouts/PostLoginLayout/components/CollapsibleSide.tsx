import { useLocation, useSearchParams } from 'react-router-dom'
import SideNav from '@/components/template/SideNav'
import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import Notification from '@/components/template/Notification'
import LayoutBase from '@/components/template/LayoutBase'
import useResponsive from '@/utils/hooks/useResponsive'
import Avatar from '@/components/ui/Avatar'
import { useSessionUser } from '@/store/authStore'
import { PiUserDuotone } from 'react-icons/pi'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'

const CollapsibleSide = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()
    const location = useLocation()
    const { avatar, userName } = useSessionUser((state) => state.user)

    const avatarProps = {
        ...(avatar ? { src: avatar } : {}),
    }

    const getInitials = (name: string) => {
        if (!name) return ''
        const parts = name.split(' ')
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        }
        return parts[0][0].toUpperCase()
    }

    const [searchParams] = useSearchParams()

    const hiddenSideNavRoutes = [
        '/dashboard/memorial',
        '/dashboard/event-memorial',
        '/dashboard/video-memorial',
        '/dashboard/edit-memorial',
    ]

    const selectedTemplate = searchParams.get('selected-template')

    const shouldHideSideNav =
        hiddenSideNavRoutes.includes(location.pathname) ||
        (location.pathname === '/dashboard/select-template' &&
            !!selectedTemplate)

    return (
        <LayoutBase
            type={LAYOUT_COLLAPSIBLE_SIDE}
            className="app-layout-collapsible-side flex flex-auto flex-col"
        >
            <div className="flex flex-auto min-w-0">
                {larger.lg && <SideNav />}

                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full">
                    <Header
                        className="shadow-sm dark:shadow-2xl"
                        headerStart={
                            <>
                                {smaller.lg && <MobileNav />}
                                {larger.lg && <SideNavToggle />}
                            </>
                        }
                        headerEnd={
                            <div className="flex items-center gap-2">
                                <Notification />
                                <div className="flex items-center gap-2 mr-2">
                                    <Avatar size={32} {...avatarProps}>
                                        {userName ? getInitials(userName) : ''}
                                    </Avatar>
                                    <div className="hidden md:block">
                                        <div className="font-semibold text-white">
                                            <span>{userName}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    />
                    <div className="h-full flex flex-auto flex-col">
                        {children}
                    </div>
                </div>
            </div>
        </LayoutBase>
    )
}

export default CollapsibleSide
