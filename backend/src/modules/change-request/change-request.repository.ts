import { supabaseAdmin } from '../../configs/supabase';
import { CreateChangeRequestDTO, UpdateChangeRequestStatusDTO } from './change-request.model';
import { AnnouncementRepository } from '../announcement/announcement.repository';

export class ChangeRequestRepository {
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

        const { data, error } = await supabaseAdmin
            .from('change_requests')
            .update(crUpdateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating change request:', error);
            throw error;
        }

        if (crUpdateData.status === 'Approved' && data.session_id) {
            const sessionUpdatePayload: any = {};
            const typeStr = data.type?.toLowerCase();
            
            if ((typeStr === 'substitute tutor' || typeStr === 'substitute') && substitute_tutor_id) {
                sessionUpdatePayload.tutor_id = substitute_tutor_id;
            } else if (typeStr === 'reschedule' || typeStr === 'change room') {
                if (data.proposed_date && data.proposed_slot && data.proposed_room_id) {
                    sessionUpdatePayload.date = data.proposed_date;
                    sessionUpdatePayload.slot = data.proposed_slot;
                    sessionUpdatePayload.classroom_id = data.proposed_room_id;
                } else if (new_date && new_slot && new_room_id) {
                    sessionUpdatePayload.date = new_date;
                    sessionUpdatePayload.slot = new_slot;
                    sessionUpdatePayload.classroom_id = new_room_id;
                }
            }

            if (Object.keys(sessionUpdatePayload).length > 0) {
                // Re-validate before updating
                const { data: originalSession } = await supabaseAdmin
                     .from('class_sessions')
                     .select('date, slot, tutor_id, classroom_id')
                     .eq('id', data.session_id)
                     .single();
                     
                const finalDate = sessionUpdatePayload.date || originalSession?.date;
                const finalSlot = sessionUpdatePayload.slot || originalSession?.slot;
                const finalTutorId = sessionUpdatePayload.tutor_id || originalSession?.tutor_id;
                const finalRoomId = sessionUpdatePayload.classroom_id || originalSession?.classroom_id;

                // 1. Check Tutor Conflict
                const { data: tutorConflicts } = await supabaseAdmin
                    .from('class_sessions')
                    .select('id')
                    .eq('tutor_id', finalTutorId)
                    .eq('date', finalDate)
                    .eq('slot', finalSlot)
                    .neq('id', data.session_id);
                    
                if (tutorConflicts && tutorConflicts.length > 0) {
                    throw new Error('Approval failed: The assigned tutor is no longer available at this time slot.');
                }

                // 2. Check Room Conflict
                const { data: roomConflicts } = await supabaseAdmin
                    .from('class_sessions')
                    .select('id')
                    .eq('classroom_id', finalRoomId)
                    .eq('date', finalDate)
                    .eq('slot', finalSlot)
                    .neq('id', data.session_id);
                    
                if (roomConflicts && roomConflicts.length > 0) {
                    throw new Error('Approval failed: The selected classroom is no longer available at this time slot.');
                }

                const { error: sessionError } = await supabaseAdmin
                    .from('class_sessions')
                    .update(sessionUpdatePayload)
                    .eq('id', data.session_id);
                
                if (sessionError) {
                    console.error('Error updating class session:', sessionError);
                    throw sessionError;
                }
            }

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
