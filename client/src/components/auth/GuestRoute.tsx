import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

export const GuestRoute = () => {
    const token = Cookies.get('access_token');
    const userInfoStr = Cookies.get('user_info');

    if (token && userInfoStr) {
        // Logged in, redirect to respective dashboard based on role
        try {
            const userInfo = JSON.parse(userInfoStr);
            const userRole = userInfo.role;

            switch (userRole) {
                case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
                case 'STAFF': return <Navigate to="/staff/dashboard" replace />;
                case 'TUTOR': return <Navigate to="/tutor/dashboard" replace />;
                case 'LEARNER': return <Navigate to="/learner/dashboard" replace />;
                default: return <Navigate to="/homepage" replace />;
            }
        } catch {
            // JSON parse error, allow them to view the page (which might be login)
            return <Outlet />;
        }
    }

    // Not logged in, render the child routes (e.g. login, register)
    return <Outlet />;
};
