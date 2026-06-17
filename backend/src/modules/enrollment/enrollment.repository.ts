import { supabaseAdmin } from '../../configs/supabase';
import { Enrollment } from './enrollment.model';

export class EnrollmentRepository {
  static async createEnrollment(learnerId: string, classId: string): Promise<Enrollment> {
    // Check if any record exists (ACTIVE or CANCELED)
    const { data: existing, error: existErr } = await supabaseAdmin
      .from('enrollments')
      .select('id, status')
      .eq('learner_id', learnerId)
      .eq('class_id', classId)
      .maybeSingle();

    if (existing) {
      if (existing.status === 'ACTIVE') throw new Error('Already enrolled');
      // If CANCELED, update it back to ACTIVE
      const { data, error } = await supabaseAdmin
        .from('enrollments')
        .update({ status: 'ACTIVE', enrollment_date: new Date().toISOString() })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

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

  static async updateEnrollmentStatus(id: string, status: 'ACTIVE' | 'CANCELED'): Promise<Enrollment> {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .update({ status })
      .eq('id', id)
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
      .eq('status', 'ACTIVE')
      .maybeSingle();

    if (error) throw error;
    return !!data;
  }

  static async checkEnrollmentInCourse(learnerId: string, courseId: string): Promise<boolean> {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .select('id, classes!inner(course_id)')
      .eq('learner_id', learnerId)
      .eq('classes.course_id', courseId)
      .eq('status', 'ACTIVE')
      .limit(1)
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
          classroom:classroom!classroom_id(id, room_name),
          class_sessions:class_sessions(slot, date)
        )
      `)
      .eq('learner_id', learnerId)
      .order('enrollment_date', { ascending: false });

    if (error) throw error;
    return data;
  }
}
