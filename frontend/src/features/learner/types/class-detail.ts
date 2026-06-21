export interface CurriculumSession {
    sessionNumber: number;
    title: string;
    description: string;
    status: 'completed' | 'ongoing' | 'upcoming';
}

export interface ClassDetailData {
    id: string;
    courseId?: string;
    courseName: string;
    status: 'Ongoing' | 'Completed';
    description: string;
    schedule: string;
    time: string;
    classroom: string;
    totalSessions: number;
    tutor: {
        id?: string;
        name: string;
        title: string;
        rating: number | null;
        reviewCount: number;
        initials: string;
    };
    progress: {
        completed: number;
        percentage: number;
    };
    curriculum: CurriculumSession[];
}
