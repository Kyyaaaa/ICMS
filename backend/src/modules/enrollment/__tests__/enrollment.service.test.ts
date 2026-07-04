import { EnrollmentService } from '../enrollment.service';
import { EnrollmentRepository } from '../enrollment.repository';
import { ClassRepository } from '../../class/class.repository';

jest.mock('../enrollment.repository');
jest.mock('../../class/class.repository');

describe('EnrollmentService QA Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('QA-25: Kiểm thử Sĩ số lớp (Capacity Limit)', () => {
    it('should throw 400 error if class is already full (Capacity Limit Reached)', async () => {
      const learnerId = 'learner-1';
      const classId = 'class-capacity-1';

      // Mock Class Data: Capacity = 1, Status = UPCOMING
      (ClassRepository.getClassById as jest.Mock).mockResolvedValue({
        id: classId,
        course_id: 'course-1',
        capacity: 1,
        status: 'UPCOMING'
      });

      // Mock Learner is not enrolled yet
      (EnrollmentRepository.checkEnrollmentExists as jest.Mock).mockResolvedValue(false);
      (EnrollmentRepository.checkEnrollmentInCourse as jest.Mock).mockResolvedValue(false);

      // Mock current enrollments count = 1 (meaning it is FULL)
      (EnrollmentRepository.countClassEnrollments as jest.Mock).mockResolvedValue(1);

      await expect(EnrollmentService.enrollLearner(learnerId, { class_id: classId }))
        .rejects
        .toEqual(expect.objectContaining({ status: 400, message: 'Class is full' }));
    });

    it('should successfully enroll if class is not full', async () => {
      const learnerId = 'learner-2';
      const classId = 'class-capacity-2';

      // Mock Class Data: Capacity = 2
      (ClassRepository.getClassById as jest.Mock).mockResolvedValue({
        id: classId,
        course_id: 'course-1',
        capacity: 2,
        status: 'UPCOMING'
      });

      // Mock Learner is not enrolled yet
      (EnrollmentRepository.checkEnrollmentExists as jest.Mock).mockResolvedValue(false);
      (EnrollmentRepository.checkEnrollmentInCourse as jest.Mock).mockResolvedValue(false);

      // Mock current enrollments count = 1 (1 < 2 -> NOT FULL)
      (EnrollmentRepository.countClassEnrollments as jest.Mock).mockResolvedValue(1);

      // Mock successful enrollment
      (EnrollmentRepository.createEnrollmentAtomic as jest.Mock).mockResolvedValue({
        id: 'enrollment-1',
        learner_id: learnerId,
        class_id: classId,
        status: 'ACTIVE'
      });

      const result = await EnrollmentService.enrollLearner(learnerId, { class_id: classId });
      expect(result).toHaveProperty('id', 'enrollment-1');
      expect(EnrollmentRepository.createEnrollmentAtomic).toHaveBeenCalledWith(learnerId, classId, 2);
    });

    it('should throw 400 error if learner is already enrolled in another class of the same course', async () => {
      const learnerId = 'learner-3';
      const classId = 'class-capacity-3';

      // Mock Class Data
      (ClassRepository.getClassById as jest.Mock).mockResolvedValue({
        id: classId,
        course_id: 'course-same',
        capacity: 10,
        status: 'UPCOMING'
      });

      // Mock Learner is not in THIS class, but IS in another class of the SAME course
      (EnrollmentRepository.checkEnrollmentExists as jest.Mock).mockResolvedValue(false);
      (EnrollmentRepository.checkEnrollmentInCourse as jest.Mock).mockResolvedValue(true);

      await expect(EnrollmentService.enrollLearner(learnerId, { class_id: classId }))
        .rejects
        .toEqual(expect.objectContaining({ status: 400, message: 'Learner is already enrolled in another class of this course' }));
    });
  });
});
