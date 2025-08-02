import { useLocation } from 'react-router';
import { Outlet } from 'react-router';
import Footer from './Footer';
import Navbar from './Navbar';
import { CheckoutProvider } from '../context/CheckoutContext';
import { ErrorBoundary } from './ErrorBoundary';

const RootLayout = () => {
    const location = useLocation(); // Get the current location object
    console.log('Current path:', location.pathname); // Log the current path

    // Check if the current path is '/' or '/goat'
    if (location.pathname === '/') {
        console.log('Current path is /');
    } else if (location.pathname === '/goat') {
        console.log('Current path is /goat');
    }

    return (
        <>
            <div className="font-clash">
                <CheckoutProvider>
                    <div className="flex flex-col min-h-screen w-full">
                        <Navbar />
                        <ErrorBoundary>
                            <main className='flex-1'>
                                {
                                    location.pathname !== "/" ? (
                                        <div className="py-20 lg:py-0"></div>
                                    ) : ''
                                }
                                <Outlet />
                            </main>
                        </ErrorBoundary>
                        <Footer />
                    </div>
                </CheckoutProvider>
            </div>
        </>
    );
}

export default RootLayout;