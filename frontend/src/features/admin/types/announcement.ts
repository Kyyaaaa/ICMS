export type Role = 'Admin' | 'Staff' | 'Tutor' | 'Learner';
export type AudienceScope = 'System Wide' | 'Specific Roles' | 'Specific Classes' | 'Specific Users';

export type TargetAudience = {
    scope: AudienceScope;
    roles: Role[];
    classes: string[];
    users?: string[];
    userNames?: string[];
};

export type AnnouncementStatus = 'Published' | 'Scheduled';

export type Announcement = {
    id: string;
    title: string;
    content: string;
    date: string;
    audience: TargetAudience;
    status: AnnouncementStatus;
    scheduledFor?: string;
};

export interface CreateAnnouncementData {
    title: string;
    content: string;
    audience: TargetAudience;
    scheduledFor?: string;
}

export interface UpdateAnnouncementData extends CreateAnnouncementData {
    id: string;
}
