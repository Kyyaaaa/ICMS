import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = Cookies.get('access_token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const AdminReviewService = {
    getTutorRatings: async () => {
        try {
            const response = await axios.get(`${API_URL}/admin/reviews/tutors`, { headers: getHeaders() });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching tutor ratings:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Failed to fetch tutor ratings');
        }
    },

    getTutorReviewDetail: async (tutorId: string) => {
        try {
            const response = await axios.get(`${API_URL}/admin/reviews/tutors/${tutorId}`, { headers: getHeaders() });
            return response.data;
        } catch (error: any) {
            console.error('Error fetching tutor review details:', error.response?.data || error);
            throw new Error(error.response?.data?.message || 'Failed to fetch tutor review details');
        }
    }
};
