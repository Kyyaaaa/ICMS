import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Đang xác thực tài khoản...');

    useEffect(() => {
        const syncUser = async () => {
            try {
                // 1. Parse token từ dấu # trên URL
                const hash = window.location.hash;
                if (!hash) {
                    setStatus('Lỗi: Không tìm thấy Token. Đang quay lại trang đăng nhập...');
                    setTimeout(() => navigate('/login?error=NoHash'), 2000);
                    return;
                }

                const params = new URLSearchParams(hash.replace('#', ''));
                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');

                if (!accessToken) {
                    setStatus('Lỗi: Token không hợp lệ. Đang quay lại trang đăng nhập...');
                    setTimeout(() => navigate('/login?error=InvalidToken'), 2000);
                    return;
                }

                setStatus('Đang đồng bộ dữ liệu...');

                // 2. Gửi token ngầm qua POST Body xuống Backend (Bảo mật tuyệt đối)
                const res = await fetch('http://localhost:5000/api/auth/google-sync', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        access_token: accessToken,
                        refresh_token: refreshToken
                    })
                });

                const data = await res.json();

                if (!res.ok || !data.success) {
                    throw new Error(data.message || 'Đồng bộ thất bại');
                }

                // 3. Backend trả về thông tin an toàn, Frontend lưu Cookie
                Cookies.set('access_token', data.data.access_token, { path: '/' });
                Cookies.set('user_info', JSON.stringify(data.data.user), { path: '/' });
                if (data.data.refresh_token) {
                    Cookies.set('refresh_token', data.data.refresh_token, { path: '/' });
                }

                // 4. Chuyển hướng vào nhà
                setStatus('Thành công! Đang chuyển hướng...');
                navigate('/homepage');

            } catch (error) {
                console.error('Lỗi Callback:', error);
                setStatus('Đã xảy ra lỗi đồng bộ. Đang quay lại trang đăng nhập...');
                setTimeout(() => navigate('/login?error=SyncFailed'), 3000);
            }
        };

        syncUser();
    }, [navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-800">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-medium">{status}</h2>
        </div>
    );
};

export default AuthCallback;
