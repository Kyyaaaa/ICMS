import { ClassRepository } from './class.repository';
import { EnrollmentRepository } from '../enrollment/enrollment.repository';
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
    
    const sessions = data.sessions || [];
    
    return (data.students || []).map((student: any) => {
      let presentCount = 0;
      let gradedCount = 0;
      
      const studentId = student.learner_id || student.account?.id;

      sessions.forEach((session: any) => {
        const attendances = session.attendances || [];
        const att = attendances.find((a: any) => a.learner_id === studentId);
        
        if (att && att.status && att.status !== 'NOT_YET') {
          gradedCount++;
          if (att.status === 'PRESENT' || att.status === 'LATE') {
             presentCount++;
          }
        }
      });

      let attendanceRate = 100;
      if (gradedCount > 0) {
        attendanceRate = Math.round((presentCount / gradedCount) * 100);
      }

      return {
        ...student,
        attendance_rate: attendanceRate
      };
    });
  }

  static async createClass(data: CreateClassDTO) {
    if (data.name) {
      const existingClass = await ClassRepository.getClassByName(data.name);
      if (existingClass) {
        throw { status: 409, message: 'Class name already exists' };
      }
    }

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
    const numSessions = course.sessions || 0;
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
        // Check conflict if tutor and classroom are provided for the session or class
        if (sess.date && sess.slot) {
          const checkTutorId = sess.tutor_id || data.tutor_id;
          if (checkTutorId) {
            const hasTutorConflict = await ClassRepository.checkScheduleConflict('tutor_id', checkTutorId, sess.date, sess.slot);
            if (hasTutorConflict) {
              const formattedSlot = sess.slot.replace(/^slot/i, 'Slot ');
              throw { status: 409, message: `Tutor schedule conflict at date ${sess.date} and ${formattedSlot}` };
            }
          }
          const checkClassroomId = sess.classroom_id || data.classroom_id;
          if (checkClassroomId) {
            const hasRoomConflict = await ClassRepository.checkScheduleConflict('classroom_id', checkClassroomId, sess.date, sess.slot);
            if (hasRoomConflict) {
              const formattedSlot = sess.slot.replace(/^slot/i, 'Slot ');
              throw { status: 409, message: `Classroom schedule conflict at date ${sess.date} and ${formattedSlot}` };
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
        tutor_id: config?.tutor_id || data.tutor_id || null,
        classroom_id: config?.classroom_id || data.classroom_id || null
      });
    }

    const createdSessions = await ClassRepository.insertClassSessions(sessionsToInsert);

    // Sync availability for all tutors involved in this class
    await ClassService.syncAllTutorsAvailability(createdSessions);

    return {
      class: newClass,
      sessions: createdSessions
    };
  }

  static async updateClass(id: string, updates: UpdateClassDTO) {
    if (updates.name) {
      const existingClass = await ClassRepository.getClassByName(updates.name, id);
      if (existingClass) {
        throw { status: 409, message: 'Class name already exists' };
      }
    }

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

    // Validate conflicts
    if (sessions && sessions.length > 0) {
      for (const sess of sessions) {
        if (sess.date && sess.slot) {
          const checkTutorId = sess.tutor_id || classUpdates.tutor_id || updatedClass?.tutor_id;
          if (checkTutorId) {
            const hasTutorConflict = await ClassRepository.checkScheduleConflict('tutor_id', checkTutorId, sess.date, sess.slot, undefined, id);
            if (hasTutorConflict) {
              const formattedSlot = sess.slot.replace(/^slot/i, 'Slot ');
              throw { status: 409, message: `Tutor schedule conflict at date ${sess.date} and ${formattedSlot}` };
            }
          }
          const checkClassroomId = sess.classroom_id || classUpdates.classroom_id || updatedClass?.classroom_id;
          if (checkClassroomId) {
            const hasRoomConflict = await ClassRepository.checkScheduleConflict('classroom_id', checkClassroomId, sess.date, sess.slot, undefined, id);
            if (hasRoomConflict) {
              const formattedSlot = sess.slot.replace(/^slot/i, 'Slot ');
              throw { status: 409, message: `Classroom schedule conflict at date ${sess.date} and ${formattedSlot}` };
            }
          }
        }
      }
    } else if (classUpdates.tutor_id || classUpdates.classroom_id) {
      // If we are updating tutor_id or classroom_id for the whole class, without passing new sessions
      const existingSessions = await ClassRepository.getClassSessionsByClassId(id);
      
      for (const sess of existingSessions) {
        if (sess.date && sess.slot) {
          const checkTutorId = classUpdates.tutor_id || updatedClass?.tutor_id;
          if (checkTutorId && classUpdates.tutor_id !== undefined) {
            const hasTutorConflict = await ClassRepository.checkScheduleConflict('tutor_id', checkTutorId, sess.date, sess.slot, sess.id, id);
            if (hasTutorConflict) {
              const formattedSlot = sess.slot.replace(/^slot/i, 'Slot ');
              throw { status: 409, message: `Tutor schedule conflict at date ${sess.date} and ${formattedSlot}` };
            }
          }
          const checkClassroomId = classUpdates.classroom_id || updatedClass?.classroom_id;
          if (checkClassroomId && classUpdates.classroom_id !== undefined) {
            const hasRoomConflict = await ClassRepository.checkScheduleConflict('classroom_id', checkClassroomId, sess.date, sess.slot, sess.id, id);
            if (hasRoomConflict) {
              const formattedSlot = sess.slot.replace(/^slot/i, 'Slot ');
              throw { status: 409, message: `Classroom schedule conflict at date ${sess.date} and ${formattedSlot}` };
            }
          }
        }
      }

      // If no conflicts, update the class_sessions table to sync tutor_id/classroom_id
      const sessionUpdates: any = {};
      if (classUpdates.tutor_id !== undefined) sessionUpdates.tutor_id = classUpdates.tutor_id;
      if (classUpdates.classroom_id !== undefined) sessionUpdates.classroom_id = classUpdates.classroom_id;
      
      if (Object.keys(sessionUpdates).length > 0) {
        await ClassRepository.updateAllClassSessions(id, sessionUpdates);
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
          tutor_id: config.tutor_id || classUpdates.tutor_id || updatedClass?.tutor_id || null,
          classroom_id: config.classroom_id || classUpdates.classroom_id || updatedClass?.classroom_id || null
        });
      }

      await ClassRepository.insertClassSessions(sessionsToInsert);
    }

    // Sync availability for all tutors involved after any update
    const finalSessions = await ClassRepository.getClassSessionsByClassId(id);
    await ClassService.syncAllTutorsAvailability(finalSessions);

    return updatedClass;
  }

  static async deleteClass(id: string) {
    // 1. Prevent deleting class if it has active enrollments
    const activeEnrollmentsCount = await EnrollmentRepository.countClassEnrollments(id);
    if (activeEnrollmentsCount > 0) {
      throw { status: 400, message: 'Cannot delete class with active enrollments. Please cancel them first.' };
    }
    
    return await ClassRepository.deleteClass(id);
  }

  static async deleteClassesByCourseId(courseId: string) {
    return await ClassRepository.deleteClassesByCourseId(courseId);
  }

  static async updateClassSession(classId: string, sessionId: string, updates: UpdateClassSessionDTO) {
    if (updates.slot && !ALLOWED_SLOTS.includes(updates.slot)) {
      throw { status: 400, message: `Invalid slot: ${updates.slot}` };
    }

    const originalSession = await ClassRepository.getSessionById(sessionId);
    if (!originalSession) {
      throw { status: 404, message: 'Class session not found' };
    }

    const targetDate = updates.date || originalSession.date;
    const targetSlot = updates.slot || originalSession.slot;
    const targetTutorId = updates.tutor_id !== undefined ? updates.tutor_id : originalSession.tutor_id;
    const targetClassroomId = updates.classroom_id !== undefined ? updates.classroom_id : originalSession.classroom_id;

    // Check for conflicts if any scheduling-related field is updated
    if ((updates.date || updates.slot || updates.tutor_id !== undefined || updates.classroom_id !== undefined) && targetDate && targetSlot) {
      if (targetTutorId) {
        const hasTutorConflict = await ClassRepository.checkScheduleConflict('tutor_id', targetTutorId, targetDate, targetSlot, sessionId);
        if (hasTutorConflict) {
          throw { status: 409, message: 'Conflict Schedule: Tutor is already busy at this time' };
        }
      }
      if (targetClassroomId) {
        const hasRoomConflict = await ClassRepository.checkScheduleConflict('classroom_id', targetClassroomId, targetDate, targetSlot, sessionId);
        if (hasRoomConflict) {
          throw { status: 409, message: 'Conflict Schedule: Classroom is already booked at this time' };
        }
      }
    }

    // Validate tutor availability for this specific session
    if (targetTutorId && targetDate && targetSlot) {
      // Get class to find start_date
      const targetClass = await ClassRepository.getClassById(classId);

      // Only check availability if we are changing to a DIFFERENT tutor.
      // If we are rescheduling for the SAME tutor, we bypass availability check.
      const isSameTutor = originalSession.tutor_id === targetTutorId;

      if (targetClass && targetClass.start_date && !isSameTutor) {
        const cycleName = getCycleNameFromDate(targetClass.start_date);
        const slotKey = getAvailabilitySlotKey(targetDate, targetSlot);
        try {
          await AvailableTimeSlotService.checkTutorAvailabilityForSlots(targetTutorId, cycleName, [slotKey]);
        } catch (err: any) {
          throw { status: 409, message: err.message || 'Tutor availability verification failed.' };
        }
      }
    }

    const result = await ClassRepository.updateClassSession(classId, sessionId, updates);
    
    // Sync availability for the newly assigned tutor if updated
    if (targetTutorId) {
      await ClassService.syncAllTutorsAvailability([{
        tutor_id: targetTutorId,
        date: targetDate,
        slot: targetSlot
      }]);
    }

    return result;
  }

  static async getOccupiedSessions(filters: { tutor_id?: string, classroom_id?: string, date?: string, slot?: string, start_date?: string, exclude_class_id?: string }) {
    return ClassRepository.getOccupiedSessions(filters);
  }

  static async syncAllTutorsAvailability(sessions: any[]) {
    // Group sessions by tutor
    const tutorSessions: Record<string, any[]> = {};
    for (const sess of sessions) {
      if (sess.tutor_id) {
        if (!tutorSessions[sess.tutor_id]) {
          tutorSessions[sess.tutor_id] = [];
        }
        tutorSessions[sess.tutor_id].push(sess);
      }
    }
    // Sync each tutor
    for (const [tutorId, assignedSessions] of Object.entries(tutorSessions)) {
      await AvailableTimeSlotService.syncTutorAvailabilityWithSessions(tutorId, assignedSessions);
    }
  }
}
