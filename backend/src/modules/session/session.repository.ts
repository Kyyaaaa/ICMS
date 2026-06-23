import { supabaseAdmin } from '../../configs/supabase';
import { Attendance } from './session.model';

export class SessionRepository {
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
