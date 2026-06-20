import { supabaseAdmin } from '../../configs/supabase';
import { CreateAnnouncementDTO, UpdateAnnouncementDTO } from './announcement.model';

export class AnnouncementRepository {
    static async getAllAnnouncements() {
        const { data, error } = await supabaseAdmin
            .from('announcements')
            .select(`
                *,
                announcement_classes (
                    class_id
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    static async getNotificationsByRole(role: string, userId: string) {
        // Build an OR query based on the role
        // For example: scope.eq.System Wide OR (scope.eq.Specific Roles AND roles.cs.{Role}) OR (scope.eq.Specific Classes)
        let orQuery = `scope.eq.System Wide`;

        if (role) {
            orQuery += `,and(scope.eq.Specific Roles,roles.cs.{${role}})`;
            if (role === 'Learner' || role === 'Tutor') {
                let classIds: string[] = [];

                if (role === 'Learner') {
                    const { data: enrollments } = await supabaseAdmin
                        .from('enrollments')
                        .select('class_id')
                        .eq('learner_id', userId)
                        .eq('status', 'ACTIVE');
                    if (enrollments) {
                        classIds = enrollments.map(e => e.class_id);
                    }
                } else if (role === 'Tutor') {
                    const { data: tutorClasses } = await supabaseAdmin
                        .from('classes')
                        .select('id')
                        .eq('tutor_id', userId);
                    if (tutorClasses) {
                        classIds = tutorClasses.map(c => c.id);
                    }
                }

                if (classIds.length > 0) {
                    const { data: annClasses } = await supabaseAdmin
                        .from('announcement_classes')
                        .select('announcement_id')
                        .in('class_id', classIds);
                    
                    if (annClasses && annClasses.length > 0) {
                        const annIds = annClasses.map(a => a.announcement_id);
                        orQuery += `,and(scope.eq.Specific Classes,id.in.(${annIds.join(',')}))`;
                    }
                }
            }
        }

        const now = new Date().toISOString();

        const { data, error } = await supabaseAdmin
            .from('announcements')
            .select(`
                *,
                announcement_classes (
                    class_id
                )
            `)
            .or(orQuery)
            .or(`status.eq.Published,and(status.eq.Scheduled,scheduled_for.lte.${now})`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }

    static async createAnnouncement(dto: CreateAnnouncementDTO) {
        const isScheduled = !!dto.scheduledFor && new Date(dto.scheduledFor) > new Date();
        const status = isScheduled ? 'Scheduled' : 'Published';

        const annData = {
            title: dto.title,
            content: dto.content,
            scope: dto.audience.scope,
            roles: dto.audience.roles || [],
            scheduled_for: dto.scheduledFor || null,
            status: status
        };

        const { data: insertedData, error } = await supabaseAdmin
            .from('announcements')
            .insert(annData)
            .select()
            .single();

        if (error) throw error;

        let insertedClasses: any[] = [];
        if (dto.audience.scope === 'Specific Classes' && dto.audience.classes && dto.audience.classes.length > 0) {
            const classInserts = dto.audience.classes.map(cid => ({
                announcement_id: insertedData.id,
                class_id: cid
            }));
            const { data: cData, error: cError } = await supabaseAdmin
                .from('announcement_classes')
                .insert(classInserts)
                .select();
                
            if (cError) throw cError;
            insertedClasses = cData || [];
        }

        return { ...insertedData, announcement_classes: insertedClasses };
    }

    static async updateAnnouncement(dto: UpdateAnnouncementDTO) {
        const isScheduled = !!dto.scheduledFor && new Date(dto.scheduledFor) > new Date();
        const status = isScheduled ? 'Scheduled' : 'Published';

        const annData = {
            title: dto.title,
            content: dto.content,
            scope: dto.audience.scope,
            roles: dto.audience.roles || [],
            scheduled_for: dto.scheduledFor || null,
            status: status,
            updated_at: new Date().toISOString()
        };

        const { data: updatedData, error } = await supabaseAdmin
            .from('announcements')
            .update(annData)
            .eq('id', dto.id)
            .select()
            .single();

        if (error) throw error;

        // Delete old classes
        const { error: delError } = await supabaseAdmin
            .from('announcement_classes')
            .delete()
            .eq('announcement_id', dto.id);
        if (delError) throw delError;

        let insertedClasses: any[] = [];
        if (dto.audience.scope === 'Specific Classes' && dto.audience.classes && dto.audience.classes.length > 0) {
            const classInserts = dto.audience.classes.map(cid => ({
                announcement_id: dto.id,
                class_id: cid
            }));
            const { data: cData, error: cError } = await supabaseAdmin
                .from('announcement_classes')
                .insert(classInserts)
                .select();
                
            if (cError) throw cError;
            insertedClasses = cData || [];
        }

        return { ...updatedData, announcement_classes: insertedClasses };
    }

    static async deleteAnnouncement(id: string) {
        const { error: delError } = await supabaseAdmin
            .from('announcement_classes')
            .delete()
            .eq('announcement_id', id);
        if (delError) throw delError;

        const { error } = await supabaseAdmin
            .from('announcements')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
}
