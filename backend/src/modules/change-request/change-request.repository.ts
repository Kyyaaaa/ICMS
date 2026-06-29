import { supabaseAdmin } from '../../configs/supabase';
import { CreateChangeRequestDTO, UpdateChangeRequestStatusDTO } from './change-request.model';

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
            } else if ((typeStr === 'reschedule' || typeStr === 'change room') && new_date && new_slot && new_room_id) {
                sessionUpdatePayload.date = new_date;
                sessionUpdatePayload.slot = new_slot;
                sessionUpdatePayload.classroom_id = new_room_id;
            }

            if (Object.keys(sessionUpdatePayload).length > 0) {
                const { error: sessionError } = await supabaseAdmin
                    .from('class_sessions')
                    .update(sessionUpdatePayload)
                    .eq('id', data.session_id);
                
                if (sessionError) {
                    console.error('Error updating class session:', sessionError);
                    throw sessionError;
                }
            }
        }

        return data;
    }
}
