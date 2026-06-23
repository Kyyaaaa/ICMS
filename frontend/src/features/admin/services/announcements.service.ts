import axiosClient from '@/shared/services/axiosClient';
import type { Announcement, CreateAnnouncementData, UpdateAnnouncementData } from '../types/announcement';

const API_URL = '/announcements';

export const AnnouncementsService = {
    getAnnouncements: async (): Promise<Announcement[]> => {
        try {
            const response = await axiosClient.get(API_URL) as { data: Announcement[] };
            return response.data || [];
        } catch (error) {
            console.error('Error fetching announcements:', error);
            return [];
        }
    },
    
    getNotifications: async (role: string): Promise<Announcement[]> => {
        try {
            const endpoint = role === 'Guest' ? `${API_URL}/public/notifications` : `${API_URL}/notifications?role=${encodeURIComponent(role)}`;
            const response = await axiosClient.get(endpoint) as { data: Announcement[] } | Announcement[];
            return Array.isArray(response) ? response : (response.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    },

    createAnnouncement: async (data: CreateAnnouncementData): Promise<Announcement> => {
        try {
            const response = await axiosClient.post(API_URL, data) as { data: Announcement };
            return response.data;
        } catch (error: unknown) {
            console.error('Error creating announcement:', error);
            const message = (error as Error).message || 'Failed to create announcement';
            throw new Error(message, { cause: error });
        }
    },

    updateAnnouncement: async (data: UpdateAnnouncementData): Promise<Announcement> => {
        try {
            const { id, ...updatePayload } = data;
            const response = await axiosClient.put(`${API_URL}/${id}`, updatePayload) as { data: Announcement };
            return response.data;
        } catch (error: unknown) {
            console.error('Error updating announcement:', error);
            const message = (error as Error).message || 'Failed to update announcement';
            throw new Error(message, { cause: error });
        }
    },

    deleteAnnouncement: async (id: string): Promise<void> => {
        try {
            await axiosClient.delete(`${API_URL}/${id}`);
        } catch (error: unknown) {
            console.error('Error deleting announcement:', error);
            const message = (error as Error).message || 'Failed to delete announcement';
            throw new Error(message, { cause: error });
        }
    }
};
