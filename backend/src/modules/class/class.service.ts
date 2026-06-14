import { ClassRepository } from './class.repository';
import { CreateClassDTO, UpdateClassDTO, UpdateClassSessionDTO, ALLOWED_SLOTS, SessionConfig } from './class.model';

export class ClassService {
  static async getClasses(statusFilter?: string, courseId?: string, tutorId?: string, page: number = 1, limit: number = 50) {
    return await ClassRepository.getClasses(statusFilter, courseId, tutorId, page, limit);
  }

  static async getClassById(id: string) {
    const data = await ClassRepository.getClassById(id);
    if (!data) throw new Error("Class not found");
    return data;
  }

  static async createClass(data: CreateClassDTO) {
    if (new Date(data.end_date) <= new Date(data.start_date)) {
      throw { status: 400, message: 'End date must be greater than start date' };
    }
    if (data.capacity <= 0) {
      throw { status: 400, message: 'Capacity must be greater than 0' };
    }

    const course = await ClassRepository.getCourseById(data.course_id);
    if (!course) {
      throw { status: 404, message: 'Course not found' };
    }

    // Number of sessions from course template
    const numSessions = parseInt(course.sessions) || 0;
    if (numSessions <= 0) {
      throw { status: 400, message: 'Course has invalid number of sessions' };
    }

    // Validate provided sessions payload
    if (data.sessions && data.sessions.length > 0) {
      for (const sess of data.sessions) {
        if (sess.slot && !ALLOWED_SLOTS.includes(sess.slot)) {
          throw { status: 400, message: `Invalid slot: ${sess.slot}` };
        }
        // Check conflict if tutor and classroom are provided for the class
        if (sess.date && sess.slot) {
          if (data.tutor_id) {
            const hasTutorConflict = await ClassRepository.checkTutorConflict(data.tutor_id, sess.date, sess.slot);
            if (hasTutorConflict) {
              throw { status: 409, message: `Tutor schedule conflict at date ${sess.date} and ${sess.slot}` };
            }
          }
          if (data.classroom_id) {
            const hasRoomConflict = await ClassRepository.checkClassroomConflict(data.classroom_id, sess.date, sess.slot);
            if (hasRoomConflict) {
              throw { status: 409, message: `Classroom schedule conflict at date ${sess.date} and ${sess.slot}` };
            }
          }
        }
      }
    }

    // Create the class
    const newClass = await ClassRepository.createClass(data);

    // Prepare sessions
    const sessionsToInsert = [];
    for (let i = 1; i <= numSessions; i++) {
      let sessDate = null;
      let sessSlot = null;

      // Find if config was provided in payload
      const config = data.sessions?.find((s: SessionConfig) => s.session_number === i);
      if (config) {
        sessDate = config.date;
        sessSlot = config.slot;
      }

      sessionsToInsert.push({
        class_id: newClass.id,
        session_number: i,
        title: `Session ${i}`,
        date: sessDate,
        slot: sessSlot,
        tutor_id: data.tutor_id || null,
        classroom_id: data.classroom_id || null
      });
    }

    const createdSessions = await ClassRepository.insertClassSessions(sessionsToInsert);

    return {
      class: newClass,
      sessions: createdSessions
    };
  }

  static async updateClass(id: string, updates: UpdateClassDTO) {
    // Only updates tutor, classroom, status for the Class object (not individual sessions)
    return ClassRepository.updateClass(id, updates);
  }

  static async updateClassSession(classId: string, sessionId: string, updates: UpdateClassSessionDTO) {
    if (updates.slot && !ALLOWED_SLOTS.includes(updates.slot)) {
      throw { status: 400, message: `Invalid slot: ${updates.slot}` };
    }

    // If date and slot are provided, we must check for conflicts
    if (updates.date && updates.slot) {
      if (updates.tutor_id) {
        const hasTutorConflict = await ClassRepository.checkTutorConflict(updates.tutor_id, updates.date, updates.slot, sessionId);
        if (hasTutorConflict) {
          throw { status: 409, message: 'Conflict Schedule: Tutor is already busy at this time' };
        }
      }
      if (updates.classroom_id) {
        const hasRoomConflict = await ClassRepository.checkClassroomConflict(updates.classroom_id, updates.date, updates.slot, sessionId);
        if (hasRoomConflict) {
          throw { status: 409, message: 'Conflict Schedule: Classroom is already booked at this time' };
        }
      }
    }

    return ClassRepository.updateClassSession(classId, sessionId, updates);
  }
}
