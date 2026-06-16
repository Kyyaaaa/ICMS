import { AnnouncementRepository } from './announcement.repository';
import { CreateAnnouncementDTO, UpdateAnnouncementDTO } from './announcement.model';

export class AnnouncementService {
    static async getAnnouncements() {
        const rawData = await AnnouncementRepository.getAllAnnouncements();
        return rawData.map(this.mapToFrontend);
    }

    static async getNotificationsByRole(role: string) {
        if (!role) throw new Error("Role is required");
        const rawData = await AnnouncementRepository.getNotificationsByRole(role);
        return rawData.map(this.mapToFrontend);
    }

    static async createAnnouncement(dto: CreateAnnouncementDTO) {
        if (!dto.title || !dto.content) {
            throw new Error("Title and content are required");
        }
        if (!dto.audience || !dto.audience.scope) {
            throw new Error("Audience scope is required");
        }

        const newAnn = await AnnouncementRepository.createAnnouncement(dto);
        return this.mapToFrontend(newAnn);
    }

    static async updateAnnouncement(id: string, dto: UpdateAnnouncementDTO) {
        if (!id) throw new Error("ID is required");
        if (!dto.title || !dto.content) throw new Error("Title and content are required");
        
        dto.id = id;
        const updatedAnn = await AnnouncementRepository.updateAnnouncement(dto);
        return this.mapToFrontend(updatedAnn);
    }

    static async deleteAnnouncement(id: string) {
        if (!id) throw new Error("ID is required");
        return await AnnouncementRepository.deleteAnnouncement(id);
    }

    private static mapToFrontend(backendData: any) {
        return {
            id: backendData.id,
            title: backendData.title,
            content: backendData.content,
            date: backendData.created_at ? new Date(backendData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Unknown',
            status: backendData.status,
            audience: {
                scope: backendData.scope,
                roles: backendData.roles || [],
                classes: backendData.announcement_classes ? backendData.announcement_classes.map((c: any) => c.class_id) : []
            },
            scheduledFor: backendData.scheduled_for || undefined,
            created_at: backendData.created_at,
            updated_at: backendData.updated_at
        };
    }
}
