import { BrowserRouter } from 'react-router-dom'
import Theme from '@/components/template/Theme'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { useEffect } from 'react'

if (appConfig.enableMock) {
    import('./mock')
}

function App() {
    useEffect(() => {
        AOS.init({
            duration: 1200,
            once: false, // allow repeat
            mirror: true,
        })
        AOS.refresh()
    }, [])
    return (
        <Theme>
            <BrowserRouter>
                <AuthProvider>
                    <Layout>
                        <Views />
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
        </Theme>
    )
}

export default App
