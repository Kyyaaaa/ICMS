import { SessionService } from '../session.service';
import { SessionRepository } from '../session.repository';
import { UpdateAttendanceDTO } from '../session.model';

jest.mock('../session.repository');

describe('SessionService QA Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('QA-26 & QA-27: Kiểm thử luồng Điểm danh End-to-End & Trạng thái NOT_YET', () => {
    it('should successfully get and auto-generate default attendance data with NOT_YET status', async () => {
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
        { session_id: sessionId, learner_id: 'learner-1', status: 'NOT_YET' },
        { session_id: sessionId, learner_id: 'learner-2', status: 'NOT_YET' }
      ]);

      const result = await SessionService.getAttendance(sessionId);

      expect(SessionRepository.bulkUpsertAttendance).toHaveBeenCalledWith([
        { session_id: sessionId, learner_id: 'learner-1', status: 'NOT_YET' },
        { session_id: sessionId, learner_id: 'learner-2', status: 'NOT_YET' }
      ]);
      expect(result.length).toBe(2);
      expect(result[0].status).toBe('NOT_YET');
    });

    it('should successfully update attendance data from NOT_YET to PRESENT', async () => {
      const sessionId = 'session-1';
      
      // Mock session exists
      (SessionRepository.getSessionById as jest.Mock).mockResolvedValue({ id: sessionId, class_id: 'class-1' });

      const updateData: UpdateAttendanceDTO[] = [
        { learner_id: 'learner-1', status: 'PRESENT', notes: 'Present today' }
      ];

      (SessionRepository.bulkUpsertAttendance as jest.Mock).mockResolvedValue([
        { session_id: sessionId, learner_id: 'learner-1', status: 'PRESENT', notes: 'Present today' }
      ]);

      const result = await SessionService.updateAttendance(sessionId, updateData);

      expect(SessionRepository.bulkUpsertAttendance).toHaveBeenCalledWith([
        { session_id: sessionId, learner_id: 'learner-1', status: 'PRESENT', notes: 'Present today' }
      ]);
      expect(result[0].status).toBe('PRESENT');
    });

    it('QA-28: should successfully update attendance data (Mark Absent)', async () => {
      const sessionId = 'session-1';
      
      // Mock session exists
      (SessionRepository.getSessionById as jest.Mock).mockResolvedValue({ id: sessionId, class_id: 'class-1' });

      const updateData: UpdateAttendanceDTO[] = [
        { learner_id: 'learner-1', status: 'ABSENT', notes: 'No show' }
      ];

      (SessionRepository.bulkUpsertAttendance as jest.Mock).mockResolvedValue([
        { session_id: sessionId, learner_id: 'learner-1', status: 'ABSENT', notes: 'No show' }
      ]);

      const result = await SessionService.updateAttendance(sessionId, updateData);

      expect(SessionRepository.bulkUpsertAttendance).toHaveBeenCalledWith([
        { session_id: sessionId, learner_id: 'learner-1', status: 'ABSENT', notes: 'No show' }
      ]);
      expect(result[0].status).toBe('ABSENT');
    });
  });
});
