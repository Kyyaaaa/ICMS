export interface TutorProfile {
    id: number;
    name: string;
    subject: string;
    date: string;
    status: 'Pending' | 'Verified';
    avatar_url: string;
}
