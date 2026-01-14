import { lazy } from 'react'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const othersRoute: Routes = [
    {
        key: 'accessDenied',
        path: '/access-denied',
        component: lazy(() => import('@/views/others/AccessDenied')),
        authority: [ADMIN, USER],
        meta: {
            pageBackgroundType: 'plain',
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contact',
        path: '/contactUs',
        authority: [ADMIN, USER],
        component: lazy(() => import('@/views/contactUs')),
        meta: {
            layout: 'blank',
        },
    },
    {
        key: 'aboutUs',
        path: '/about-us',
        authority: [ADMIN, USER],
        component: lazy(() => import('@/views/AboutUs')),
        meta: {
            layout: 'blank',
        },
    },
    {
        key: 'termsAndConditions',
        path: '/terms-and-conditions',
        authority: [ADMIN, USER],
        component: lazy(() => import('@/views/TermsAndConditions')),
        meta: {
            layout: 'blank',
        },
    },
    {
        key: 'privacyPolicy',
        path: '/privacy-policy',
        authority: [ADMIN, USER],
        component: lazy(() => import('@/views/PrivacyPolicy')),
        meta: {
            layout: 'blank',
        },
    },
]

export default othersRoute