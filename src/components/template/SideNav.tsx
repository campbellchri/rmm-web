import classNames from '@/utils/classNames'
import ScrollBar from '@/components/ui/ScrollBar'
import Logo from '@/components/template/Logo'
import VerticalMenuContent from '@/components/template/VerticalMenuContent'
import { useThemeStore } from '@/store/themeStore'
import { useSessionUser } from '@/store/authStore'
import { useRouteKeyStore } from '@/store/routeKeyStore'
import navigationConfig from '@/configs/navigation.config'
import appConfig from '@/configs/app.config'
import { Link } from 'react-router-dom'
import {
    SIDE_NAV_WIDTH,
    SIDE_NAV_COLLAPSED_WIDTH,
    SIDE_NAV_CONTENT_GUTTER,
    HEADER_HEIGHT,
    LOGO_X_GUTTER,
} from '@/constants/theme.constant'
import type { Mode } from '@/@types/theme'
import { HiOutlineLogout } from 'react-icons/hi'
import useAuth from '@/auth/useAuth'
import Tooltip from '@/components/ui/Tooltip'

type SideNavProps = {
    translationSetup?: boolean
    background?: boolean
    className?: string
    contentClass?: string
    mode?: Mode
}

const sideNavStyle = {
    width: SIDE_NAV_WIDTH,
    minWidth: SIDE_NAV_WIDTH,
}

const sideNavCollapseStyle = {
    width: SIDE_NAV_COLLAPSED_WIDTH,
    minWidth: SIDE_NAV_COLLAPSED_WIDTH,
}

const SideNav = ({
    translationSetup = appConfig.activeNavTranslation,
    background = true,
    className,
    contentClass,
    mode,
}: SideNavProps) => {
    const defaultMode = useThemeStore((state) => state.mode)
    const direction = useThemeStore((state) => state.direction)
    const sideNavCollapse = useThemeStore(
        (state) => state.layout.sideNavCollapse,
    )

    const currentRouteKey = useRouteKeyStore((state) => state.currentRouteKey)

    const userAuthority = useSessionUser((state) => state.user.authority)

    const { signOut } = useAuth()

    const handleSignOut = () => {
        signOut()
    }

    return (
        <div
            style={sideNavCollapse ? sideNavCollapseStyle : sideNavStyle}
            className={classNames(
                'side-nav',
                background && 'side-nav-bg',
                !sideNavCollapse && 'side-nav-expand',
                className,
            )}
        >
            <Link
                to={appConfig.authenticatedEntryPath}
                className="side-nav-header flex flex-col justify-center bg-[#2F3349]"
                style={{ height: HEADER_HEIGHT }}
            >
                <Logo
                    imgClass="w-[140px]"
                    mode={mode || defaultMode}
                    type={sideNavCollapse ? 'streamline' : 'full'}
                    className={classNames(
                        sideNavCollapse && 'ltr:ml-[11.5px] ltr:mr-[11.5px]',
                        sideNavCollapse
                            ? SIDE_NAV_CONTENT_GUTTER
                            : LOGO_X_GUTTER,
                    )}
                />
            </Link>
            <div
                className={classNames(
                    'side-nav-content flex flex-col justify-between',
                    contentClass,
                )}
            >
                <ScrollBar style={{ height: '100%' }} direction={direction}>
                    <VerticalMenuContent
                        collapsed={sideNavCollapse}
                        navigationTree={navigationConfig}
                        routeKey={currentRouteKey}
                        direction={direction}
                        translationSetup={translationSetup}
                        userAuthority={userAuthority || []}
                    />
                </ScrollBar>
                <div className="px-4 pb-4 bg-[#2F3349]">
                    <div
                        className={classNames(
                            'flex items-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500',
                            sideNavCollapse
                                ? 'justify-center px-0'
                                : 'justify-start',
                        )}
                        onClick={handleSignOut}
                    >
                        {sideNavCollapse ? (
                            <Tooltip title="Sign Out" placement="right">
                                <span className="text-2xl">
                                    <HiOutlineLogout className='text-[#E4405F]' />
                                </span>
                            </Tooltip>
                        ) : (
                            <>
                                <span className="text-2xl">
                                    <HiOutlineLogout className='text-[#E4405F]' />
                                </span>
                                <span className="font-semibold text-[#E4405F]">Sign Out</span>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideNav
