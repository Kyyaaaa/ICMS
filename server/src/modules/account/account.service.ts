import { AccountRepository } from './account.repository';
import { UpdateAccountDTO } from './account.model';
import { supabaseAdmin } from '../../configs/supabase';

export class AccountService {
  static async listAccounts(callerRole: string, filterRole?: string, search?: string, page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('account')
      .select('*, roles(name)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    // Apply Staff restriction: Can only see Learner and Tutor
    if (callerRole === 'STAFF') {
      query = query.in('roles.name', ['LEARNER', 'TUTOR']);
    }

    // Apply explicit role filter if provided
    if (filterRole) {
      query = query.eq('roles.name', filterRole.toUpperCase());
    }

    // Apply search filter (name, email)
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // Map role name from joined roles table for backward compatibility
    if (data) {
      data.forEach((item: any) => {
        if (item.roles && item.roles.name) {
          item.role = item.roles.name;
        }
      });
    }

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
    if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;

    if (updates.role !== undefined) {
      const roleUpper = updates.role.toUpperCase();
      // Check RBAC for Staff
      if (callerRole === 'STAFF' && roleUpper !== 'LEARNER' && roleUpper !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only assign Learner or Tutor roles');
      }
      
      const { data: roleData, error: roleError } = await supabaseAdmin
        .from('roles')
        .select('id')
        .eq('name', roleUpper)
        .single();
        
      if (roleError || !roleData) {
        throw new Error('Invalid role specified');
      }
      
      payload.role_id = roleData.id;
    }
    if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;

    return await AccountRepository.updateUser(targetId, payload);
  }

  static async setAccountStatus(callerRole: string, targetId: string, status: string) {
    const user = await AccountRepository.getUserById(targetId);

    // Check RBAC for Staff
    if (callerRole === 'STAFF') {
      if (user.role !== 'LEARNER' && user.role !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only change status of Learner or Tutor accounts');
      }
    }

    const payload = { status };
    return await AccountRepository.updateUser(targetId, payload);
  }
}
