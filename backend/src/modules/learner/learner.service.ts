import { LearnerRepository } from './learner.repository';
import { CreateLearnerInput, UpdateLearnerInput } from './learner.model';

export class LearnerService {
  /**
   * L?y danh sách t?t c? h?c viên
   */
  static async getAll() {
    return await LearnerRepository.getAll();
  }

  /**
   * L?y chi ti?t 1 h?c viên
   */
  static async getById(id: string) {
    return await LearnerRepository.getById(id);
  }

  /**
   * T?o h?c viên m?i (Dùng cho Admin/Staff)
   */
  static async create(learnerData: CreateLearnerInput) {
    return await LearnerRepository.create(learnerData);
  }

  /**
   * C?p nh?t thông tin h?c viên
   */
  static async update(id: string, learnerData: UpdateLearnerInput) {
    await LearnerRepository.update(id, learnerData);
    // Tr? v? b?n ghi m?i nh?t
    return this.getById(id);
  }

  /**
   * Xóa h?c viên
   */
  static async delete(id: string) {
    return await LearnerRepository.delete(id);
  }
}
