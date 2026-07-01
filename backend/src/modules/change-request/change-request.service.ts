import { ChangeRequestRepository } from './change-request.repository';
import { CreateChangeRequestDTO, UpdateChangeRequestStatusDTO } from './change-request.model';
import { supabaseAdmin as supabase } from '../../configs/supabase';
import { ClassRepository } from '../class/class.repository';

export class ChangeRequestService {
    private changeRequestRepository: ChangeRequestRepository;

    constructor() {
        this.changeRequestRepository = new ChangeRequestRepository();
    }

    async getAll() {
        return await this.changeRequestRepository.findAll();
    }

    async getByTutorId(tutorId: string) {
        return await this.changeRequestRepository.findByTutorId(tutorId);
    }

    async checkAvailability(tutorId: string, classId: string, sessionId: string, date: string, slot: string) {
        // Validation 1: Tutor Conflict
        const isTutorOccupied = await ClassRepository.checkScheduleConflict('tutor_id', tutorId, date, slot, sessionId, undefined);
        if (isTutorOccupied) {
            return { available: false, conflictReason: 'You are already scheduled to teach another class at this time.' };
        }

        // Validation 2: Learner Conflict
        const { data: enrollments } = await supabase
            .from('enrollments')
            .select('learner_id')
            .eq('class_id', classId)
            .eq('status', 'ACTIVE');
        
        if (enrollments && enrollments.length > 0) {
            const learnerIds = enrollments.map(e => e.learner_id);
            const { data: otherEnrollments } = await supabase
                .from('enrollments')
                .select('class_id')
                .in('learner_id', learnerIds)
                .eq('status', 'ACTIVE');
            
            if (otherEnrollments && otherEnrollments.length > 0) {
                const otherClassIds = [...new Set(otherEnrollments.map(e => e.class_id))];
                const { data: conflictingSessions } = await supabase
                    .from('class_sessions')
                    .select('class_id, classes(name)')
                    .eq('date', date)
                    .eq('slot', slot)
                    .in('class_id', otherClassIds)
                    .neq('id', sessionId);
                
                if (conflictingSessions && conflictingSessions.length > 0) {
                    const conflictClassName = (conflictingSessions[0] as any).classes?.name || 'another class';
                    return { available: false, conflictReason: `Schedule conflict: One or more learners in this class are already enrolled in "${conflictClassName}" at this time.` };
                }
            }
        }

        // If no conflicts, fetch available rooms
        const occupiedSessions = await ClassRepository.getOccupiedSessions({ date, slot });
        const occupiedRoomIds = occupiedSessions.map(s => s.classroom_id).filter(Boolean);

        const { data: allRooms } = await supabase
            .from('classroom')
            .select('id, room_name, capacity')
            .eq('status', 'AVAILABLE');
        
        const availableRooms = (allRooms || []).filter(r => !occupiedRoomIds.includes(r.id));
        return { available: true, availableRooms };
    }

    async create(data: CreateChangeRequestDTO) {
        const { data: existing } = await supabase
            .from('change_requests')
            .select('id')
            .eq('session_id', data.session_id)
            .eq('status', 'Pending')
            .limit(1);
        
        if (existing && existing.length > 0) {
            throw new Error('A pending change request already exists for this session.');
        }

        // Check if the session is in the past
        const { data: sessionInfo } = await supabase
            .from('class_sessions')
            .select('date')
            .eq('id', data.session_id)
            .single();
            
        if (sessionInfo) {
            const sessionDate = new Date(sessionInfo.date);
            const todayDate = new Date();
            sessionDate.setHours(0,0,0,0);
            todayDate.setHours(0,0,0,0);
            if (sessionDate < todayDate) {
                throw new Error('Cannot create a change request for a session that has already passed.');
            }
        }

        return await this.changeRequestRepository.create(data);
    }

    async updateStatus(id: string, updateData: UpdateChangeRequestStatusDTO) {
        return await this.changeRequestRepository.updateStatus(id, updateData);
    }
}
