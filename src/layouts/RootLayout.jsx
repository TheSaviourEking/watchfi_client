import { Outlet } from 'react-router'
import Footer from './Footer'
import Navbar from './Navbar'
import { CheckoutProvider } from '../context/CheckoutContext'

const RootLayout = () => {
    return (
        <>
            <div className="font-clash">
                <CheckoutProvider>
                    <Navbar />
                    <main className='flex-1 min-h-screen'>
                        <Outlet />
                    </main>
                    <Footer />
                </CheckoutProvider >
            </div>
        </>
    )
}

export default RootLayout