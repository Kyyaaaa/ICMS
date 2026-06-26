import { supabaseAdmin as supabase } from '../../configs/supabase';
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

  static async deleteClassSessions(classId: string) {
    const { error } = await supabase
      .from('class_sessions')
      .delete()
      .eq('class_id', classId);
      
    if (error) throw new Error(error.message);
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
                classroom:classroom!classroom_id(id, room_name),
                class_sessions(slot, date),
                students:enrollments(id, status)
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
                classroom:classroom!classroom_id(id, room_name),
                attendances(id)
            `)
            .eq('class_id', id)
            .order('date', { ascending: true })
            .order('slot', { ascending: true });

        if (sessionsError) throw new Error(sessionsError.message);

        // Fetch enrolled students
        const { data: students } = await supabase
            .from('enrollments')
            .select(`
                id,
                enrollment_date,
                account:account!learner_id(id, full_name, email, account_code)
            `)
            .eq('class_id', id)
            .eq('status', 'ACTIVE');

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

  static async deleteClass(id: string) {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  static async deleteClassesByCourseId(courseId: string) {
    // This will also delete class_sessions via CASCADE constraint in DB
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('course_id', courseId);

    if (error) throw new Error(error.message);
    return true;
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

  static async checkTutorConflict(tutorId: string, date: string, slot: string, excludeSessionId?: string, excludeClassId?: string) {
    let query = supabase
      .from('class_sessions')
      .select('id')
      .eq('tutor_id', tutorId)
      .eq('date', date)
      .eq('slot', slot);
      
    if (excludeSessionId) {
      query = query.neq('id', excludeSessionId);
    }
    if (excludeClassId) {
      query = query.neq('class_id', excludeClassId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    return data && data.length > 0;
  }

  static async checkClassroomConflict(classroomId: string, date: string, slot: string, excludeSessionId?: string, excludeClassId?: string) {
    let query = supabase
      .from('class_sessions')
      .select('id')
      .eq('classroom_id', classroomId)
      .eq('date', date)
      .eq('slot', slot);
      
    if (excludeSessionId) {
      query = query.neq('id', excludeSessionId);
    }
    if (excludeClassId) {
      query = query.neq('class_id', excludeClassId);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    return data && data.length > 0;
  }

  static async getOccupiedSessions(filters: { tutor_id?: string, classroom_id?: string, date?: string, slot?: string, start_date?: string, exclude_class_id?: string }) {
    let query = supabase
      .from('class_sessions')
      .select('id, class_id, date, slot, tutor_id, classroom_id');

    if (filters.tutor_id) query = query.eq('tutor_id', filters.tutor_id);
    if (filters.classroom_id) query = query.eq('classroom_id', filters.classroom_id);
    if (filters.date) query = query.eq('date', filters.date);
    if (filters.slot) query = query.eq('slot', filters.slot);
    if (filters.start_date) query = query.gte('date', filters.start_date);
    if (filters.exclude_class_id) query = query.neq('class_id', filters.exclude_class_id);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    
    return data || [];
  }
}
