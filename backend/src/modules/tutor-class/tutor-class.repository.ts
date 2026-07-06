import { supabaseAdmin } from '../../configs/supabase';
import { Assessment, StudentGrade } from './tutor-class.model';

export class TutorClassRepository {
  static async checkTutorOwnership(classId: string): Promise<string | null> {
    const { data, error } = await supabaseAdmin
      .from('classes')
      .select('tutor_id')
      .eq('id', classId)
      .single();
    if (error || !data) return null;
    return data.tutor_id;
  }

  static async getGradingStatus(classId: string): Promise<string> {
    const { data } = await supabaseAdmin
      .from('classes')
      .select('grading_status')
      .eq('id', classId)
      .single();
    return data?.grading_status || 'PENDING';
  }

  static async getAssessments(classId: string): Promise<Assessment[]> {
    const { data, error } = await supabaseAdmin
      .from('assessments')
      .select('*')
      .eq('class_id', classId)
      .order('order_index', { ascending: true });
    if (error) throw new Error(error.message);
    return data as Assessment[];
  }

  static async getStudentsWithGrades(classId: string) {
    // Get all ACTIVE enrollments for this class
    const { data: enrollments, error: enrollmentsError } = await supabaseAdmin
      .from('enrollments')
      .select(`
        learner_id,
        account:learner_id (
          id,
          full_name,
          email
        )
      `)
      .eq('class_id', classId)
      .eq('status', 'ACTIVE');
      
    if (enrollmentsError) throw new Error(enrollmentsError.message);

    if (!enrollments || enrollments.length === 0) {
      return { enrollments: [], grades: [] };
    }

    const learnerIds = enrollments.map(e => e.learner_id);

    // Get grades for these students, only for assessments of this class
    const { data: grades, error: gradesError } = await supabaseAdmin
      .from('student_grades')
      .select(`
        *,
        assessments!inner(class_id)
      `)
      .eq('assessments.class_id', classId)
      .in('learner_id', learnerIds);

    if (gradesError) throw new Error(gradesError.message);

    return { enrollments, grades: (grades || []) as StudentGrade[] };
  }

  static async deleteAssessments(assessmentIds: string[]) {
    if (assessmentIds.length === 0) return;
    const { error } = await supabaseAdmin
      .from('assessments')
      .delete()
      .in('id', assessmentIds);
    if (error) throw new Error(error.message);
  }

  static async upsertAssessments(assessments: Partial<Assessment>[]): Promise<Assessment[]> {
    if (assessments.length === 0) return assessments as Assessment[];
    // We only upsert specific columns to avoid errors if id is missing or extra data is passed
    const { data, error } = await supabaseAdmin
      .from('assessments')
      .upsert(assessments, { onConflict: 'id' })
      .select();
    if (error) throw new Error(error.message);
    return data as Assessment[];
  }

  static async upsertGrades(grades: StudentGrade[]): Promise<StudentGrade[]> {
    if (grades.length === 0) return grades;
    const { data, error } = await supabaseAdmin
      .from('student_grades')
      .upsert(grades, { onConflict: 'assessment_id, learner_id' })
      .select();
    if (error) throw new Error(error.message);
    return data as StudentGrade[];
  }

  static async updateClassGradingStatus(classId: string, status: string, publishedGradebook?: any) {
    const updateData: any = { grading_status: status };
    if (publishedGradebook !== undefined) {
      updateData.published_gradebook = publishedGradebook;
    }
    const { error } = await supabaseAdmin
      .from('classes')
      .update(updateData)
      .eq('id', classId);
    if (error) throw new Error(error.message);
  }
}
