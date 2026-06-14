import { LearnerRepository } from './learner.repository';
import { CreateLearnerInput, UpdateLearnerInput } from './learner.model';

export class LearnerService {
  /**
   * L?y danh s�ch t?t c? h?c vi�n
   */
  static async getAll() {
    return await LearnerRepository.getAll();
  }

  /**
   * L?y chi ti?t 1 h?c vi�n
   */
  static async getById(id: string) {
    return await LearnerRepository.getById(id);
  }

  /**
   * T?o h?c vi�n m?i (D�ng cho Admin/Staff)
   */
  static async create(learnerData: CreateLearnerInput) {
    return await LearnerRepository.create(learnerData);
  }

  /**
   * C?p nh?t th�ng tin h?c vi�n
   */
  static async update(id: string, learnerData: UpdateLearnerInput) {
    await LearnerRepository.update(id, learnerData);
    // Tr? v? b?n ghi m?i nh?t
    return this.getById(id);
  }

  
}
