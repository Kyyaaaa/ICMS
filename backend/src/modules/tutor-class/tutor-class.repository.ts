import { supabaseAdmin } from '../../configs/supabase';

export class TutorClassRepository {
  static async getAssessments(classId: string) {
    const { data, error } = await supabaseAdmin
      .from('assessments')
      .select('*')
      .eq('class_id', classId)
      .order('order_index', { ascending: true });
    if (error) throw new Error(error.message);
    return data;
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

    return { enrollments, grades: grades || [] };
  }

  static async deleteAssessments(assessmentIds: string[]) {
    if (assessmentIds.length === 0) return;
    const { error } = await supabaseAdmin
      .from('assessments')
      .delete()
      .in('id', assessmentIds);
    if (error) throw new Error(error.message);
  }

  static async upsertAssessments(assessments: any[]) {
    if (assessments.length === 0) return assessments;
    // We only upsert specific columns to avoid errors if id is missing or extra data is passed
    const { data, error } = await supabaseAdmin
      .from('assessments')
      .upsert(assessments, { onConflict: 'id' })
      .select();
    if (error) throw new Error(error.message);
    return data;
  }

  static async upsertGrades(grades: any[]) {
    if (grades.length === 0) return grades;
    const { data, error } = await supabaseAdmin
      .from('student_grades')
      .upsert(grades, { onConflict: 'assessment_id, learner_id' })
      .select();
    if (error) throw new Error(error.message);
    return data;
  }
}
