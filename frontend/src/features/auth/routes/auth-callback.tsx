import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Cookies from 'js-cookie';
import { apiUrl } from '@/config/api';

const AuthCallback = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState('Authenticating account...');

    useEffect(() => {
        const syncUser = async () => {
            try {
                // 1. Parse token từ dấu # trên URL
                const hash = window.location.hash;
                if (!hash) {
                    setStatus('Error: Token not found. Redirecting to login...');
                    setTimeout(() => navigate('/login?error=NoHash'), 2000);
                    return;
                }

                const params = new URLSearchParams(hash.replace('#', ''));
                const accessToken = params.get('access_token');
                const refreshToken = params.get('refresh_token');

                if (!accessToken) {
                    setStatus('Error: Invalid token. Redirecting to login...');
                    setTimeout(() => navigate('/login?error=InvalidToken'), 2000);
                    return;
                }

                setStatus('Synchronizing data...');

                // 2. Gửi token ngầm qua POST Body xuống Backend (Bảo mật tuyệt đối)
                const res = await fetch(apiUrl('/auth/google-sync'), {
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
                    throw new Error(data.message || 'Synchronization failed');
                }

                // 3. Backend trả về thông tin an toàn, Frontend lưu Cookie
                Cookies.set('access_token', data.data.access_token, { path: '/' });
                Cookies.set('user_info', JSON.stringify(data.data.user), { path: '/' });
                if (data.data.refresh_token) {
                    Cookies.set('refresh_token', data.data.refresh_token, { path: '/' });
                }

                // 4. Chuyển hướng vào nhà
                setStatus('Success! Redirecting...');
                navigate('/homepage');

            } catch (error) {
                console.error('Callback Error:', error);
                setStatus('A synchronization error occurred. Redirecting to login...');
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
