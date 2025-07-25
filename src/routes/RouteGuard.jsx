import { Navigate } from 'react-router';

const RouteGuard = ({ component: Component, isProtected }) => {
    const isAuthenticated = true; // Replace with your authentication logic

    if (isProtected && !isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return <Component />;
};

export default RouteGuard;