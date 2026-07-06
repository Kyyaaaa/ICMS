import { ChangeRequestRepository } from './change-request.repository';
import { CreateChangeRequestDTO, UpdateChangeRequestStatusDTO } from './change-request.model';

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
        const session = await this.changeRequestRepository.getSessionOwnership(sessionId);
        if (session.tutor_id !== tutorId || session.class_id !== classId) {
            const error: any = new Error('Forbidden: This session is not assigned to you');
            error.status = 403;
            throw error;
        }
        // Validation 1: Tutor Conflict
        const isTutorOccupied = await ClassRepository.checkScheduleConflict('tutor_id', tutorId, date, slot, sessionId, undefined);
        if (isTutorOccupied) {
            return { available: false, conflictReason: 'You are already scheduled to teach another class at this time.' };
        }

        // Validation 2: Learner Conflict
        const conflictClassName = await this.changeRequestRepository.getLearnerConflictClass(classId, date, slot, sessionId);
        if (conflictClassName) {
            return { available: false, conflictReason: `Schedule conflict: One or more learners in this class are already enrolled in "${conflictClassName}" at this time.` };
        }

        // If no conflicts, fetch available rooms
        const occupiedSessions = await ClassRepository.getOccupiedSessions({ date, slot });
        const occupiedRoomIds = occupiedSessions.map(s => s.classroom_id).filter(Boolean);

        const availableRooms = await this.changeRequestRepository.getAvailableRooms(occupiedRoomIds as string[]);
        return { available: true, availableRooms };
    }

    async create(data: CreateChangeRequestDTO, tutorId: string) {
        const session = await this.changeRequestRepository.getSessionOwnership(data.session_id);
        if (session.tutor_id !== tutorId || session.class_id !== data.class_id) {
            const error: any = new Error('Forbidden: You can only create requests for your own sessions');
            error.status = 403;
            throw error;
        }
        data = { ...data, tutor_id: tutorId, status: 'Pending' };
        const hasPending = await this.changeRequestRepository.hasPendingRequestForSession(data.session_id);
        
        if (hasPending) {
            throw new Error('A pending change request already exists for this session.');
        }

        // Check if the session is in the past
        const sessionDateStr = await this.changeRequestRepository.getSessionDate(data.session_id);
            
        if (sessionDateStr) {
            const todayDate = new Date();
            const todayStr = todayDate.getFullYear() + '-' + String(todayDate.getMonth() + 1).padStart(2, '0') + '-' + String(todayDate.getDate()).padStart(2, '0');
            
            if (sessionDateStr < todayStr) {
                throw new Error('Cannot create a change request for a session that has already passed.');
            }
        }

        return await this.changeRequestRepository.create(data);
    }

    async updateStatus(id: string, updateData: UpdateChangeRequestStatusDTO) {
        return await this.changeRequestRepository.updateStatus(id, updateData);
    }
}
