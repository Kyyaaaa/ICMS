import type { ChangeRequest } from '../types/change-request';

const MOCK_REQUESTS: ChangeRequest[] = [
    { 
        id: 1, 
        tutor: 'Dr. Sarah Connor', 
        className: 'IELTS-A01', 
        session: 5,
        type: 'Reschedule', 
        originalTime: '10-10-2026 (18:00 - 20:00)', 
        proposedTime: '11-10-2026 (18:00 - 20:00)', 
        reason: 'Personal emergency, need to move the class to the next day.',
        status: 'Pending', 
        submittedAt: '05-10-2026' 
    },
    { 
        id: 2, 
        tutor: 'Mr. James Bond', 
        className: 'TOEIC-B01', 
        session: 2,
        type: 'Substitute', 
        originalTime: '12-10-2026 (19:00 - 21:00)', 
        proposedTime: null, 
        reason: 'Attending a conference, please find a substitute for this session.',
        status: 'Pending', 
        submittedAt: '06-10-2026' 
    },
    { 
        id: 3, 
        tutor: 'Ms. Emily Blunt', 
        className: 'IELTS-A02', 
        session: 8,
        type: 'Reschedule', 
        originalTime: '15-10-2026 (18:00 - 20:00)', 
        proposedTime: '16-10-2026 (18:00 - 20:00)', 
        reason: 'Conflict with another schedule.',
        status: 'Approved', 
        submittedAt: '01-10-2026' 
    },
    { 
        id: 4, 
        tutor: 'Dr. Sarah Connor', 
        className: 'IELTS-A01', 
        session: 12,
        type: 'Reschedule', 
        originalTime: '20-10-2026 (18:00 - 20:00)', 
        proposedTime: null, 
        reason: 'I am sick, please reschedule this session for me but I am not sure when I can teach yet.',
        status: 'Pending', 
        submittedAt: '18-10-2026' 
    },
];

export const ChangeRequestsService = {
    getRequests: async (): Promise<ChangeRequest[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_REQUESTS]), 200));
    },

    updateRequest: async (_updatedRequest: ChangeRequest): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 200));
    }
};
