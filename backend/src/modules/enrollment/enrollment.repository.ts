import { supabaseAdmin } from '../../configs/supabase';
import { Enrollment } from './enrollment.model';

export class EnrollmentRepository {
  static async createEnrollment(learnerId: string, classId: string): Promise<Enrollment> {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .insert({
        learner_id: learnerId,
        class_id: classId,
        status: 'ACTIVE'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async countClassEnrollments(classId: string): Promise<number> {
    const { count, error } = await supabaseAdmin
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('class_id', classId)
      .eq('status', 'ACTIVE');

    if (error) throw error;
    return count || 0;
  }

  static async checkEnrollmentExists(learnerId: string, classId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .select('id')
      .eq('learner_id', learnerId)
      .eq('class_id', classId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  static async getLearnerEnrollments(learnerId: string): Promise<any[]> {
    // Join với bảng classes để lấy thông tin lớp học, và course để lấy tên khoá học
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .select(`
        *,
        classes (
          id,
          name,
          start_date,
          end_date,
          status,
          courses (
            id,
            title,
            code
          ),
          tutor:account!tutor_id(id, full_name, email),
          classroom:classroom!classroom_id(id, room_name)
        )
      `)
      .eq('learner_id', learnerId)
      .order('enrollment_date', { ascending: false });

    if (error) throw error;
    return data;
  }
}
