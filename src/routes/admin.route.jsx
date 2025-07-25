import AdminDashboard from "../pages/adminPage/AdminDashboard";
import Dashboard from "../pages/adminPage/Dashboard";
import NewAdminDashboard from "../pages/adminPage/NewAdminDashboard";

const adminRoute = [
    {
        path: '/superuser',
        component: AdminDashboard,
        isProtected: true
    },
    {
        path: '/admin',
        component: NewAdminDashboard,
        isProtected: true
    },
    {
        path: '/admin/debar',
        component: Dashboard,
        isProtected: true
    }
]

export default adminRoute;