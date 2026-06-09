import { AccountRepository } from './account.repository';
import { UpdateAccountDTO } from './account.model';
import { supabaseAdmin } from '../../configs/supabase';

export class AccountService {
  static async listAccounts(callerRole: string, filterRole?: string, search?: string, page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    let query = supabaseAdmin
      .from('account')
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    // Apply Staff restriction: Can only see Learner and Tutor
    if (callerRole === 'STAFF') {
      query = query.in('role', ['LEARNER', 'TUTOR']);
    }

    // Apply explicit role filter if provided
    if (filterRole) {
      query = query.eq('role', filterRole.toUpperCase());
    }

    // Apply search filter (name, email)
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { data, total: count || 0 };
  }

  static async getAccount(callerRole: string, callerId: string, targetId: string) {
    const user = await AccountRepository.getUserById(targetId);
    
    // Check RBAC for Staff
    if (callerRole === 'STAFF' && callerId !== targetId) {
      if (user.role !== 'LEARNER' && user.role !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only access Learner or Tutor accounts');
      }
    }

    return user;
  }

  static async createAccount(callerRole: string, email: string, password: string, role: string, fullName: string, phoneNumber?: string) {
    const roleUpper = role.toUpperCase();

    // Check RBAC for Staff
    if (callerRole === 'STAFF') {
      if (roleUpper !== 'LEARNER' && roleUpper !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only create Learner or Tutor accounts');
      }
    }

    return await AccountRepository.createUser(email, password, roleUpper, fullName, phoneNumber);
  }

  static async updateAccount(callerRole: string, callerId: string, targetId: string, updates: UpdateAccountDTO) {
    const user = await AccountRepository.getUserById(targetId);
    
    // Check RBAC for Staff
    if (callerRole === 'STAFF' && callerId !== targetId) {
      if (user.role !== 'LEARNER' && user.role !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only update Learner or Tutor accounts');
      }
    }

    const payload: any = {};
    if (updates.password) payload.password = updates.password;
    if (updates.full_name !== undefined) payload.full_name = updates.full_name;
    if (updates.phone_number !== undefined) payload.phone_number = updates.phone_number;
    if (updates.date_of_birth !== undefined) payload.date_of_birth = updates.date_of_birth;
    if (updates.gender !== undefined) payload.gender = updates.gender;

    return await AccountRepository.updateUser(targetId, payload);
  }

  static async setAccountStatus(callerRole: string, targetId: string, isActive: boolean) {
    const user = await AccountRepository.getUserById(targetId);
    
    // Check RBAC for Staff
    if (callerRole === 'STAFF') {
      if (user.role !== 'LEARNER' && user.role !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only change status of Learner or Tutor accounts');
      }
    }

    const payload = { status: isActive ? 'ACTIVE' : 'BANNED' };
    return await AccountRepository.updateUser(targetId, payload);
  }
}
