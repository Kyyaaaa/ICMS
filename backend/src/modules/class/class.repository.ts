import { supabase } from '../../configs/supabase';
import { CreateClassDTO, UpdateClassDTO, UpdateClassSessionDTO } from './class.model';

export class ClassRepository {
  static async createClass(data: CreateClassDTO) {
    const classData = {
      name: data.name,
      course_id: data.course_id,
      tutor_id: data.tutor_id,
      classroom_id: data.classroom_id,
      start_date: data.start_date,
      end_date: data.end_date,
      capacity: data.capacity,
      status: 'UPCOMING'
    };

    const { data: result, error } = await supabase
      .from('classes')
      .insert([classData])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return result;
  }

  static async insertClassSessions(sessions: any[]) {
    const { data, error } = await supabase
      .from('class_sessions')
      .insert(sessions)
      .select();

    if (error) throw new Error(error.message);
    return data;
  }

  static async getCourseById(courseId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

    static async getClasses(statusFilter?: string, courseId?: string, tutorId?: string, page: number = 1, limit: number = 50) {
        let query = supabase
            .from('classes')
            .select(`
                *,
                courses(id, title, code),
                tutor:account!tutor_id(id, full_name, email),
                classroom:classroom!classroom_id(id, room_name)
            `, { count: 'exact' });

        if (statusFilter) {
            query = query.eq('status', statusFilter);
        }
        if (courseId) {
            query = query.eq('course_id', courseId);
        }
        if (tutorId) {
            query = query.eq('tutor_id', tutorId);
        }

        const start = (page - 1) * limit;
        const end = start + limit - 1;

        query = query.range(start, end).order('created_at', { ascending: false });

        const { data, error, count } = await query;
        if (error) throw new Error(error.message);

        return { data, total: count || 0 };
    }

    static async getClassById(id: string) {
        const { data: classData, error: classError } = await supabase
            .from('classes')
            .select(`
                *,
                courses(id, title, code),
                tutor:account!tutor_id(id, full_name, email),
                classroom:classroom!classroom_id(id, room_name)
            `)
            .eq('id', id)
            .single();

        if (classError) throw new Error(classError.message);

        const { data: sessions, error: sessionsError } = await supabase
            .from('class_sessions')
            .select(`
                *,
                tutor:account!tutor_id(id, full_name, email),
                classroom:classroom!classroom_id(id, room_name)
            `)
            .eq('class_id', id)
            .order('date', { ascending: true })
            .order('slot', { ascending: true });

        if (sessionsError) throw new Error(sessionsError.message);

        // Fetch enrolled students (placeholder, since we might not have an enrollments table fully mapped here, just attempt it if exists)
        const { data: students } = await supabase
            .from('enrollments')
            .select(`
                id,
                account:account!learner_id(id, full_name, email)
            `)
            .eq('class_id', id);

        return { ...classData, sessions: sessions || [], students: students || [] };
    }

  static async updateClass(id: string, updates: UpdateClassDTO) {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async updateClassSession(classId: string, sessionId: string, updates: UpdateClassSessionDTO) {
    const { data, error } = await supabase
      .from('class_sessions')
      .update(updates)
      .eq('id', sessionId)
      .eq('class_id', classId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  static async checkTutorConflict(tutorId: string, date: string, slot: string, excludeSessionId?: string) {
    let query = supabase
      .from('class_sessions')
      .select('id')
      .eq('tutor_id', tutorId)
      .eq('date', date)
      .eq('slot', slot);
      
    if (excludeSessionId) {
      query = query.neq('id', excludeSessionId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    return data && data.length > 0;
  }

  static async checkClassroomConflict(classroomId: string, date: string, slot: string, excludeSessionId?: string) {
    let query = supabase
      .from('class_sessions')
      .select('id')
      .eq('classroom_id', classroomId)
      .eq('date', date)
      .eq('slot', slot);
      
    if (excludeSessionId) {
      query = query.neq('id', excludeSessionId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    return data && data.length > 0;
  }
}
