import { supabaseAdmin } from '../../configs/supabase';
import { CacheService } from '../../utils/cache';

import { Classroom, ClassroomMaintenance, CreateClassroomDTO, UpdateClassroomDTO, MaintenanceDTO } from './classroom.model';

export const ClassroomRepository = {
  async findAll(): Promise<{ classrooms: Classroom[], maintenance: ClassroomMaintenance[] }> {
    return await CacheService.getOrSet('classrooms', async () => {
      const { data: classrooms, error: err1 } = await supabaseAdmin
        .from('classroom')
        .select('*')
        .order('room_name', { ascending: true });
      
      if (err1) throw err1;

      const { data: maintenance, error: err2 } = await supabaseAdmin
        .from('classroom_maintenance')
        .select('*');

      if (err2) throw err2;

      return { classrooms: classrooms as Classroom[], maintenance: maintenance as ClassroomMaintenance[] };
    });
  },

  async findById(id: string): Promise<{ classroom: Classroom, maintenance: ClassroomMaintenance | null }> {
    const { data: classroom, error: err1 } = await supabaseAdmin
      .from('classroom')
      .select('*')
      .eq('id', id)
      .single();

    if (err1) throw err1;

    let maintenanceData = null;
    if (classroom.status === 'MAINTENANCE') {
        const { data: maintenance, error: err2 } = await supabaseAdmin
            .from('classroom_maintenance')
            .select('*')
            .eq('classroom_id', id)
            .limit(1)
            .single();
        if (!err2) {
            maintenanceData = maintenance;
        }
    }

    return { classroom: classroom as Classroom, maintenance: maintenanceData as ClassroomMaintenance | null };
  },

  async findByRoomName(roomName: string, excludeId?: string) {
    let query = supabaseAdmin
      .from('classroom')
      .select('id')
      .ilike('room_name', roomName);
      
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query.limit(1);
    if (error) throw error;
    
    return data && data.length > 0 ? data[0] : null;
  },

  async create(data: CreateClassroomDTO, maintenanceData?: MaintenanceDTO): Promise<{ classroom: Classroom, maintenance: ClassroomMaintenance | null }> {
    const { data: newClassroom, error } = await supabaseAdmin
      .from('classroom')
      .insert([{
          room_name: data.room_name,
          capacity: data.capacity,
          status: data.status,
      }])
      .select()
      .single();

    if (error) {
        if (error.code === '23505') {
            const roomNumber = data.room_name.replace(/^Room\s+/i, '');
            throw new Error(`Room '${roomNumber}' already exists.`);
        }
        throw error;
    }

    let newMaintenance = null;
    if (data.status === 'MAINTENANCE' && maintenanceData) {
        const { data: maint, error: err2 } = await supabaseAdmin
            .from('classroom_maintenance')
            .insert([{
                classroom_id: newClassroom.id,
                maintenance_date: maintenanceData.maintenance_date,
                start_time: maintenanceData.start_time,
                end_time: maintenanceData.end_time,
                note: maintenanceData.note
            }])
            .select()
            .single();
        if (!err2) newMaintenance = maint;
    }

    return { classroom: newClassroom as Classroom, maintenance: newMaintenance as ClassroomMaintenance | null };
  },

  async update(id: string, data: UpdateClassroomDTO, maintenanceData?: MaintenanceDTO): Promise<{ classroom: Classroom, maintenance: ClassroomMaintenance | null }> {
    const { data: updatedClassroom, error } = await supabaseAdmin
      .from('classroom')
      .update({
          room_name: data.room_name,
          capacity: data.capacity,
          status: data.status,
          updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    let updatedMaintenance = null;

    // Delete existing maintenance if any to reset
    await supabaseAdmin
        .from('classroom_maintenance')
        .delete()
        .eq('classroom_id', id);

    if (data.status === 'MAINTENANCE' && maintenanceData) {
        const { data: maint, error: err2 } = await supabaseAdmin
            .from('classroom_maintenance')
            .insert([{
                classroom_id: id,
                maintenance_date: maintenanceData.maintenance_date,
                start_time: maintenanceData.start_time,
                end_time: maintenanceData.end_time,
                note: maintenanceData.note
            }])
            .select()
            .single();
        if (!err2) updatedMaintenance = maint;
    }

    return { classroom: updatedClassroom as Classroom, maintenance: updatedMaintenance as ClassroomMaintenance | null };
  },

  async delete(id: string) {
    // Delete maintenance first due to foreign key constraints
    await supabaseAdmin
        .from('classroom_maintenance')
        .delete()
        .eq('classroom_id', id);

    const { error } = await supabaseAdmin
      .from('classroom')
      .delete()
      .eq('id', id);

    if (error) throw error;
    CacheService.invalidate('classrooms');
    return true;
  }
};
