import axios from 'axios';
import Cookies from 'js-cookie';
import { showAlertModal } from '@/utils/modal';
import { API_BASE_URL, apiUrl } from '@/config/api';

const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Cơ chế Auto-Refresh Token ---
// Biến cờ để tránh gọi refresh nhiều lần cùng lúc
let isRefreshing = false;
// Hàng đợi các request bị 401 trong khi đang refresh
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
};

/**
 * Xóa sạch toàn bộ cookie phiên đăng nhập và redirect về login
 */
const forceLogout = () => {
    Cookies.remove('access_token', { path: '/' });
    Cookies.remove('refresh_token', { path: '/' });
    Cookies.remove('user_info', { path: '/' });
    Cookies.remove('user_role', { path: '/' });
    Cookies.remove('user_email', { path: '/' });
    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

// Interceptor cho Request: Tự động đính kèm Token
axiosClient.interceptors.request.use(
    (config) => {
        const token = Cookies.get('access_token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor cho Response: Auto-refresh khi 401, logout khi refresh thất bại
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            // Trả về thẳng data để khỏi phải res.data.data
            return response.data;
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Chỉ xử lý 401 (token hết hạn)
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Nếu request bị 401 là chính request refresh → dừng, force logout
            if (originalRequest.url?.includes('/auth/refresh')) {
                forceLogout();
                return Promise.reject(error);
            }

            // Nếu đang có 1 lượt refresh chạy rồi → xếp hàng đợi
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return axiosClient(originalRequest);
                }).catch((err) => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = Cookies.get('refresh_token');

            // Không có refresh token → logout ngay
            if (!refreshToken) {
                isRefreshing = false;
                forceLogout();
                return Promise.reject(error);
            }

            try {
                // Gọi API refresh token (dùng axios thường, không qua interceptor)
                const response = await axios.post(
                    apiUrl('/auth/refresh'),
                    { refresh_token: refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const newAccessToken = response.data?.data?.access_token
                    || response.data?.access_token;
                const newRefreshToken = response.data?.data?.refresh_token
                    || response.data?.refresh_token;

                if (!newAccessToken) {
                    throw new Error('No access token in refresh response');
                }

                // Cập nhật cookie với token mới
                const cookieOptions: Cookies.CookieAttributes = { path: '/' };
                
                Cookies.set('access_token', newAccessToken, cookieOptions);
                if (newRefreshToken) {
                    Cookies.set('refresh_token', newRefreshToken, cookieOptions);
                }

                isRefreshing = false;
                processQueue(null, newAccessToken);

                // Retry request gốc với token mới
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return axiosClient(originalRequest);

            } catch (refreshError) {
                // Refresh thất bại → session thực sự hết hạn → logout
                isRefreshing = false;
                processQueue(refreshError, null);
                forceLogout();
                return Promise.reject(refreshError);
            }
        }

        // Bắt lỗi 403: Tài khoản bị khóa (Banned)
        if (error.response?.status === 403 && error.response?.data?.message === 'Account is deactivated') {
            showAlertModal('Account Locked', 'Your account has been deactivated. Please contact Admin for more details.', 'error').then(() => {
                forceLogout();
            });
            return Promise.reject(error);
        }

        // --- Bắt đầu: Global Error Handling ---
        const errorData = error.response?.data || error;
        const errorMessage = errorData?.message || error.message || 'Lỗi hệ thống không xác định';
        
        // Tự động hiển thị Modal nếu là lỗi Server (500) hoặc rớt mạng (Network Error)
        if (!error.response || error.response?.status >= 500) {
            console.warn(`[Global Interceptor] Server/Network Error: ${errorMessage}`);
            showAlertModal('System Error', 'An unexpected error occurred: ' + errorMessage, 'error');
        }
        // --- Kết thúc ---

        return Promise.reject(errorData);
    }
);

export default axiosClient;
