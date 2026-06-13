import { supabaseAdmin } from '../../configs/supabase';
import { AvailabilityResponse, TutorAvailabilityProfile } from './available-time-slot.model';

export class AvailableTimeSlotRepository {
  /**
   * Retrieves the availability status and slots for a given tutor
   */
  static async getAvailability(tutorId: string): Promise<AvailabilityResponse> {
    // Get status
    const { data: statusData, error: statusError } = await supabaseAdmin
      .from('tutor_availability_status')
      .select('status')
      .eq('tutor_id', tutorId)
      .maybeSingle();

    if (statusError) throw statusError;

    const status = statusData?.status || 'draft';

    // Get slots
    const { data: slotsData, error: slotsError } = await supabaseAdmin
      .from('tutor_available_time_slots')
      .select('slot_key')
      .eq('tutor_id', tutorId);

    if (slotsError) throw slotsError;

    const slots = slotsData ? slotsData.map((s: any) => s.slot_key) : [];

    return { status: status as 'draft' | 'submitted', slots };
  }

  /**
   * Updates status and completely replaces the tutor's slots via Postgres RPC
   */
  static async submitAvailability(tutorId: string, slots: string[], status: 'draft' | 'submitted' = 'submitted'): Promise<void> {
    const { error } = await supabaseAdmin.rpc('update_tutor_availability', {
      p_tutor_id: tutorId,
      p_slots: slots,
      p_status: status
    });

    if (error) {
      console.error("RPC Error updating availability:", error);
      throw new Error(`Database error updating availability: ${error.message}`);
    }
  }

  /**
   * Retrieves all tutors along with their availability status and slots (for Staff)
   */
  static async getAllTutorsAvailability(): Promise<TutorAvailabilityProfile[]> {
    const { data: accounts, error } = await supabaseAdmin
      .from('account')
      .select(`
        id,
        account_code,
        full_name,
        avatar_url,
        roles!inner(name),
        tutor_availability_status(status),
        tutor_available_time_slots(slot_key)
      `)
      .eq('roles.name', 'TUTOR')
      .eq('status', 'ACTIVE');

    if (error) throw error;

    return accounts.map((acc: any) => {
      // Handle the 1-to-1 relationship which might be an array or object depending on PostgREST
      let statusValue = 'draft';
      if (acc.tutor_availability_status) {
        if (Array.isArray(acc.tutor_availability_status)) {
            statusValue = acc.tutor_availability_status[0]?.status || 'draft';
        } else {
            statusValue = acc.tutor_availability_status.status || 'draft';
        }
      }

      const slotsArray = acc.tutor_available_time_slots 
        ? acc.tutor_available_time_slots.map((s: any) => s.slot_key) 
        : [];

      return {
        id: acc.id,
        account_code: acc.account_code || acc.id,
        name: acc.full_name || 'Unknown Tutor',
        avatar_url: acc.avatar_url,
        status: statusValue as 'draft' | 'submitted',
        slots: slotsArray,
      };
    });
  }
}
