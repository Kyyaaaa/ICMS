import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';

interface ProtectedRouteProps {
    allowedRoles: string[];
}

export const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const location = useLocation();
    const [authState, setAuthState] = useState<'loading' | 'authenticated' | 'expired' | 'unauthorized'>('loading');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            const token = Cookies.get('access_token');
            const userInfoStr = Cookies.get('user_info');

            // Không có token hoặc user_info → chưa đăng nhập
            if (!token || !userInfoStr) {
                setAuthState('expired');
                return;
            }

            // Parse role từ cookie trước
            let role: string;
            try {
                const userInfo = JSON.parse(userInfoStr);
                role = userInfo.role ? String(userInfo.role).toUpperCase() : '';
                setUserRole(role);
            } catch {
                // Cookie bị hỏng → xóa sạch
                Cookies.remove('access_token', { path: '/' });
                Cookies.remove('refresh_token', { path: '/' });
                Cookies.remove('user_info', { path: '/' });
                setAuthState('expired');
                return;
            }

            // Xác thực token với backend (gọi nhẹ 1 API bất kỳ cần auth)
            try {
                await axios.get('http://localhost:5000/api/auth/verify', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Token còn hợp lệ
                if (!allowedRoles.map(r => r.toUpperCase()).includes(role)) {
                    setAuthState('unauthorized');
                } else {
                    setAuthState('authenticated');
                }
            } catch (err: unknown) {
                const axiosErr = err as { response?: { status?: number } };
                if (axiosErr.response?.status === 401) {
                    // Token hết hạn → thử refresh
                    const refreshToken = Cookies.get('refresh_token');
                    if (refreshToken) {
                        try {
                            const refreshRes = await axios.post(
                                'http://localhost:5000/api/auth/refresh',
                                { refresh_token: refreshToken },
                                { headers: { 'Content-Type': 'application/json' } }
                            );
                            const newToken = refreshRes.data?.data?.access_token || refreshRes.data?.access_token;
                            const newRefresh = refreshRes.data?.data?.refresh_token || refreshRes.data?.refresh_token;
                            if (newToken) {
                                Cookies.set('access_token', newToken, { path: '/' });
                                if (newRefresh) {
                                    Cookies.set('refresh_token', newRefresh, { path: '/' });
                                }
                                if (!allowedRoles.map(r => r.toUpperCase()).includes(role)) {
                                    setAuthState('unauthorized');
                                } else {
                                    setAuthState('authenticated');
                                }
                                return;
                            }
                        } catch {
                            // Refresh cũng thất bại
                        }
                    }
                    // Không refresh được → session hết hạn
                    Cookies.remove('access_token', { path: '/' });
                    Cookies.remove('refresh_token', { path: '/' });
                    Cookies.remove('user_info', { path: '/' });
                    setAuthState('expired');
                } else {
                    // Lỗi khác (network, 500) → cho qua dựa trên cookie
                    if (!allowedRoles.map(r => r.toUpperCase()).includes(role)) {
                        setAuthState('unauthorized');
                    } else {
                        setAuthState('authenticated');
                    }
                }
            }
        };

        checkAuth();
    }, [allowedRoles, location.pathname]);

    // Loading state - hiện spinner thay vì flash nội dung
    if (authState === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f7fafc]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-[#0061a5] animate-spin" />
                    <p className="text-[#43474e] text-sm font-medium">Verifying session...</p>
                </div>
            </div>
        );
    }

    // Session hết hạn → redirect login kèm thông báo
    if (authState === 'expired') {
        return <Navigate to="/login" state={{ from: location, sessionExpired: true }} replace />;
    }

    // Đã login nhưng không đúng role → redirect về dashboard tương ứng
    if (authState === 'unauthorized') {
        switch (userRole) {
            case 'ADMIN': return <Navigate to="/admin/dashboard" replace />;
            case 'STAFF': return <Navigate to="/staff/dashboard" replace />;
            case 'TUTOR': return <Navigate to="/tutor/dashboard" replace />;
            case 'LEARNER': return <Navigate to="/learner/dashboard" replace />;
            default: return <Navigate to="/homepage" replace />;
        }
    }

    // Yêu cầu cập nhật profile nếu chưa đầy đủ thông tin
    let isProfileComplete = true;
    const userInfoStr = Cookies.get('user_info');
    if (userInfoStr && authState === 'authenticated') {
        try {
            const currentUserInfo = JSON.parse(userInfoStr);
            isProfileComplete = !!(currentUserInfo.phone_number && currentUserInfo.date_of_birth && currentUserInfo.gender);
        } catch (_e) {
            // Ignore parse error
        }
    }

    // Force redirect to profile page if incomplete
    if (authState === 'authenticated' && !isProfileComplete) {
        const profilePath = `/${userRole.toLowerCase()}/profile`;
        if (location.pathname !== profilePath) {
            return <Navigate to={profilePath} replace state={{ requireProfileUpdate: true }} />;
        }
    }

    return <Outlet />;
};
