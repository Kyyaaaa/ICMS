import type { Announcement, CreateAnnouncementData, UpdateAnnouncementData } from '../types/announcement';

const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: '1',
        title: 'Scheduled Maintenance',
        content: 'The ICMS platform will undergo scheduled maintenance this Sunday from 2:00 AM to 4:00 AM EST. Access may be temporarily unavailable. Please save your work.',
        date: '25-10-2026',
        status: 'Published',
        audience: { scope: 'System Wide', roles: [], classes: [] }
    },
    {
        id: '4',
        title: 'Upcoming System Upgrade',
        content: 'We will be deploying new features next week. Please review the changelog sent to your email.',
        date: '01-11-2026',
        status: 'Scheduled',
        scheduledFor: '2026-11-01T08:00',
        audience: { scope: 'System Wide', roles: [], classes: [] }
    },
    {
        id: '2',
        title: 'New Exam Format for Math 101',
        content: 'Please be informed that the midterm exam format for Math 101 has been updated. Check the course syllabus for more details.',
        date: '24-10-2026',
        status: 'Published',
        audience: { scope: 'Specific Classes', roles: [], classes: ['c1'] }
    },
    {
        id: '3',
        title: 'Staff Meeting Reminder',
        content: 'Monthly all-hands staff meeting will take place tomorrow at 9:00 AM in the Main Conference Room. Attendance is mandatory.',
        date: '22-10-2026',
        status: 'Published',
        audience: { scope: 'Specific Roles', roles: ['Staff', 'Admin'], classes: [] }
    }
];

export const AnnouncementsService = {
    getAnnouncements: async (): Promise<Announcement[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_ANNOUNCEMENTS), 200));
    },
    
    createAnnouncement: async (data: CreateAnnouncementData): Promise<Announcement> => {
        return new Promise(resolve => setTimeout(() => {
            const newAnn: Announcement = {
                id: Date.now().toString(),
                ...data,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: data.scheduledFor ? 'Scheduled' : 'Published'
            };
            resolve(newAnn);
        }, 200));
    },

    updateAnnouncement: async (data: UpdateAnnouncementData): Promise<Announcement> => {
        return new Promise(resolve => setTimeout(() => {
            const updatedAnn: Announcement = {
                id: data.id,
                title: data.title,
                content: data.content,
                audience: data.audience,
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                status: data.scheduledFor ? 'Scheduled' : 'Published',
                scheduledFor: data.scheduledFor
            };
            resolve(updatedAnn);
        }, 200));
    },

    deleteAnnouncement: async (_id: string): Promise<void> => {
        return new Promise(resolve => setTimeout(() => resolve(), 200));
    }
};
