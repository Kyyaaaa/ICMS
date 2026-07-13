import { supabaseAdmin } from '../../configs/supabase';
import pool from '../../configs/database';
import { Enrollment } from './enrollment.model';

export class EnrollmentRepository {
  static async createEnrollmentAtomic(learnerId: string, classId: string, maxCapacity: number): Promise<Enrollment> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Lock the class row to prevent concurrent enrollments exceeding capacity
      await client.query('SELECT id FROM classes WHERE id = $1 FOR UPDATE', [classId]);

      // 2. Count current active enrollments
      const countRes = await client.query(
        'SELECT count(*) FROM enrollments WHERE class_id = $1 AND status = $2',
        [classId, 'ACTIVE']
      );
      const currentEnrollments = parseInt(countRes.rows[0].count, 10);

      if (currentEnrollments >= maxCapacity) {
        throw new Error('Class is full');
      }

      // 3. Check existing enrollment for this learner
      const existingRes = await client.query(
        'SELECT id, status FROM enrollments WHERE learner_id = $1 AND class_id = $2',
        [learnerId, classId]
      );
      
      let finalEnrollment: any;

      if (existingRes.rows.length > 0) {
        const existing = existingRes.rows[0];
        if (existing.status === 'ACTIVE') {
          throw new Error('Already enrolled');
        }
        // If CANCELED, update it back to ACTIVE
        const updateRes = await client.query(
          'UPDATE enrollments SET status = $1, enrollment_date = NOW() WHERE id = $2 RETURNING *',
          ['ACTIVE', existing.id]
        );
        finalEnrollment = updateRes.rows[0];
      } else {
        // Insert new enrollment
        const insertRes = await client.query(
          'INSERT INTO enrollments (learner_id, class_id, status) VALUES ($1, $2, $3) RETURNING *',
          [learnerId, classId, 'ACTIVE']
        );
        finalEnrollment = insertRes.rows[0];
      }

      await client.query('COMMIT');
      return finalEnrollment;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async updateEnrollmentStatus(id: string, status: 'ACTIVE' | 'CANCELED'): Promise<Enrollment> {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        const notFoundErr: any = new Error('Enrollment not found');
        notFoundErr.status = 404;
        throw notFoundErr;
      }
      throw error;
    }
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

  static async countEnrollmentsByCourseId(courseId: string): Promise<number> {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .select('id, classes!inner(course_id)')
      .eq('classes.course_id', courseId)
      .eq('status', 'ACTIVE');

    if (error) throw error;
    return data ? data.length : 0;
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
      .eq('status', 'ACTIVE')
      .order('enrollment_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async checkRegistrationConflicts(learnerId: string, classId: string, targetCourseId: string) {
    // Fetch all active enrollments for the learner
    const { data: activeEnrollments, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .select(`
        class_id,
        classes (
          name,
          course_id,
          class_sessions (
            date,
            slot
          )
        )
      `)
      .eq('learner_id', learnerId)
      .eq('status', 'ACTIVE');

    if (enrollError) throw new Error(enrollError.message);

    if (!activeEnrollments || activeEnrollments.length === 0) return;

    for (const enrollment of activeEnrollments) {
      if (enrollment.class_id === classId) {
        throw new Error('You are already enrolled in this class.');
      }
      
      const enrolledClass = enrollment.classes as any;
      if (enrolledClass?.course_id === targetCourseId) {
        throw new Error('You are already enrolled in another class for this course.');
      }
    }

    // Fetch sessions of the target class to check schedule overlaps
    const { data: targetSessions, error: sessionError } = await supabaseAdmin
      .from('class_sessions')
      .select('date, slot')
      .eq('class_id', classId);

    if (sessionError) throw new Error(sessionError.message);
    if (!targetSessions || targetSessions.length === 0) return;

    // Check for overlaps
    for (const targetSession of targetSessions) {
      for (const enrollment of activeEnrollments) {
        const enrolledClass = enrollment.classes as any;
        const enrolledSessions = enrolledClass?.class_sessions || [];
        
        for (const enrolledSession of enrolledSessions) {
          if (targetSession.date === enrolledSession.date && targetSession.slot === enrolledSession.slot) {
            throw new Error(`Schedule overlap: This class overlaps with your enrolled class '${enrolledClass.name}' on ${targetSession.date} at slot ${targetSession.slot}.`);
          }
        }
      }
    }
  }

  static async cancelEnrollmentByLearnerAndClass(learnerId: string, classId: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from('enrollments')
      .update({ status: 'CANCELED' })
      .eq('learner_id', learnerId)
      .eq('class_id', classId);

    if (error) throw error;
    return true;
  }

  static async getLearnerAttendance(learnerId: string, classId: string) {
    const { data: sessions, error } = await supabaseAdmin
      .from('class_sessions')
      .select(`
        id, session_number, date, slot,
        tutor:account!tutor_id(id, full_name),
        classroom:classroom!classroom_id(id, room_name)
      `)
      .eq('class_id', classId)
      .order('session_number', { ascending: true });
      
    if (error) throw error;
    if (!sessions || sessions.length === 0) return [];
    
    const sessionIds = sessions.map(s => s.id);
    const { data: attendances } = await supabaseAdmin
      .from('attendances')
      .select('session_id, status')
      .eq('learner_id', learnerId)
      .in('session_id', sessionIds);
      
    const attMap = new Map((attendances || []).map(a => [a.session_id, a.status]));
    
    return sessions.map(s => {
       const status = attMap.get(s.id) || 'NOT_YET';
       return {
         id: s.id,
         session_number: s.session_number,
         date: s.date,
         time: s.slot, 
         tutor: s.tutor ? (s.tutor as any).full_name : 'TBA',
         room: s.classroom ? (s.classroom as any).room_name : 'TBA',
         status: status.toLowerCase()
       };
    });
  }
}
