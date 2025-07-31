import { Outlet } from 'react-router';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-black text-white">
            <div className="">
                <Sidebar />
            </div>
            <main className="flex-1 flex flex-col">
                <div className="px-7 py-5">
                    <div className="py-1">
                        <Header />
                    </div>
                    <div className="container">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}


export default DashboardLayout;