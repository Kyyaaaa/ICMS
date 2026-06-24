import { supabaseAdmin } from '../../configs/supabase';
import { Attendance } from './session.model';

export class SessionRepository {
  static async getSessionsByDateRangeAndRole(userId: string, role: string, startDate?: string, endDate?: string) {
    let query = supabaseAdmin
      .from('class_sessions')
      .select(`
        *,
        class:classes!class_id(id, name, course_id),
        tutor:account!tutor_id(id, full_name, email),
        classroom:classroom!classroom_id(id, room_name, capacity)
      `);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    if (role === 'TUTOR') {
      query = query.eq('tutor_id', userId);
    } else if (role === 'LEARNER') {
      // Fetch enrolled class ids first
      const { data: enrollments } = await supabaseAdmin
        .from('enrollments')
        .select('class_id')
        .eq('learner_id', userId)
        .eq('status', 'ACTIVE');
      
      const classIds = enrollments ? enrollments.map(e => e.class_id) : [];
      if (classIds.length === 0) {
        return [];
      }
      query = query.in('class_id', classIds);
    }

    const { data, error } = await query.order('date', { ascending: true }).order('slot', { ascending: true });

    if (error) throw error;
    
    // For learners, we also want to return their attendance status if available
    if (role === 'LEARNER' && data && data.length > 0) {
      const sessionIds = data.map(s => s.id);
      const { data: attendances } = await supabaseAdmin
        .from('attendances')
        .select('session_id, status')
        .eq('learner_id', userId)
        .in('session_id', sessionIds);
        
      if (attendances) {
        const attMap = new Map(attendances.map(a => [a.session_id, a.status]));
        return data.map(s => ({
          ...s,
          learner_attendance: attMap.get(s.id) || 'NOT_YET'
        }));
      }
    }

    // For tutors, check if attendance has been taken for the session
    if (role === 'TUTOR' && data && data.length > 0) {
      const sessionIds = data.map(s => s.id);
      const { data: attendances } = await supabaseAdmin
        .from('attendances')
        .select('session_id, status')
        .in('session_id', sessionIds)
        .neq('status', 'NOT_YET');
        
      if (attendances) {
        const takenSet = new Set(attendances.map(a => a.session_id));
        return data.map(s => ({
          ...s,
          is_attendance_taken: takenSet.has(s.id)
        }));
      } else {
        return data.map(s => ({ ...s, is_attendance_taken: false }));
      }
    }

    return data;
  }

  static async getSessionById(sessionId: string) {
    const { data, error } = await supabaseAdmin
      .from('class_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error) throw error;
    return data;
  }

  static async getSessionAttendance(sessionId: string) {
    const { data, error } = await supabaseAdmin
      .from('attendances')
      .select(`
        *,
        account:account!learner_id(id, full_name, email, account_code)
      `)
      .eq('session_id', sessionId);

    if (error) throw error;
    return data;
  }

  static async getClassEnrollments(classId: string) {
    const { data, error } = await supabaseAdmin
      .from('enrollments')
      .select(`
        learner_id,
        account:account!learner_id(id, full_name, email, account_code)
      `)
      .eq('class_id', classId)
      .eq('status', 'ACTIVE');

    if (error) throw error;
    return data;
  }

  static async bulkUpsertAttendance(records: Attendance[]) {
    // Supabase upsert requires unique constraints. We have a unique constraint on (session_id, learner_id).
    // Note: To upsert correctly by a unique constraint other than primary key, we specify `onConflict: 'session_id,learner_id'`
    const { data, error } = await supabaseAdmin
      .from('attendances')
      .upsert(records, { onConflict: 'session_id,learner_id' })
      .select(`
        *,
        account:account!learner_id(id, full_name, email, account_code)
      `);

    if (error) throw error;
    return data;
  }
}
