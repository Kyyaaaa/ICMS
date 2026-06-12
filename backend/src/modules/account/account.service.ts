import { AccountRepository } from './account.repository';
import { UpdateAccountDTO } from './account.model';

export class AccountService {
  static async listAccounts(callerRole: string, filterRole?: string, search?: string, page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit; // for slice

    const data = await AccountRepository.listAccounts(callerRole, filterRole, search, page, limit);

    let formattedData = data || [];

    formattedData.forEach((item: any) => {
      if (item.roles && item.roles.name) {
        item.role = item.roles.name;
      }
    });

    formattedData.sort((a: any, b: any) => {
      const roleOrder: Record<string, number> = { 'ADMIN': 1, 'STAFF': 2, 'TUTOR': 3, 'LEARNER': 4 };
      const roleDiff = (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
      if (roleDiff !== 0) return roleDiff;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    const total = formattedData.length;
    const paginatedData = formattedData.slice(from, to);

    return { data: paginatedData, total };
  }

  static async getAccount(callerRole: string, callerId: string, targetId: string) {
    const user = await AccountRepository.getUserById(targetId);

    if (callerRole === 'STAFF' && callerId !== targetId) {
      if (user.role !== 'LEARNER' && user.role !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only access Learner or Tutor accounts');
      }
    }

    return user;
  }

  static async createAccount(callerRole: string, email: string, password: string, role: string, fullName: string, phoneNumber?: string) {
    const roleUpper = role.toUpperCase();

    if (callerRole === 'STAFF') {
      if (roleUpper !== 'LEARNER' && roleUpper !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only create Learner or Tutor accounts');
      }
    }

    return await AccountRepository.createUser(email, password, roleUpper, fullName, phoneNumber);
  }

  static async updateAccount(callerRole: string, callerId: string, targetId: string, updates: UpdateAccountDTO) {
    const user = await AccountRepository.getUserById(targetId);

    if (callerRole === 'STAFF' && callerId !== targetId) {
      if (user.role !== 'LEARNER' && user.role !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only update Learner or Tutor accounts');
      }
    }

    if (callerId !== targetId && callerRole === user.role) {
      throw new Error('Forbidden: You cannot update accounts with the same role');
    }

    // Update Auth fields first
    await AccountRepository.updateAuthFields(targetId, updates.email, updates.password);

    const payload: any = {};
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.full_name !== undefined) payload.full_name = updates.full_name;
    if (updates.phone_number !== undefined) payload.phone_number = updates.phone_number;
    if (updates.date_of_birth !== undefined) payload.date_of_birth = updates.date_of_birth;
    if (updates.gender !== undefined) payload.gender = updates.gender;
    if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;

    return await AccountRepository.updateUser(targetId, payload);
  }

  static async setAccountStatus(callerRole: string, callerId: string, targetId: string, status: string) {
    const user = await AccountRepository.getUserById(targetId);

    if (callerId === targetId) {
      throw new Error('Forbidden: You cannot change your own status');
    }

    if (callerRole === user.role) {
      throw new Error('Forbidden: You cannot change the status of accounts with the same role');
    }

    if (callerRole === 'STAFF') {
      if (user.role !== 'LEARNER' && user.role !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only change status of Learner or Tutor accounts');
      }
    }

    if (status === 'BANNED') {
      await AccountRepository.setBanDuration(targetId, '876000h');
    } else if (status === 'ACTIVE') {
      await AccountRepository.setBanDuration(targetId, 'none');
    }

    const payload = { status };
    return await AccountRepository.updateUser(targetId, payload);
  }
}
