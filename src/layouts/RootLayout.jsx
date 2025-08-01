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
                    <div className="flex flex-col min-h-screen w-full">
                        <Navbar />
                        <ErrorBoundary>
                            <main className='flex-1'>
                                 <div className="py-20 lg:py-0"></div>
                                <Outlet />
                            </main>
                        </ErrorBoundary>
                        <Footer />
                    </div>
                </CheckoutProvider >
            </div>
        </>
    )
}

export default RootLayout;