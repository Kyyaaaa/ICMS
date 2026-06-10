import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const token = Cookies.get('access_token');
    const userInfoStr = Cookies.get('user_info');
    const location = useLocation();

    if (!token || !userInfoStr) {
        // Not logged in
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    let userRole = '';
    try {
        const userInfo = JSON.parse(userInfoStr);
        userRole = userInfo.role;
    } catch {
        return <Navigate to="/login" replace />;
    }

    if (userRole) {
        userRole = userRole.toUpperCase();
    }

    const upperAllowedRoles = allowedRoles.map(r => r.toUpperCase());

    if (!upperAllowedRoles.includes(userRole)) {
        // Logged in but unauthorized for this specific role route.
        // Redirect to their corresponding dashboard.
        switch (userRole) {
            case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
            case 'STAFF': return <Navigate to="/staff/dashboard" replace />;
            case 'TUTOR': return <Navigate to="/tutor/dashboard" replace />;
            case 'LEARNER': return <Navigate to="/learner/dashboard" replace />;
            default: return <Navigate to="/homepage" replace />;
        }
    }

    return <Outlet />;
};
