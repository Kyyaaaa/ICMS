import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

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

// Interceptor cho Response: Xử lý lỗi toàn cục
axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            // Trả về thẳng data để khỏi phải res.data.data
            return response.data;
        }
        return response;
    },
    (error) => {
        // Xử lý chung các lỗi mạng hoặc lỗi HTTP
        if (error.response) {
            const status = error.response.status;
            // 401 Unauthorized: Token hết hạn hoặc chưa đăng nhập
            if (status === 401) {
                Cookies.remove('access_token');
                Cookies.remove('user_role');
                Cookies.remove('user_email');
                // Chỉ redirect nếu không phải đang ở trang login
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        
        // Trả về lỗi để nơi gọi API tự catch nếu cần thiết
        return Promise.reject(error.response?.data || error);
    }
);

export default axiosClient;
