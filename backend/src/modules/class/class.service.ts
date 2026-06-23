import { ClassRepository } from './class.repository';
import { CourseService } from '../course/course.service';
import { TutorReviewService } from '../tutor-review/tutor-review.service';
import { AvailableTimeSlotService } from '../available-time-slot/available-time-slot.service';
import { getCycleNameFromDate, getAvailabilitySlotKey } from '../../utils/slot-mapper';
import { CreateClassDTO, UpdateClassDTO, UpdateClassSessionDTO, ALLOWED_SLOTS, SessionConfig } from './class.model';
export class ClassService {
  static async getClasses(statusFilter?: string, courseId?: string, tutorId?: string, page: number = 1, limit: number = 50) {
    return await ClassRepository.getClasses(statusFilter, courseId, tutorId, page, limit);
  }

  static async getClassById(id: string) {
    const data = await ClassRepository.getClassById(id);
    if (!data) throw new Error("Class not found");

    if (data.tutor && data.tutor.id) {
      const stats = await TutorReviewService.getTutorStats(data.tutor.id);
      data.tutor.rating = stats.averageRating;
      data.tutor.reviewCount = stats.reviewCount;
    }

    return data;
  }

  static async getClassStudents(id: string) {
    const data = await ClassRepository.getClassById(id);
    if (!data) throw new Error("Class not found");
    return data.students;
  }

  static async createClass(data: CreateClassDTO) {
    if (new Date(data.end_date) <= new Date(data.start_date)) {
      throw { status: 400, message: 'End date must be greater than start date' };
    }
    if (data.capacity <= 0) {
      throw { status: 400, message: 'Capacity must be greater than 0' };
    }

    const course = await CourseService.getCourseById(data.course_id);
    if (!course) {
      throw { status: 404, message: 'Course not found' };
    }

    // Number of sessions from course template
    const numSessions = parseInt(course.sessions) || 0;
    if (numSessions <= 0) {
      throw { status: 400, message: 'Course has invalid number of sessions' };
    }
    const courseSessionsList = course.sessions_list || [];

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

    // Validate availability cycle for tutor if provided
    if (data.tutor_id && data.sessions && data.sessions.length > 0) {
      // Rule: We only check the cycle corresponding to the start_date of the class
      const cycleName = getCycleNameFromDate(data.start_date);
      
      const requiredSlotKeys = new Set<string>();
      for (const sess of data.sessions) {
        if (sess.date && sess.slot) {
          // Add to required slots (only if it falls into the start_date's month, or just check all slots against the start_date's cycle)
          // Since the class might span multiple months, we just verify they committed to these days/slots in the start month.
          requiredSlotKeys.add(getAvailabilitySlotKey(sess.date, sess.slot));
        }
      }

      const keysArray = Array.from(requiredSlotKeys);
      if (keysArray.length > 0) {
        try {
          await AvailableTimeSlotService.checkTutorAvailabilityForSlots(data.tutor_id, cycleName, keysArray);
        } catch (err: any) {
          throw { status: 409, message: err.message || 'Tutor availability verification failed.' };
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

      const courseSessionTemplate = courseSessionsList.find((cs: any) => cs.session_number === i);
      const sessionTitle = courseSessionTemplate ? courseSessionTemplate.title : `Session ${i}`;

      sessionsToInsert.push({
        class_id: newClass.id,
        session_number: i,
        title: sessionTitle,
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
    const { sessions, ...classUpdates } = updates;

    const updatedClass = await ClassRepository.updateClass(id, classUpdates);

    // Validate availability cycle for tutor if sessions are provided and tutor is assigned
    const targetTutorId = classUpdates.tutor_id !== undefined ? classUpdates.tutor_id : updatedClass?.tutor_id;
    const targetStartDate = classUpdates.start_date !== undefined ? classUpdates.start_date : updatedClass?.start_date;
    
    if (targetTutorId && sessions && sessions.length > 0 && targetStartDate) {
      const cycleName = getCycleNameFromDate(targetStartDate);
      const requiredSlotKeys = new Set<string>();
      
      for (const sess of sessions) {
        if (sess.date && sess.slot) {
          requiredSlotKeys.add(getAvailabilitySlotKey(sess.date, sess.slot));
        }
      }

      const keysArray = Array.from(requiredSlotKeys);
      if (keysArray.length > 0) {
        try {
          await AvailableTimeSlotService.checkTutorAvailabilityForSlots(targetTutorId, cycleName, keysArray);
        } catch (err: any) {
          throw { status: 409, message: err.message || 'Tutor availability verification failed.' };
        }
      }
    }

    // If sessions are provided, overwrite existing sessions
    if (sessions && sessions.length > 0) {
      await ClassRepository.deleteClassSessions(id);
      
      let courseSessionsList: any[] = [];
      if (updatedClass && updatedClass.course_id) {
          const course = await CourseService.getCourseById(updatedClass.course_id);
          courseSessionsList = course ? course.sessions_list || [] : [];
      }

      const sessionsToInsert = [];
      for (const config of sessions) {
        const courseSessionTemplate = courseSessionsList.find((cs: any) => cs.session_number === config.session_number);
        const sessionTitle = courseSessionTemplate ? courseSessionTemplate.title : `Session ${config.session_number}`;

        sessionsToInsert.push({
          class_id: id,
          session_number: config.session_number,
          title: sessionTitle,
          date: config.date,
          slot: config.slot,
          tutor_id: classUpdates.tutor_id || updatedClass.tutor_id || null,
          classroom_id: classUpdates.classroom_id || updatedClass.classroom_id || null
        });
      }

      await ClassRepository.insertClassSessions(sessionsToInsert);
    }

    return updatedClass;
  }

  static async deleteClass(id: string) {
    // Optionally check if class has students before deleting
    // but the DB constraint or controller might handle this.
    // The frontend checks if enrolledStudents > 0 already.
    return await ClassRepository.deleteClass(id);
  }

  static async deleteClassesByCourseId(courseId: string) {
    return await ClassRepository.deleteClassesByCourseId(courseId);
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

    // Validate tutor availability for this specific session
    if (updates.tutor_id && updates.date && updates.slot) {
      // Get class to find start_date
      const targetClass = await ClassRepository.getClassById(classId);
      if (targetClass && targetClass.start_date) {
        const cycleName = getCycleNameFromDate(targetClass.start_date);
        const slotKey = getAvailabilitySlotKey(updates.date, updates.slot);
        try {
          await AvailableTimeSlotService.checkTutorAvailabilityForSlots(updates.tutor_id, cycleName, [slotKey]);
        } catch (err: any) {
          throw { status: 409, message: err.message || 'Tutor availability verification failed.' };
        }
      }
    }

    return ClassRepository.updateClassSession(classId, sessionId, updates);
  }

  static async getOccupiedSessions(filters: { tutor_id?: string, classroom_id?: string, date?: string, slot?: string, start_date?: string, exclude_class_id?: string }) {
    return ClassRepository.getOccupiedSessions(filters);
  }
}
