import type { ConsultationRequest } from '../types/consultation';

const MOCK_CONSULTATIONS: ConsultationRequest[] = [
    { id: 1, name: 'Alex Johnson', phone: '+1 234 567 890', email: 'alex.johnson@example.com', status: 'New', message: 'I need consultation for the IELTS beginner course. What is the schedule?', targetScore: 'IELTS 6.5', date: '20-10-2026', staffNote: '' },
    { id: 2, name: 'Sarah Connor', phone: '+1 987 654 321', email: 'sarah.c@example.com', status: 'Contacted', message: 'Could you please advise on evening classes for TOEIC preparation?', targetScore: 'TOEIC 700+', date: '21-10-2026', staffNote: 'Called on Oct 22, she will decide next week.' },
    { id: 3, name: 'Michael Smith', phone: '+1 555 123 456', email: 'msmith@example.com', status: 'Resolved', message: 'What is the tuition fee for the basic communication course?', targetScore: 'Basic Comm.', date: '22-10-2026', staffNote: 'Enrolled in Basic Comm. cohort 45.' },
];

export const ConsultationsService = {
    getConsultations: async (): Promise<ConsultationRequest[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_CONSULTATIONS]), 200));
    },

    updateConsultation: async (_updatedConsultation: ConsultationRequest): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 200));
    }
};
