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
        const { data, error } = await supabaseAdmin
            .from('change_requests')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating change request:', error);
            throw error;
        }

        return data;
    }
}
