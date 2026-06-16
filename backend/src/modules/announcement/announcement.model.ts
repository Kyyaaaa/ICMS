export type AudienceScope = 'System Wide' | 'Specific Roles' | 'Specific Classes';
export type Role = 'Admin' | 'Staff' | 'Tutor' | 'Learner';

export interface AnnouncementAudience {
    scope: AudienceScope;
    roles?: Role[];
    classes?: string[];
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    date: string;
    status: 'Published' | 'Scheduled';
    audience: AnnouncementAudience;
    scheduledFor?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateAnnouncementDTO {
    title: string;
    content: string;
    audience: AnnouncementAudience;
    scheduledFor?: string;
}

export interface UpdateAnnouncementDTO {
    id: string;
    title: string;
    content: string;
    audience: AnnouncementAudience;
    scheduledFor?: string;
}
