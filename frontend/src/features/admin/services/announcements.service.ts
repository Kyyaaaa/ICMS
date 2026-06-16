import axiosClient from '@/shared/services/axiosClient';
import type { Announcement, CreateAnnouncementData, UpdateAnnouncementData } from '../types/announcement';

const API_URL = '/announcements';

export const AnnouncementsService = {
    getAnnouncements: async (): Promise<Announcement[]> => {
        try {
            const response: any = await axiosClient.get(API_URL);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching announcements:', error);
            return [];
        }
    },
    
    getNotifications: async (role: string): Promise<Announcement[]> => {
        try {
            const response: any = await axiosClient.get(`${API_URL}/notifications?role=${encodeURIComponent(role)}`);
            return response.data || [];
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    },

    createAnnouncement: async (data: CreateAnnouncementData): Promise<Announcement> => {
        try {
            const response: any = await axiosClient.post(API_URL, data);
            return response.data;
        } catch (error: any) {
            console.error('Error creating announcement:', error);
            const message = error.message || 'Failed to create announcement';
            throw new Error(message);
        }
    },

    updateAnnouncement: async (data: UpdateAnnouncementData): Promise<Announcement> => {
        try {
            const { id, ...updatePayload } = data;
            const response: any = await axiosClient.put(`${API_URL}/${id}`, updatePayload);
            return response.data;
        } catch (error: any) {
            console.error('Error updating announcement:', error);
            const message = error.message || 'Failed to update announcement';
            throw new Error(message);
        }
    },

    deleteAnnouncement: async (id: string): Promise<void> => {
        try {
            await axiosClient.delete(`${API_URL}/${id}`);
        } catch (error: any) {
            console.error('Error deleting announcement:', error);
            const message = error.message || 'Failed to delete announcement';
            throw new Error(message);
        }
    }
};
