import { formatDate } from "../../../shared/utils/date";
import axiosClient from '../../../shared/services/axiosClient';
import type { ChangeRequest } from '../types/change-request';

export const ChangeRequestsService = {
    getRequests: async (): Promise<ChangeRequest[]> => {
        try {
            const response = await axiosClient.get('/change-requests');
            const data = Array.isArray((response as any)?.data) ? (response as any).data : (Array.isArray(response) ? response : []);
            return data.map((req: any) => ({
                id: req.id,
                tutor: req.tutor?.full_name || 'Unknown Tutor',
                tutorId: req.tutor_id || req.tutor?.id || '',
                className: req.class ? `${req.class.course?.title || 'Unknown Course'} - ${req.class.name || 'Unknown Class'}` : 'Unknown Class',
                session: req.session?.session_number || 1,
                type: req.type,
                originalTime: req.original_time,
                proposedTime: req.proposed_time,
                reason: req.reason,
                status: req.status,
                submittedAt: formatDate(req.created_at),
                staffNote: req.staff_note || '',
                finalTime: req.final_time || '',
                originalRoomId: req.class?.classroom_id || req.session?.classroom_id
            }));
        } catch (error) {
            console.error('Failed to fetch change requests:', error);
            return [];
        }
    },

    updateRequest: async (
        updatedRequest: ChangeRequest, 
        substituteTutorId?: string,
        newDate?: string,
        newSlot?: string,
        newRoomId?: string
    ): Promise<void> => {
        try {
            const payload: any = {
                status: updatedRequest.status,
                final_time: updatedRequest.finalTime,
                staff_note: updatedRequest.staffNote
            };
            if (substituteTutorId) payload.substitute_tutor_id = substituteTutorId;
            if (newDate) payload.new_date = newDate;
            if (newSlot) payload.new_slot = newSlot;
            if (newRoomId) payload.new_room_id = newRoomId;
            await axiosClient.patch(`/change-requests/${updatedRequest.id}/status`, payload);
        } catch (error) {
            console.error('Failed to update change request:', error);
            throw error;
        }
    }
};
