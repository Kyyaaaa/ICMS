import { LearnerRepository } from './learner.repository';
import { CreateLearnerInput, UpdateLearnerInput } from './learner.model';

export class LearnerService {
  /**
   * Lấy danh sách tất cả học viên
   */
  static async getAll() {
    return await LearnerRepository.getAll();
  }

  /**
   * Lấy chi tiết 1 học viên
   */
  static async getById(id: string) {
    return await LearnerRepository.getById(id);
  }

  /**
   * Tạo học viên mới (Dùng cho Admin/Staff)
   */
  static async create(learnerData: CreateLearnerInput) {
    return await LearnerRepository.create(learnerData);
  }

  /**
   * Cập nhật thông tin học viên
   */
  static async update(id: string, updateData: UpdateLearnerInput) {
    await LearnerRepository.update(id, updateData);
    return this.getById(id);
  }

  /**
   * Lấy Transcript (bảng điểm)
   */
  static async getTranscript(learnerId: string) {
    const { enrollments } = await LearnerRepository.getTranscript(learnerId);

    const transcript = enrollments.map((e: any) => {
      const cls = e.classes;
      
      const gradebook = cls.published_gradebook || { assessments: [], students: [] };
      const classAssessments = gradebook.assessments || [];
      const students = gradebook.students || [];
      
      const studentData = students.find((s: any) => s.id === learnerId);
      const studentGrades = studentData?.grades || {};

      const componentGrades: any[] = [];
      let totalScore = 0;
      let scoreCount = 0;

      classAssessments.forEach((a: any) => {
        const grade = studentGrades[a.id];
        let score = 0;
        
        if (grade && grade.score !== null && grade.score !== undefined) {
          score = parseFloat(grade.score);
          totalScore += score;
          scoreCount++;
        }
        
        componentGrades.push({
          assessment_name: a.name || a.title,
          score: score,
          feedback: grade?.feedback || ''
        });
      });

      // Calculate overall band (average)
      const overallScore = scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : '0.0';

      return {
        class_id: cls.id,
        class_name: cls.name,
        course_name: cls.courses?.title,
        course_code: cls.courses?.code,
        overall_score: parseFloat(overallScore),
        details: componentGrades
      };
    });

    return transcript;
  }
}
