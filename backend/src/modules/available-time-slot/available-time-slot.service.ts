import { AvailableTimeSlotRepository } from './available-time-slot.repository';
import { AvailabilityResponse, SubmitAvailabilityDTO, TutorAvailabilityProfile, StaffUpdateTutorAvailabilityDTO } from './available-time-slot.model';

export class AvailableTimeSlotService {
  static async getMyAvailability(tutorId: string): Promise<AvailabilityResponse> {
    return await AvailableTimeSlotRepository.getAvailability(tutorId);
  }

  static async submitAvailability(tutorId: string, data: SubmitAvailabilityDTO): Promise<void> {
    const { slots, status } = data;
    
    // Validate slots
    if (!Array.isArray(slots)) {
      throw new Error('Invalid input: slots must be an array');
    }

    // Validate slot format (e.g., Monday-M1)
    const slotRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)-(M1|M2|A1|A2|E1|E2)$/;
    for (const slot of slots) {
      if (!slotRegex.test(slot)) {
        throw new Error(`Invalid slot format: ${slot}. Expected format like Monday-M1.`);
      }
    }

    // Check if currently locked
    const currentAvailability = await AvailableTimeSlotRepository.getAvailability(tutorId);
    if (currentAvailability.status === 'submitted') {
      throw new Error('Your schedule is locked. You cannot modify it unless a staff unlocks it.');
    }

    // Use status from DTO or default to submitted
    const newStatus = status === 'draft' ? 'draft' : 'submitted';

    await AvailableTimeSlotRepository.submitAvailability(tutorId, slots, newStatus);
  }

  static async getAllTutorsAvailability(): Promise<TutorAvailabilityProfile[]> {
    return await AvailableTimeSlotRepository.getAllTutorsAvailability();
  }

  static async staffUpdateTutorAvailability(tutorId: string, data: StaffUpdateTutorAvailabilityDTO): Promise<void> {
    const { slots, status } = data;

    if (!Array.isArray(slots)) {
      throw new Error('Invalid input: slots must be an array');
    }

    if (status !== 'draft' && status !== 'submitted') {
      throw new Error('Invalid input: status must be draft or submitted');
    }

    await AvailableTimeSlotRepository.submitAvailability(tutorId, slots, status);
  }
}
