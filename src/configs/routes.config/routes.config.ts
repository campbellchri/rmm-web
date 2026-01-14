import { lazy } from 'react'
import authRoute from './authRoute'
import othersRoute from './othersRoute'
import type { Routes } from '@/@types/routes'

export const publicRoutes: Routes = [...authRoute,  ...othersRoute]

export const protectedRoutes: Routes = [
    {
        key: 'dashboard',
        path: '/dashboard',
        component: lazy(() => import('@/views/dashboard/index')),
        authority: [],
    },
    {
        key: 'createMemorial',
        path: '/dashboard/create-memorial',
        component: lazy(() => import('@/views/dashboard/CreateMemorial')),
        authority: [],
    },
    {
        key: 'selectTemplate',
        path: '/dashboard/Select-template',
        component: lazy(() => import('@/views/dashboard/SelectTemplates')),
        authority: [],
    },
    {
        key: 'classicTemplat',
        path: '/dashboard/classic-template',
        component: lazy(() => import('@/views/dashboard/ClassicTemplateMode')),
        authority: [],
    },
    {
        key: 'videoOnlyTemplate',
        path: '/dashboard/videoOnly-template',
        component: lazy(
            () => import('@/views/dashboard/VideoOnlyTemplateMode'),
        ),
        authority: [],
    },
    {
        key: 'eventTemplate',
        path: '/dashboard/event-template',
        component: lazy(() => import('@/views/dashboard/EventTemplateMode')),
        authority: [],
    },

    {
        key: 'memorial',
        path: '/dashboard/memorial',
        component: lazy(() => import('@/views/dashboard/classicMemorial')),
        authority: [],
    },
    {
        key: 'event-memorial',
        path: '/dashboard/event-memorial',
        component: lazy(() => import('@/views/dashboard/EventMemorial')),
        authority: [],
    },
    {
        key: 'video-memorial',
        path: '/dashboard/video-memorial',
        component: lazy(() => import('@/views/dashboard/VideoOnlyMemorial')),
        authority: [],
    },
    {
        key: 'edit-memorial',
        path: '/dashboard/edit-memorial',
        component: lazy(() => import('@/views/dashboard/EditMemorial')),
        authority: [],
    },
    /** Example purpose only, please remove */
    {
        key: 'settings',
        path: '/settings',
        component: lazy(() => import('@/views/settings/SettingsLayout')),
        authority: [],
    },
    {
        key: 'help-support',
        path: '/help-support',
        component: lazy(() => import('@/views/HelpAndSupport.tsx/HelpLayout')),
        authority: [],
    },
    {
        key: 'collapseMenu.item2',
        path: '/collapse-menu-item-view-2',
        component: lazy(() => import('@/views/demo/CollapseMenuItemView2')),
        authority: [],
    },
    {
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        component: lazy(() => import('@/views/demo/GroupSingleMenuItemView')),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-collapse-menu-item-view-1',
        component: lazy(
            () => import('@/views/demo/GroupCollapseMenuItemView1'),
        ),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        component: lazy(
            () => import('@/views/demo/GroupCollapseMenuItemView2'),
        ),
        authority: [],
    },
    ...othersRoute,
]
