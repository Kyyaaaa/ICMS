import { supabaseAdmin } from '../../configs/supabase';
import { AvailabilityResponse, TutorAvailabilityProfile } from './available-time-slot.model';

export class AvailableTimeSlotRepository {
  /**
   * Retrieves the availability status and slots for a given tutor
   */
  static async getAvailability(tutorId: string, cycleId: string): Promise<AvailabilityResponse> {
    // Get status
    const { data: statusData, error: statusError } = await supabaseAdmin
      .from('tutor_availability_status')
      .select('status')
      .eq('tutor_id', tutorId)
      .eq('cycle_id', cycleId)
      .maybeSingle();

    if (statusError) throw statusError;

    const status = statusData?.status || 'draft';

    // Get slots
    const { data: slotsData, error: slotsError } = await supabaseAdmin
      .from('tutor_available_time_slots')
      .select('slot_key')
      .eq('tutor_id', tutorId)
      .eq('cycle_id', cycleId);

    if (slotsError) throw slotsError;

    const slots = slotsData ? slotsData.map((s: any) => s.slot_key as string) : [];

    return { status: status as 'draft' | 'submitted', slots };
  }

  /**
   * Updates status and completely replaces the tutor's slots via Postgres RPC
   */
  static async submitAvailability(tutorId: string, cycleId: string, slots: string[], status: 'draft' | 'submitted' = 'submitted'): Promise<void> {
    const { error } = await supabaseAdmin.rpc('update_tutor_availability', {
      p_tutor_id: tutorId,
      p_cycle_id: cycleId,
      p_slots: slots,
      p_status: status
    });

    if (error) {
      console.error("RPC Error updating availability:", error);
      throw new Error(`Database error updating availability: ${error.message}`);
    }
  }

  /**
   * Retrieves all tutors along with their availability status and slots for a specific cycle
   */
  static async getAllTutorsAvailability(cycleId: string): Promise<TutorAvailabilityProfile[]> {
    // We cannot easily do an inner join on the cycle_id within the nested select if we want ALL active tutors,
    // so we fetch tutors first, then fetch their status/slots for the given cycle, or we use a custom query/RPC.
    // For simplicity, we fetch the data separately and merge it.

    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from('account')
      .select(`
        id,
        account_code,
        full_name,
        avatar_url,
        roles!inner(name)
      `)
      .eq('roles.name', 'TUTOR')
      .eq('status', 'ACTIVE');

    if (accountsError) throw accountsError;

    const { data: statuses, error: statusError } = await supabaseAdmin
      .from('tutor_availability_status')
      .select('tutor_id, status')
      .eq('cycle_id', cycleId);

    if (statusError) throw statusError;

    const { data: slots, error: slotsError } = await supabaseAdmin
      .from('tutor_available_time_slots')
      .select('tutor_id, slot_key')
      .eq('cycle_id', cycleId);

    if (slotsError) throw slotsError;

    return accounts.map((acc: any) => {
      const tutorStatus = statuses.find(s => s.tutor_id === acc.id);
      const tutorSlots = slots.filter(s => s.tutor_id === acc.id).map(s => s.slot_key as string);

      return {
        id: acc.id,
        account_code: acc.account_code || acc.id,
        name: acc.full_name || 'Unknown Tutor',
        avatar_url: acc.avatar_url,
        status: (tutorStatus?.status || 'draft') as 'draft' | 'submitted',
        slots: tutorSlots,
      };
    });
  }

  /**
   * Cycles Management
   */
  static async getCycles() {
    const { data, error } = await supabaseAdmin
      .from('availability_cycles')
      .select('*')
      .order('start_date', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getOrCreateCycleByMonth(month: number, year: number) {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const cycleName = `${monthNames[month - 1]} - ${year}`;
    
    const { data: existingCycle, error: fetchError } = await supabaseAdmin
      .from('availability_cycles')
      .select('*')
      .eq('name', cycleName)
      .single();

    if (existingCycle && !fetchError) {
      return existingCycle;
    }

    // Determine status based on current date
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    let status = 'OPEN';
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      status = 'COMPLETED';
    } else if (year === currentYear && month === currentMonth) {
      status = 'ACTIVE';
    }

    // Insert new cycle
    const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
    const endDate = new Date(Date.UTC(year, month, 0)).toISOString();

    const { data: newCycle, error: insertError } = await supabaseAdmin
      .from('availability_cycles')
      .insert({
        name: cycleName,
        start_date: startDate,
        end_date: endDate,
        status: status
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newCycle;
  }

  static async updateCycleStatus(cycleId: string, status: string) {
    const { data, error } = await supabaseAdmin
      .from('availability_cycles')
      .update({ status })
      .eq('id', cycleId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /**
   * Verifies if a tutor is available for specific slots in a given cycle.
   * Throws an error if they haven't submitted or are missing required slots.
   */
  static async checkTutorAvailabilityForSlots(tutorId: string, cycleName: string, requiredSlotKeys: string[]): Promise<boolean> {
    // 1. Get the cycle ID
    const { data: cycle, error: cycleError } = await supabaseAdmin
      .from('availability_cycles')
      .select('id')
      .eq('name', cycleName)
      .single();

    if (cycleError || !cycle) {
      throw new Error(`Availability cycle '${cycleName}' does not exist. Tutor hasn't registered for this month.`);
    }

    // 2. Check if tutor has officially submitted
    const { data: statusData, error: statusError } = await supabaseAdmin
      .from('tutor_availability_status')
      .select('status')
      .eq('tutor_id', tutorId)
      .eq('cycle_id', cycle.id)
      .single();

    if (statusError || !statusData || statusData.status !== 'submitted') {
      throw new Error(`Tutor has not officially submitted availability for cycle '${cycleName}'.`);
    }

    if (requiredSlotKeys.length === 0) return true;

    // 3. Fetch all slots and normalize them to handle legacy data (e.g. M1 -> slot1)
    const { data: slots, error: slotsError } = await supabaseAdmin
      .from('tutor_available_time_slots')
      .select('slot_key')
      .eq('tutor_id', tutorId)
      .eq('cycle_id', cycle.id);

    if (slotsError) {
      throw new Error('Error checking tutor slots.');
    }

    const availableKeys = new Set(slots?.map(s => s.slot_key as string) || []);
    
    for (const reqKey of requiredSlotKeys) {
      if (!availableKeys.has(reqKey)) {
        throw new Error(`Tutor is not available at slot: ${reqKey}`);
      }
    }

    return true;
  }
}
