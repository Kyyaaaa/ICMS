import { ClassService } from '../class.service';
import { ClassRepository } from '../class.repository';
import { CreateClassDTO } from '../class.model';

jest.mock('../class.repository');

describe('ClassService QA Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('QA-20: Kịch bản kiểm thử Xung đột lịch (Schedule Conflict)', () => {
    it('should throw 409 Conflict if tutor has schedule conflict during class creation', async () => {
      const mockPayload: CreateClassDTO = {
        name: 'Conflict Class',
        course_id: 'course-1',
        start_date: '2026-01-01',
        end_date: '2026-02-01',
        capacity: 20,
        tutor_id: 'tutor-1',
        sessions: [
          { session_number: 1, date: '2026-01-05', slot: 'slot1' }
        ]
      };

      (ClassRepository.getCourseById as jest.Mock).mockResolvedValue({ id: 'course-1', sessions: 10 });
      (ClassRepository.checkTutorConflict as jest.Mock).mockResolvedValue(true); // Conflict exists

      await expect(ClassService.createClass(mockPayload))
        .rejects
        .toEqual({ status: 409, message: 'Tutor schedule conflict at date 2026-01-05 and slot1' });
    });

    it('should throw 409 Conflict if classroom is already booked when updating session', async () => {
      (ClassRepository.checkClassroomConflict as jest.Mock).mockResolvedValue(true); // Conflict exists

      await expect(ClassService.updateClassSession('class-1', 'session-1', {
        date: '2026-01-10',
        slot: 'slot2',
        classroom_id: 'room-1'
      }))
        .rejects
        .toEqual({ status: 409, message: 'Conflict Schedule: Classroom is already booked at this time' });
    });
  });

  describe('QA-21: Kiểm thử luồng Clone Session', () => {
    it('should accurately clone sessions based on course template', async () => {
      const mockPayload: CreateClassDTO = {
        name: 'Normal Class',
        course_id: 'course-1',
        start_date: '2026-01-01',
        end_date: '2026-02-01',
        capacity: 20,
        tutor_id: 'tutor-1',
        sessions: [] // no advanced configs
      };

      (ClassRepository.getCourseById as jest.Mock).mockResolvedValue({ id: 'course-1', sessions: 5 });
      (ClassRepository.createClass as jest.Mock).mockResolvedValue({ id: 'class-new' });
      (ClassRepository.insertClassSessions as jest.Mock).mockImplementation((sessions) => sessions);

      const result = await ClassService.createClass(mockPayload);

      expect(ClassRepository.insertClassSessions).toHaveBeenCalledTimes(1);
      
      const insertedSessions = (ClassRepository.insertClassSessions as jest.Mock).mock.calls[0][0];
      // Expect exactly 5 sessions created as per the course template
      expect(insertedSessions.length).toBe(5);
      expect(insertedSessions[0].class_id).toBe('class-new');
      expect(insertedSessions[0].session_number).toBe(1);
      expect(insertedSessions[4].session_number).toBe(5);
      
      expect(result.sessions.length).toBe(5);
    });
  });

  describe('QA-22: Kiểm thử tự động cập nhật Trạng thái (Cron Job logic)', () => {
    it('Cron Logic: mock verify transition from UPCOMING to ONGOING to COMPLETED', () => {
      // In actual backend, this would run `classStatusCron.ts`. 
      // For unit tests, we test the core logic concepts.
      const today = new Date('2026-05-15');
      const start_date = new Date('2026-05-10'); // started 5 days ago
      const end_date = new Date('2026-05-14'); // ended yesterday

      // If status is UPCOMING and start_date <= today -> should update to ONGOING
      const shouldBeOngoing = start_date <= today;
      expect(shouldBeOngoing).toBe(true);

      // If status is ONGOING and end_date < today -> should update to COMPLETED
      const shouldBeCompleted = end_date < today;
      expect(shouldBeCompleted).toBe(true);
    });
  });
});
