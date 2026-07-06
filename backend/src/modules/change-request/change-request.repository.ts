import { supabaseAdmin } from '../../configs/supabase';
import { CreateChangeRequestDTO, UpdateChangeRequestStatusDTO } from './change-request.model';
import { AnnouncementRepository } from '../announcement/announcement.repository';
import pool from '../../configs/database';

export class ChangeRequestRepository {
    async getSessionOwnership(sessionId: string) {
        const { data, error } = await supabaseAdmin
            .from('class_sessions')
            .select('id, class_id, tutor_id, date')
            .eq('id', sessionId)
            .single();
        if (error) throw error;
        return data;
    }

    async getLearnerConflictClass(classId: string, date: string, slot: string, sessionId: string): Promise<string | null> {
        const { data: enrollments } = await supabaseAdmin
            .from('enrollments')
            .select('learner_id')
            .eq('class_id', classId)
            .eq('status', 'ACTIVE');
        
        if (enrollments && enrollments.length > 0) {
            const learnerIds = enrollments.map(e => e.learner_id);
            const { data: otherEnrollments } = await supabaseAdmin
                .from('enrollments')
                .select('class_id')
                .in('learner_id', learnerIds)
                .eq('status', 'ACTIVE');
            
            if (otherEnrollments && otherEnrollments.length > 0) {
                const otherClassIds = [...new Set(otherEnrollments.map(e => e.class_id))];
                const { data: conflictingSessions } = await supabaseAdmin
                    .from('class_sessions')
                    .select('class_id, classes(name)')
                    .eq('date', date)
                    .eq('slot', slot)
                    .in('class_id', otherClassIds)
                    .neq('id', sessionId);
                
                if (conflictingSessions && conflictingSessions.length > 0) {
                    return (conflictingSessions[0] as any).classes?.name || 'another class';
                }
            }
        }
        return null;
    }

    async getAvailableRooms(occupiedRoomIds: string[]): Promise<any[]> {
        const { data: allRooms } = await supabaseAdmin
            .from('classroom')
            .select('id, room_name, capacity')
            .eq('status', 'AVAILABLE');
        
        return (allRooms || []).filter(r => !occupiedRoomIds.includes(r.id));
    }

    async hasPendingRequestForSession(sessionId: string): Promise<boolean> {
        const { data: existing } = await supabaseAdmin
            .from('change_requests')
            .select('id')
            .eq('session_id', sessionId)
            .eq('status', 'Pending')
            .limit(1);
        return existing && existing.length > 0 ? true : false;
    }

    async getSessionDate(sessionId: string): Promise<string | null> {
        const { data: sessionInfo } = await supabaseAdmin
            .from('class_sessions')
            .select('date')
            .eq('id', sessionId)
            .single();
        return sessionInfo ? sessionInfo.date : null;
    }

