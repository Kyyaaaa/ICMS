import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '@/config/api';

const API_URL = API_BASE_URL;

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
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching tutor ratings:', error.response?.data || error);
                throw new Error(error.response?.data?.message || 'Failed to fetch tutor ratings', { cause: error });
            }
            throw new Error('Failed to fetch tutor ratings', { cause: error });
        }
    },

    getTutorReviewDetail: async (tutorId: string) => {
        try {
            const response = await axios.get(`${API_URL}/admin/reviews/tutors/${tutorId}`, { headers: getHeaders() });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error('Error fetching tutor review details:', error.response?.data || error);
                throw new Error(error.response?.data?.message || 'Failed to fetch tutor review details', { cause: error });
            }
            throw new Error('Failed to fetch tutor review details', { cause: error });
        }
    }
};
