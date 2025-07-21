import AdminDashboard from "../pages/adminPage/AdminDashboard";

const adminRoute = [
    {
        path: '/superuser',
        component: AdminDashboard,
        isProtedted: true
    }
]

export default adminRoute;