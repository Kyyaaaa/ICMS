import { supabaseAdmin } from '../../configs/supabase';
import { AvailabilityResponse, TutorAvailabilityProfile } from './available-time-slot.model';
import { CacheService } from '../../utils/cache';
import { getAvailabilitySlotKey, getCycleNameFromDate } from '../../utils/slot-mapper';

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
    return await CacheService.getOrSet('availability_cycles', async () => {
      const { data, error } = await supabaseAdmin
        .from('availability_cycles')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      return data;
    });
  }

  static async getOrCreateCycleByMonth(month: number, year: number) {
    const monthStr = String(month).padStart(2, '0');
    const cycleName = `${monthStr}/${year}`;
    
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

    // 3. Fetch all slots
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
        const formattedKey = reqKey.replace(/-slot(\d+)/i, ' - Slot $1');
        throw new Error(`Tutor is not available at ${formattedKey}`);
      }
    }

    return true;
  }

  static async checkTutorHasAnyAvailability(tutorId: string): Promise<boolean> {
    const { count, error } = await supabaseAdmin
      .from('tutor_available_time_slots')
      .select('*', { count: 'exact', head: true })
      .eq('tutor_id', tutorId);
    
    if (error) return true; // Default to true to prevent bypassing checks on error
    return count !== null && count > 0;
  }

  /**
   * Get all slots the tutor is actively scheduled to teach within a specific cycle
   * Returns an array of objects containing the slot_key and the class name
   */
  static async getOccupiedSlotsForCycle(tutorId: string, cycleId: string): Promise<{ slot_key: string, class_name: string }[]> {
    // 1. Get the cycle details to know start and end dates
    const { data: cycle, error: cycleError } = await supabaseAdmin
      .from('availability_cycles')
      .select('*')
      .eq('id', cycleId)
      .single();

    if (cycleError || !cycle) throw new Error('Cycle not found');

    // 2. Find all class sessions for this tutor within the cycle dates
    const { data: sessions, error: sessionsError } = await supabaseAdmin
      .from('class_sessions')
      .select(`
        date,
        slot,
        classes ( name )
      `)
      .eq('tutor_id', tutorId)
      .gte('date', cycle.start_date.split('T')[0])
      .lte('date', cycle.end_date.split('T')[0]);

    if (sessionsError) throw new Error(`Error fetching occupied sessions: ${sessionsError.message}`);

    const occupiedSlots: { slot_key: string, class_name: string }[] = [];
    const seen = new Set<string>();

    for (const sess of (sessions || [])) {
      if (sess.date && sess.slot) {
        const key = getAvailabilitySlotKey(sess.date, sess.slot);
        if (!seen.has(key)) {
          seen.add(key);
          const className = sess.classes && typeof sess.classes === 'object' && !Array.isArray(sess.classes) ? (sess.classes as any).name : 'Unknown Class';
          occupiedSlots.push({ slot_key: key, class_name: className });
        }
      }
    }

    return occupiedSlots;
  }

  /**
   * Synchronize tutor availability with a list of assigned sessions
   * Automatically adds required slots into the availability profile for respective cycles.
   * Creates 'draft' status if no status exists.
   */
  static async syncTutorAvailabilityWithSessions(tutorId: string, sessions: any[]): Promise<void> {
    if (!sessions || sessions.length === 0) return;

    // Group required slots by cycle (Month/Year)
    const requiredSlotsByCycle: Record<string, Set<string>> = {};

    for (const sess of sessions) {
      if (sess.date && sess.slot) {
        const cycleName = getCycleNameFromDate(sess.date);
        const slotKey = getAvailabilitySlotKey(sess.date, sess.slot);
        
        if (!requiredSlotsByCycle[cycleName]) {
          requiredSlotsByCycle[cycleName] = new Set<string>();
        }
        requiredSlotsByCycle[cycleName].add(slotKey);
      }
    }

    for (const [cycleName, slotKeysSet] of Object.entries(requiredSlotsByCycle)) {
      // 1. Ensure cycle exists
      const [month, year] = cycleName.split('/').map(Number);
      const cycle = await this.getOrCreateCycleByMonth(month, year);
      
      // 2. Ensure status exists (default to draft if not submitted)
      const { data: currentStatus } = await supabaseAdmin
        .from('tutor_availability_status')
        .select('status')
        .eq('tutor_id', tutorId)
        .eq('cycle_id', cycle.id)
        .maybeSingle();

      if (!currentStatus) {
        await supabaseAdmin
          .from('tutor_availability_status')
          .insert({
            tutor_id: tutorId,
            cycle_id: cycle.id,
            status: 'draft'
          });
      }

      // 3. Fetch existing slots
      const { data: existingSlots } = await supabaseAdmin
        .from('tutor_available_time_slots')
        .select('slot_key')
        .eq('tutor_id', tutorId)
        .eq('cycle_id', cycle.id);

      const existingSlotKeys = new Set(existingSlots?.map(s => s.slot_key as string) || []);

      // 4. Insert missing slots
      const slotsToInsert = [];
      for (const reqKey of Array.from(slotKeysSet)) {
        if (!existingSlotKeys.has(reqKey)) {
          slotsToInsert.push({
            tutor_id: tutorId,
            cycle_id: cycle.id,
            slot_key: reqKey
          });
        }
      }

      if (slotsToInsert.length > 0) {
        await supabaseAdmin
          .from('tutor_available_time_slots')
          .insert(slotsToInsert);
      }
    }
  }
}
