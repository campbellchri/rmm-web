import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    {
        key: 'main',
        path: '',
        title: 'Main',
        translateKey: 'nav.main.main',
        icon: 'main',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'dashboard',
                path: '/dashboard',
                title: 'Dashboard',
                translateKey: 'nav.dashboard',
                icon: 'dashboard',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
    /** Example purpose only, please remove */
    // {
    //     key: 'content',
    //     path: '',
    //     title: 'CONTENT',
    //     translateKey: 'nav.content.content',
    //     icon: 'content',
    //     type: NAV_ITEM_TYPE_TITLE,
    //     authority: [],
    //     subMenu: [
    //         {
    //             key: 'content.single',
    //             path: '/group-single-menu-item-view',
    //             title: 'Photo & Videos',
    //             translateKey: 'nav.groupMenu.single',
    //             icon: 'photoVideos',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: [],
    //             subMenu: [],
    //         },
    //         {
    //             key: 'settings.single',
    //             path: '/group-single-menu-item-view',
    //             title: 'Memories',
    //             translateKey: 'nav.groupMenu.single',
    //             icon: 'memories',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: [],
    //             subMenu: [],
    //         },
    //     ],
    // },

    {
        key: 'settings',
        path: '',
        title: 'SETTINGS',
        translateKey: 'nav.settings.settings',
        icon: 'settings',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [],
        subMenu: [
            {
                key: 'settings',
                path: '/settings',
                title: 'General Settings',
                translateKey: 'nav.settings',
                icon: 'generalsettings',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
            {
                key: 'help-support',
                path: '/help-support',
                title: 'Help & Supports',
                translateKey: 'nav.help-support',
                icon: 'helpSupport',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: [],
            },
        ],
    },
]

export default navigationConfig
