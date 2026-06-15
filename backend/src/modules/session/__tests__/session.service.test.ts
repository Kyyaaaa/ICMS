import { SessionService } from '../session.service';
import { SessionRepository } from '../session.repository';
import { UpdateAttendanceDTO } from '../session.model';

jest.mock('../session.repository');

describe('SessionService QA Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('QA-26: Kiểm thử luồng Điểm danh End-to-End', () => {
    it('should successfully get and auto-generate default attendance data', async () => {
      const sessionId = 'session-1';
      
      // Mock session exists
      (SessionRepository.getSessionById as jest.Mock).mockResolvedValue({ id: sessionId, class_id: 'class-1' });
      
      // Mock no existing attendance
      (SessionRepository.getSessionAttendance as jest.Mock).mockResolvedValue([]);
      
      // Mock enrolled learners in the class
      (SessionRepository.getClassEnrollments as jest.Mock).mockResolvedValue([
        { learner_id: 'learner-1' },
        { learner_id: 'learner-2' }
      ]);
      
      // Mock successful bulk upsert
      (SessionRepository.bulkUpsertAttendance as jest.Mock).mockResolvedValue([
        { session_id: sessionId, learner_id: 'learner-1', status: 'PRESENT' },
        { session_id: sessionId, learner_id: 'learner-2', status: 'PRESENT' }
      ]);

      const result = await SessionService.getAttendance(sessionId);

      expect(SessionRepository.bulkUpsertAttendance).toHaveBeenCalledWith([
        { session_id: sessionId, learner_id: 'learner-1', status: 'PRESENT' },
        { session_id: sessionId, learner_id: 'learner-2', status: 'PRESENT' }
      ]);
      expect(result.length).toBe(2);
      expect(result[0].status).toBe('PRESENT');
    });

    it('should successfully update attendance data (Mark Absent)', async () => {
      const sessionId = 'session-1';
      
      // Mock session exists
      (SessionRepository.getSessionById as jest.Mock).mockResolvedValue({ id: sessionId, class_id: 'class-1' });

      const updateData: UpdateAttendanceDTO[] = [
        { learner_id: 'learner-1', status: 'ABSENT_UNEXCUSED', notes: 'No show' }
      ];

      (SessionRepository.bulkUpsertAttendance as jest.Mock).mockResolvedValue([
        { session_id: sessionId, learner_id: 'learner-1', status: 'ABSENT_UNEXCUSED', notes: 'No show' }
      ]);

      const result = await SessionService.updateAttendance(sessionId, updateData);

      expect(SessionRepository.bulkUpsertAttendance).toHaveBeenCalledWith([
        { session_id: sessionId, learner_id: 'learner-1', status: 'ABSENT_UNEXCUSED', notes: 'No show' }
      ]);
      expect(result[0].status).toBe('ABSENT_UNEXCUSED');
    });
  });
});
