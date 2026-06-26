import { EnrollmentRepository } from './enrollment.repository';
import { ClassRepository } from '../class/class.repository';
import { CreateEnrollmentDTO } from './enrollment.model';

export class EnrollmentService {
  static async enrollLearner(learnerId: string, data: CreateEnrollmentDTO) {
    const { class_id } = data;

    if (!class_id) {
      const err: any = new Error('class_id is required');
      err.status = 400;
      throw err;
    }

    // 1. Kiểm tra class_id có tồn tại
    const classData = await ClassRepository.getClassById(class_id);
    if (!classData) {
      const err: any = new Error('Class not found');
      err.status = 404;
      throw err;
    }

    // 2. Kiểm tra trạng thái lớp học (chỉ cho phép đăng ký lớp UPCOMING)
    if (classData.status !== 'UPCOMING') {
      const err: any = new Error('Class is not open for registration');
      err.status = 400;
      throw err;
    }

    // 3. Kiểm tra xem học viên đã enroll chưa
    const exists = await EnrollmentRepository.checkEnrollmentExists(learnerId, class_id);
    if (exists) {
      const err: any = new Error('Learner is already enrolled in this class');
      err.status = 400;
      throw err;
    }

    // 3.5 Kiểm tra xem học viên đã enroll vào lớp khác của cùng khoá học chưa
    if (classData.course_id) {
        const isEnrolledInCourse = await EnrollmentRepository.checkEnrollmentInCourse(learnerId, classData.course_id);
        if (isEnrolledInCourse) {
            const err: any = new Error('Learner is already enrolled in another class of this course');
            err.status = 400;
            throw err;
        }
    }

    // 4. Kiểm tra sức chứa (Capacity Limit)
    const currentEnrollments = await EnrollmentRepository.countClassEnrollments(class_id);
    if (currentEnrollments >= classData.capacity) {
      const err: any = new Error('Class is full');
      err.status = 400;
      throw err;
    }

    // 5. Thực hiện createEnrollment
    return await EnrollmentRepository.createEnrollment(learnerId, class_id);
  }

  static async getLearnerEnrollments(learnerId: string) {
    return await EnrollmentRepository.getLearnerEnrollments(learnerId);
  }

  static async getLearnerAttendance(learnerId: string, classId: string) {
    // 1. Check if learner is actually enrolled in this class
    const exists = await EnrollmentRepository.checkEnrollmentExists(learnerId, classId);
    if (!exists) {
      const err: any = new Error('Learner is not enrolled in this class');
      err.status = 403;
      throw err;
    }
    
    // 2. Get attendance data
    return await EnrollmentRepository.getLearnerAttendance(learnerId, classId);
  }

  static async countEnrollmentsByCourseId(courseId: string) {
    return await EnrollmentRepository.countEnrollmentsByCourseId(courseId);
  }

  static async cancelEnrollment(id: string) {
    return await EnrollmentRepository.updateEnrollmentStatus(id, 'CANCELED');
  }

  static async checkRegistrationConflicts(learnerId: string, classId: string, targetCourseId: string) {
    return await EnrollmentRepository.checkRegistrationConflicts(learnerId, classId, targetCourseId);
  }

  static async cancelEnrollmentByLearnerAndClass(learnerId: string, classId: string) {
    return await EnrollmentRepository.cancelEnrollmentByLearnerAndClass(learnerId, classId);
  }
}
