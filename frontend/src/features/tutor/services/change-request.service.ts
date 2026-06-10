import type { TutorChangeRequest, CreateChangeRequestData } from '../types/change-request';

const MOCK_REQUESTS: TutorChangeRequest[] = [
    { 
        id: 1, 
        className: 'IELTS-A01', 
        session: 5,
        type: 'Reschedule', 
        originalTime: '10-10-2026 (18:00 - 20:00)', 
        proposedTime: '11-10-2026 (18:00 - 20:00)', 
        reason: 'Personal emergency, need to move the class to the next day.',
        status: 'Pending', 
        submittedAt: '05-10-2026',
        staffNote: '',
        finalTime: ''
    },
    { 
        id: 4, 
        className: 'IELTS-A01', 
        session: 12,
        type: 'Reschedule', 
        originalTime: '20-10-2026 (18:00 - 20:00)', 
        proposedTime: null, 
        reason: 'I am sick, please reschedule this session for me but I am not sure when I can teach yet.',
        status: 'Pending', 
        submittedAt: '18-10-2026',
        staffNote: '',
        finalTime: ''
    },
    { 
        id: 3, 
        className: 'IELTS-A02', 
        session: 8,
        type: 'Reschedule', 
        originalTime: '15-10-2026 (18:00 - 20:00)', 
        proposedTime: '16-10-2026 (18:00 - 20:00)', 
        reason: 'Conflict with another schedule.',
        status: 'Approved', 
        submittedAt: '01-10-2026',
        staffNote: 'Rescheduled as requested.',
        finalTime: '16-10-2026 (18:00 - 20:00) • Room 102'
    },
];

export const ChangeRequestService = {
    getRequests: async (): Promise<TutorChangeRequest[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_REQUESTS), 200));
    },
    createRequest: async (data: CreateChangeRequestData): Promise<TutorChangeRequest> => {
        return new Promise(resolve => setTimeout(() => {
            const newReq: TutorChangeRequest = {
                id: Date.now(),
                className: data.className,
                session: data.session,
                type: data.type,
                originalTime: 'TBD',
                proposedTime: data.proposedTime,
                reason: data.reason,
                status: 'Pending',
                submittedAt: new Date().toLocaleDateString('en-GB').replace(/\//g, '-'),
                staffNote: '',
                finalTime: ''
            };
            resolve(newReq);
        }, 200));
    }
};
