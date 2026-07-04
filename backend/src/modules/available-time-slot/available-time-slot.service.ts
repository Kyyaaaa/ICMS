import { AvailableTimeSlotRepository } from './available-time-slot.repository';
import { AvailabilityResponse, SubmitAvailabilityDTO, TutorAvailabilityProfile, StaffUpdateTutorAvailabilityDTO } from './available-time-slot.model';
import { supabaseAdmin } from '../../configs/supabase';

export class AvailableTimeSlotService {
  static async getMyAvailability(tutorId: string, cycleId: string): Promise<AvailabilityResponse> {
    return await AvailableTimeSlotRepository.getAvailability(tutorId, cycleId);
  }

  static async submitAvailability(tutorId: string, data: SubmitAvailabilityDTO): Promise<void> {
    const { cycle_id, slots, status } = data;
    
    if (!cycle_id) throw new Error('cycle_id is required');

    // Check cycle status first
    const cycles = await AvailableTimeSlotRepository.getCycles();
    const targetCycle = cycles.find(c => c.id === cycle_id);
    if (!targetCycle) {
      throw new Error('Cycle not found');
    }
    if (targetCycle.status !== 'OPEN') {
      const { count } = await supabaseAdmin
        .from('tutor_available_time_slots')
        .select('*', { count: 'exact', head: true })
        .eq('tutor_id', tutorId);
      
      const isNewTutor = count === 0;
      if (!isNewTutor) {
        throw new Error(`Cannot submit availability because the cycle is currently ${targetCycle.status}. Registration is closed.`);
      }
    }

    // Validate slots
    if (!Array.isArray(slots)) {
      throw new Error('Invalid input: slots must be an array');
    }

    // Validate slot format (e.g., Monday-slot1)
    const slotRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)-(slot[1-6])$/i;
    for (let i = 0; i < slots.length; i++) {
      // Normalize to lowercase slot (e.g. Slot1 -> slot1)
      const parts = slots[i].split('-');
      if (parts.length === 2 && parts[1].toLowerCase().startsWith('slot')) {
        const day = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
        slots[i] = `${day}-${parts[1].toLowerCase()}`;
      }
      
      if (!slotRegex.test(slots[i])) {
        throw new Error(`Invalid slot format: ${slots[i]}. Expected format like Monday-slot1.`);
      }
    }

    // Check if currently locked
    const currentAvailability = await AvailableTimeSlotRepository.getAvailability(tutorId, cycle_id);
    if (currentAvailability.status === 'submitted') {
      throw new Error('Your schedule is locked for this cycle. You cannot modify it unless a staff unlocks it.');
    }

    // Use status from DTO or default to submitted
    const newStatus = status === 'draft' ? 'draft' : 'submitted';

    await AvailableTimeSlotRepository.submitAvailability(tutorId, cycle_id, slots, newStatus);
  }

  static async getAllTutorsAvailability(cycleId: string): Promise<TutorAvailabilityProfile[]> {
    if (!cycleId) throw new Error('cycle_id is required');
    return await AvailableTimeSlotRepository.getAllTutorsAvailability(cycleId);
  }

  static async staffUpdateTutorAvailability(tutorId: string, data: StaffUpdateTutorAvailabilityDTO): Promise<void> {
    const { cycle_id, slots, status } = data;

    if (!cycle_id) throw new Error('cycle_id is required');

    if (!Array.isArray(slots)) {
      throw new Error('Invalid input: slots must be an array');
    }

    if (status !== 'draft' && status !== 'submitted') {
      throw new Error('Invalid input: status must be draft or submitted');
    }

    // Validate slot format (e.g., Monday-slot1)
    const slotRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)-(slot[1-6])$/i;
    for (let i = 0; i < slots.length; i++) {
      // Normalize to lowercase slot (e.g. Slot1 -> slot1)
      const parts = slots[i].split('-');
      if (parts.length === 2 && parts[1].toLowerCase().startsWith('slot')) {
        const day = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
        slots[i] = `${day}-${parts[1].toLowerCase()}`;
      }
      
      if (!slotRegex.test(slots[i])) {
        throw new Error(`Invalid slot format: ${slots[i]}. Expected format like Monday-slot1.`);
      }
    }

    await AvailableTimeSlotRepository.submitAvailability(tutorId, cycle_id, slots, status);
  }

  static async getCycles() {
    return await AvailableTimeSlotRepository.getCycles();
  }

  static async getOrCreateCycleByMonth(month: number, year: number) {
    if (month < 1 || month > 12) throw new Error('Invalid month');
    if (year < 2000 || year > 2100) throw new Error('Invalid year');
    return await AvailableTimeSlotRepository.getOrCreateCycleByMonth(month, year);
  }

  static async updateCycleStatus(cycleId: string, status: string) {
    return await AvailableTimeSlotRepository.updateCycleStatus(cycleId, status);
  }

  static async checkTutorAvailabilityForSlots(tutorId: string, cycleName: string, requiredSlotKeys: string[]) {
    return await AvailableTimeSlotRepository.checkTutorAvailabilityForSlots(tutorId, cycleName, requiredSlotKeys);
  }
}
