import { useLocation, useSearchParams } from 'react-router-dom'
import SideNav from '@/components/template/SideNav'
import Header from '@/components/template/Header'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import UserProfileDropdown from '@/components/template/UserProfileDropdown'
import Notification from '@/components/template/Notification'
import LayoutBase from '@/components/template/LayoutBase'
import useResponsive from '@/utils/hooks/useResponsive'
import { LAYOUT_COLLAPSIBLE_SIDE } from '@/constants/theme.constant'
import type { CommonProps } from '@/@types/common'

const CollapsibleSide = ({ children }: CommonProps) => {
    const { larger, smaller } = useResponsive()
    const location = useLocation()
    const [searchParams] = useSearchParams()

    // static routes where sidenav should always be hidden
    const hiddenSideNavRoutes = [
        '/dashboard/memorial',
        '/dashboard/event-memorial',
        '/dashboard/video-memorial',
        '/dashboard/edit-memorial',
    ]

    // read query param
    const selectedTemplate = searchParams.get('selected-template')

    // hide if:
    // 1. route is in static hidden list
    // 2. OR route is /dashboard/select-template with a query param
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
                                <UserProfileDropdown hoverable={false} />
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
