import { TutorClassRepository } from './tutor-class.repository';
import { GradebookData, SaveGradebookPayload } from './tutor-class.model';
import * as crypto from 'crypto';

export class TutorClassService {
  static async getGradebook(classId: string): Promise<GradebookData> {
    const assessments = await TutorClassRepository.getAssessments(classId);
    const { enrollments, grades } = await TutorClassRepository.getStudentsWithGrades(classId);
    
    // Fetch grading_status
    const grading_status = await TutorClassRepository.getGradingStatus(classId);

    // Map the enrollments to StudentWithGrades format
    const students = enrollments.map((enrollment: any) => {
      const studentGrades = grades.filter((g: any) => g.learner_id === enrollment.learner_id);
      
      const gradesMap: Record<string, any> = {};
      studentGrades.forEach((g: any) => {
        gradesMap[g.assessment_id] = {
          score: g.score,
          feedback: g.feedback
        };
      });

      return {
        id: enrollment.learner_id,
        name: enrollment.account?.full_name,
        email: enrollment.account?.email,
        grades: gradesMap
      };
    });

    return {
      assessments,
      students,
      grading_status
    };
  }

  static async saveGradebook(classId: string, payload: SaveGradebookPayload): Promise<boolean> {
    const { deletedAssessmentIds = [], upsertAssessments = [], upsertGrades = [] } = payload;

    // 1. Delete assessments
    if (deletedAssessmentIds.length > 0) {
      await TutorClassRepository.deleteAssessments(deletedAssessmentIds);
    }

    // 2. Upsert assessments
    // Make sure all assessments have class_id
    const preparedAssessments = upsertAssessments.map((a: any) => ({
      id: a.id || crypto.randomUUID(),
      class_id: classId,
      name: a.name,
      order_index: a.order_index
    }));

    if (preparedAssessments.length > 0) {
      await TutorClassRepository.upsertAssessments(preparedAssessments);
    }

    // 3. Upsert grades
    // Validate scores strictly
    const preparedGrades = upsertGrades.map((g: any) => {
      const score = parseFloat(g.score);
      if (isNaN(score) || typeof score !== 'number' || score < 0 || score > 9) {
        throw new Error('Điểm số phải là số thập phân nằm trong khoảng từ 0 đến 9');
      }

      return {
        assessment_id: g.assessment_id,
        learner_id: g.learner_id,
        score: score,
        feedback: g.feedback
      };
    });

    if (preparedGrades.length > 0) {
      await TutorClassRepository.upsertGrades(preparedGrades);
    }

    return true;
  }

  static async publishGrades(classId: string): Promise<boolean> {
    const gradebook = await TutorClassService.getGradebook(classId);
    await TutorClassRepository.updateClassGradingStatus(classId, 'PUBLISHED', gradebook);
    return true;
  }
}
