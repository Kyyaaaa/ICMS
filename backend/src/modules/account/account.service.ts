import { AccountRepository } from './account.repository';
import { UpdateAccountDTO } from './account.model';
import { supabaseAdmin } from '../../configs/supabase';

export class AccountService {
  static async listAccounts(callerRole: string, filterRole?: string, search?: string, page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit; // for slice

    // Always use inner join for roles so that filtering by role works correctly
    // and so that we always get the role name.
    let query = supabaseAdmin
      .from('account')
      .select('*, roles!inner(name)');

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

    const { data, error } = await query;
    if (error) throw error;

    let formattedData = data || [];

    // Map role name from joined roles table
    formattedData.forEach((item: any) => {
      if (item.roles && item.roles.name) {
        item.role = item.roles.name;
      }
    });

    // Sort by Role Priority, then Oldest First
    formattedData.sort((a: any, b: any) => {
      const roleOrder: Record<string, number> = { 'ADMIN': 1, 'STAFF': 2, 'TUTOR': 3, 'LEARNER': 4 };
      const roleDiff = (roleOrder[a.role] || 99) - (roleOrder[b.role] || 99);
      if (roleDiff !== 0) return roleDiff;
      // Sort by who registered first (ascending created_at)
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

    const total = formattedData.length;
    const paginatedData = formattedData.slice(from, to);

    return { data: paginatedData, total };
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

    // Sync ban status with Supabase Auth so that login is also blocked/unblocked
    if (status === 'BANNED') {
      // Set banned_until to a far future date (effectively permanent ban)
      await supabaseAdmin.auth.admin.updateUserById(targetId, {
        ban_duration: '876000h' // 100 years
      });
    } else if (status === 'ACTIVE') {
      // Unban in Supabase Auth
      await supabaseAdmin.auth.admin.updateUserById(targetId, {
        ban_duration: 'none'
      });
    }

    const payload = { status };
    return await AccountRepository.updateUser(targetId, payload);
  }
}
