import { SessionRepository } from './session.repository';
import { UpdateAttendanceDTO, Attendance } from './session.model';

export class SessionService {
  static async getAttendance(sessionId: string) {
    if (!sessionId) {
      const err: any = new Error('session_id is required');
      err.status = 400;
      throw err;
    }

    const session = await SessionRepository.getSessionById(sessionId);
    if (!session) {
      const err: any = new Error('Session not found');
      err.status = 404;
      throw err;
    }

    let attendances = await SessionRepository.getSessionAttendance(sessionId);

    // Nếu chưa có dữ liệu điểm danh, tự động khởi tạo giá trị NOT_YET cho tất cả học viên
    if (!attendances || attendances.length === 0) {
      const enrollments = await SessionRepository.getClassEnrollments(session.class_id);
      
      if (enrollments && enrollments.length > 0) {
        const initialRecords: Attendance[] = enrollments.map(e => ({
          session_id: sessionId,
          learner_id: e.learner_id,
          status: 'NOT_YET'
        }));

        attendances = await SessionRepository.bulkUpsertAttendance(initialRecords);
      }
    }

    return attendances;
  }

  static async updateAttendance(sessionId: string, updates: UpdateAttendanceDTO[]) {
    if (!sessionId) {
      const err: any = new Error('session_id is required');
      err.status = 400;
      throw err;
    }

    const session = await SessionRepository.getSessionById(sessionId);
    if (!session) {
      const err: any = new Error('Session not found');
      err.status = 404;
      throw err;
    }

    if (!Array.isArray(updates) || updates.length === 0) {
      const err: any = new Error('Attendance updates data is required');
      err.status = 400;
      throw err;
    }

    const validStatuses = ['NOT_YET', 'PRESENT', 'ABSENT_EXCUSED', 'ABSENT_UNEXCUSED'];

    const recordsToUpsert: Attendance[] = updates.map(u => {
      if (!validStatuses.includes(u.status)) {
        const err: any = new Error(`Invalid status: ${u.status}`);
        err.status = 400;
        throw err;
      }
      return {
        session_id: sessionId,
        learner_id: u.learner_id,
        status: u.status,
        notes: u.notes
      };
    });

    return await SessionRepository.bulkUpsertAttendance(recordsToUpsert);
  }
}
