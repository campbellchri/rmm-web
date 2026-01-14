import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import AuthorityGuard from './AuthorityGuard'
import AppRoute from './AppRoute'
import PageContainer from '@/components/template/PageContainer'
import { protectedRoutes, publicRoutes } from '@/configs/routes.config'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth'
import { Routes, Route, Navigate } from 'react-router-dom'
import type { LayoutType } from '@/@types/theme'
import Index from '@/views/Home/Index'

interface ViewsProps {
    pageContainerType?: 'default' | 'gutterless' | 'contained'
    layout?: LayoutType
}

type AllRoutesProps = ViewsProps

const { authenticatedEntryPath } = appConfig

const AllRoutes = (props: AllRoutesProps) => {
    const { user } = useAuth()

    return (
        <Routes>
            {/* ----- Public Routes ----- */}
            <Route path="/" element={<PublicRoute />}>
                {/* Default public home */}
                <Route index element={<Index />} />
                {publicRoutes.map((route) => (
                    <Route
                        key={route.key}
                        path={route.path}
                        element={
                            <AppRoute
                                routeKey={route.key}
                                component={route.component}
                                {...route.meta}
                            />
                        }
                    />
                ))}
            </Route>

            {/* ----- Protected Routes ----- */}
            <Route path="/" element={<ProtectedRoute />}>
                <Route
                    path="/"
                    element={<Navigate replace to={authenticatedEntryPath} />}
                />
                {protectedRoutes.map((route, index) => (
                    <Route
                        key={route.key + index}
                        path={route.path}
                        element={
                            <AuthorityGuard
                                userAuthority={user.authority}
                                authority={route.authority}
                            >
                                <PageContainer {...props} {...route.meta}>
                                    <AppRoute
                                        routeKey={route.key}
                                        component={route.component}
                                        {...route.meta}
                                    />
                                </PageContainer>
                            </AuthorityGuard>
                        }
                    />
                ))}
            </Route>

            {/* ----- Fallback ----- */}
            <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
    )
}

export default AllRoutes
