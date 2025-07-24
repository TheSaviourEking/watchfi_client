import { Outlet } from 'react-router'
import Footer from './Footer'
import Navbar from './Navbar'
import { CheckoutProvider } from '../context/CheckoutContext'
import { Toaster } from "@/components/ui/sonner"

const RootLayout = () => {
    return (
        <>
            <div className="font-clash">
                <CheckoutProvider>
                    <Navbar />
                    <main>
                        <Outlet />
                    </main>
                    <Toaster />
                    <Footer />
                </CheckoutProvider >
            </div>
        </>
    )
}

export default RootLayout;