    async findAll() {
        const { data, error } = await supabaseAdmin
            .from('change_requests')
            .select(`
                *,
                tutor:account!tutor_id (
                    full_name
                ),
                class:classes!class_id (
                    name,
                    classroom_id,
                    course:courses (
                        title
                    )
                ),
                session:class_sessions!session_id (
                    session_number,
                    classroom_id
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching change requests:', error);
            throw error;
        }

        return data;
    }

    async findByTutorId(tutorId: string) {
        const { data, error } = await supabaseAdmin
            .from('change_requests')
            .select(`
                *,
                tutor:account!tutor_id (
                    full_name
                ),
                class:classes!class_id (
                    name,
                    classroom_id,
                    course:courses (
                        title
                    )
                ),
                session:class_sessions!session_id (
                    session_number,
                    classroom_id
                )
            `)
            .eq('tutor_id', tutorId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tutor change requests:', error);
            throw error;
        }

        return data;
    }

    async create(createData: CreateChangeRequestDTO) {
        const { data, error } = await supabaseAdmin
            .from('change_requests')
            .insert(createData)
            .select()
            .single();

        if (error) {
            console.error('Error creating change request:', error);
            throw error;
        }

        return data;
    }

    async updateStatus(id: string, updateData: UpdateChangeRequestStatusDTO) {
        const { new_date, new_slot, new_room_id, substitute_tutor_id, ...crUpdateData } = updateData;
        if (!['Approved', 'Rejected'].includes(crUpdateData.status)) {
            throw new Error('Invalid change request status');
        }

        const client = await pool.connect();
        let data: any;
        try {
            await client.query('BEGIN');
            const requestResult = await client.query(
                'SELECT * FROM change_requests WHERE id = $1 FOR UPDATE',
                [id]
            );
            const currentRequest = requestResult.rows[0];
            if (!currentRequest) throw new Error('Change request not found');
            if (currentRequest.status !== 'Pending') {
                throw new Error(`Change request is already ${currentRequest.status}`);
            }

            if (crUpdateData.status === 'Approved' && currentRequest.session_id) {
            const sessionUpdatePayload: any = {};
            const typeStr = currentRequest.type?.toLowerCase();
            
            if ((typeStr === 'substitute tutor' || typeStr === 'substitute') && substitute_tutor_id) {
                sessionUpdatePayload.tutor_id = substitute_tutor_id;
            } else if (typeStr === 'reschedule' || typeStr === 'change room') {
                if (currentRequest.proposed_date && currentRequest.proposed_slot && currentRequest.proposed_room_id) {
                    sessionUpdatePayload.date = currentRequest.proposed_date;
                    sessionUpdatePayload.slot = currentRequest.proposed_slot;
                    sessionUpdatePayload.classroom_id = currentRequest.proposed_room_id;
                } else if (new_date && new_slot && new_room_id) {
                    sessionUpdatePayload.date = new_date;
                    sessionUpdatePayload.slot = new_slot;
                    sessionUpdatePayload.classroom_id = new_room_id;
                }
            }

            if (Object.keys(sessionUpdatePayload).length > 0) {
                const sessionResult = await client.query(
                    'SELECT date, slot, tutor_id, classroom_id FROM class_sessions WHERE id = $1 FOR UPDATE',
                    [currentRequest.session_id]
                );
                const originalSession = sessionResult.rows[0];
                if (!originalSession) throw new Error('Class session not found');
                     
                const finalDate = sessionUpdatePayload.date || originalSession?.date;
                const finalSlot = sessionUpdatePayload.slot || originalSession?.slot;
                const finalTutorId = sessionUpdatePayload.tutor_id || originalSession?.tutor_id;
                const finalRoomId = sessionUpdatePayload.classroom_id || originalSession?.classroom_id;

                // 1. Check Tutor Conflict
                const tutorConflicts = await client.query(
                    `SELECT id FROM class_sessions
                     WHERE tutor_id = $1 AND date = $2 AND slot = $3 AND id <> $4
                     LIMIT 1`,
                    [finalTutorId, finalDate, finalSlot, currentRequest.session_id]
                );
                    
                if (tutorConflicts.rows.length > 0) {
                    throw new Error('Approval failed: The assigned tutor is no longer available at this time slot.');
                }

                const roomConflicts = await client.query(
                    `SELECT id FROM class_sessions
                     WHERE classroom_id = $1 AND date = $2 AND slot = $3 AND id <> $4
                     LIMIT 1`,
                    [finalRoomId, finalDate, finalSlot, currentRequest.session_id]
                );
                    
                if (roomConflicts.rows.length > 0) {
                    throw new Error('Approval failed: The selected classroom is no longer available at this time slot.');
                }

                await client.query(
                    `UPDATE class_sessions
                     SET date = $1, slot = $2, tutor_id = $3, classroom_id = $4
                     WHERE id = $5`,
                    [finalDate, finalSlot, finalTutorId, finalRoomId, currentRequest.session_id]
                );
            }
            }

            const updateResult = await client.query(
                `UPDATE change_requests
                 SET status = $1, staff_note = $2, final_time = $3, updated_at = NOW()
                 WHERE id = $4
                 RETURNING *`,
                [crUpdateData.status, crUpdateData.staff_note || null, crUpdateData.final_time || null, id]
            );
            data = updateResult.rows[0];
            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }

        if (crUpdateData.status === 'Approved' && data.session_id) {
            // Trigger Notifications
            const { data: classInfo } = await supabaseAdmin
                .from('classes')
                .select('name, courses(title)')
                .eq('id', data.class_id)
                .single();
            
            const courseTitle = (classInfo?.courses as any)?.title || 'Unknown Course';
            const className = classInfo?.name || 'Unknown Class';
            const fullClassName = `${courseTitle} - ${className}`;
            const finalArranged = crUpdateData.final_time || data.final_time || 'TBD';

            try {
                // 1. Notify original tutor
                await AnnouncementRepository.createAnnouncement({
                    title: `Change Request Approved: ${fullClassName}`,
                    content: `Your change request for ${fullClassName} has been approved. Details: ${finalArranged}`,
                    audience: { scope: 'Specific Users', users: [data.tutor_id] }
                });

                // 2. Notify substitute if applicable
                if (substitute_tutor_id) {
                    await AnnouncementRepository.createAnnouncement({
                        title: `Substitute Assignment: ${fullClassName}`,
                        content: `You have been assigned to substitute for ${fullClassName}. Details: ${finalArranged}`,
                        audience: { scope: 'Specific Users', users: [substitute_tutor_id] }
                    });
                }

                // 3. Notify learners
                await AnnouncementRepository.createAnnouncement({
                    title: `Schedule Update: ${fullClassName}`,
                    content: `The schedule for ${fullClassName} has been updated. New details: ${finalArranged}`,
                    audience: { scope: 'Specific Classes', classes: [data.class_id] }
                });
            } catch (annError) {
                console.error('Failed to send change request notifications:', annError);
            }
        }

        return data;
    }
}
