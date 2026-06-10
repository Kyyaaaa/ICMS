import type { TutorProfile } from '../types/profile';

const MOCK_PROFILES: TutorProfile[] = [
    { id: 1, name: 'Dr. Sarah Connor', subject: 'IELTS / TOEFL', date: '24-10-2026', status: 'Pending', avatar_url: '' },
    { id: 2, name: 'Mr. James Bond', subject: 'Advanced Communication', date: '23-10-2026', status: 'Verified', avatar_url: '' },
    { id: 3, name: 'Ms. Emily Blunt', subject: 'Basic English', date: '20-10-2026', status: 'Pending', avatar_url: '' },
];

export const ProfilesService = {
    getProfiles: async (): Promise<TutorProfile[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_PROFILES]), 200));
    },
    getProfileById: async (id: number): Promise<TutorProfile | undefined> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_PROFILES.find(p => p.id === id)), 200));
    }
};

