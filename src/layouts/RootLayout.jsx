import { Outlet } from 'react-router'
import Footer from './Footer'
import Navbar from './Navbar'
import { CheckoutProvider } from '../context/CheckoutContext'
import { ErrorBoundary } from './ErrorBoundary'

const RootLayout = () => {
    return (
        <>
            <div className="font-clash">
                <CheckoutProvider>
                    <Navbar />
                    <ErrorBoundary>
                        <main>
                            <Outlet />
                        </main>
                    </ErrorBoundary>
                    <Footer />
                </CheckoutProvider >
            </div>
        </>
    )
}

export default RootLayout;