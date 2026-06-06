import { AccountRepository } from './account.repository';
import { AccountResponse, UpdateAccountDTO } from './account.model';

export class AccountService {
  /**
   * Helper to format a Supabase User object into a cleaner response
   */
  private static formatUser(user: any): AccountResponse | null {
    if (!user) return null;
    
    // Check if the user is banned (ban_duration is not null or none, and banned_until is in the future)
    let isBanned = false;
    if (user.banned_until) {
      const banDate = new Date(user.banned_until).getTime();
      isBanned = banDate > Date.now();
    }

    return {
      id: user.id,
      account_code: user.user_metadata?.account_code  ,
      email: user.email,
      role: user.user_metadata?.role,
      full_name: user.user_metadata?.full_name,
      phone_number: user.user_metadata?.phone_number,
      date_of_birth: user.user_metadata?.date_of_birth,
      gender: user.user_metadata?.gender,
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      is_active: !isBanned,
    };
  }

  static async listAccounts(callerRole: string, filterRole?: string, search?: string, page: number = 1, limit: number = 50) {
    let users = await AccountRepository.getAllUsers(page, limit);

    // Apply Staff restriction: Can only see Learner and Tutor
    if (callerRole === 'STAFF') {
      users = users.filter(u => {
        const r = u.user_metadata?.role;
        return r === 'LEARNER' || r === 'TUTOR';
      });
    }

    // Apply explicit role filter if provided
    if (filterRole) {
      const roleUpper = filterRole.toUpperCase();
      users = users.filter(u => u.user_metadata?.role === roleUpper);
    }

    // Apply search filter (name, email)
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(u => 
        u.email?.toLowerCase().includes(searchLower) ||
        u.user_metadata?.full_name?.toLowerCase().includes(searchLower)
      );
    }

    return users.map(u => this.formatUser(u));
  }

  static async getAccount(callerRole: string, callerId: string, targetId: string) {
    const user = await AccountRepository.getUserById(targetId);
    
    // Check RBAC for Staff
    if (callerRole === 'STAFF' && callerId !== targetId) {
      const targetRole = user.user_metadata?.role;
      if (targetRole !== 'LEARNER' && targetRole !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only access Learner or Tutor accounts');
      }
    }

    return this.formatUser(user);
  }

  private static async getNextAccountCode(roleUpper: string): Promise<string> {
    const prefix = roleUpper.substring(0, 2).toUpperCase();
    
    // Fetch users to find max sequence for this role (up to 1000 to keep it simple for now)
    const users = await AccountRepository.getAllUsers(1, 1000);
    
    let maxNum = 0;
    for (const u of users) {
      const uRole = u.user_metadata?.role;
      const uCode = u.user_metadata?.account_code;
      if (uRole === roleUpper && uCode && uCode.startsWith(prefix)) {
        const numStr = uCode.substring(2);
        const num = parseInt(numStr, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
    
    const nextNum = maxNum + 1;
    const paddedNum = nextNum.toString().padStart(4, '0');
    return `${prefix}${paddedNum}`;
  }

  static async createAccount(callerRole: string, email: string, password: string, role: string, fullName: string, phoneNumber?: string) {
    const roleUpper = role.toUpperCase();

    // Check RBAC for Staff
    if (callerRole === 'STAFF') {
      if (roleUpper !== 'LEARNER' && roleUpper !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only create Learner or Tutor accounts');
      }
    }

    // Generate sequential account code (e.g. AD0001)
    const accountCode = await this.getNextAccountCode(roleUpper);

    const newUser = await AccountRepository.createUser(email, password, roleUpper, fullName, accountCode, phoneNumber);
    return this.formatUser(newUser);
  }

  static async updateAccount(callerRole: string, callerId: string, targetId: string, updates: UpdateAccountDTO) {
    const user = await AccountRepository.getUserById(targetId);
    
    // Check RBAC for Staff
    if (callerRole === 'STAFF' && callerId !== targetId) {
      const targetRole = user.user_metadata?.role;
      if (targetRole !== 'LEARNER' && targetRole !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only update Learner or Tutor accounts');
      }
    }

    const payload: any = {};
    if (updates.password) {
      payload.password = updates.password;
    }
    
    // Keep existing metadata, override new ones
    if (updates.full_name !== undefined || updates.phone_number !== undefined || updates.date_of_birth !== undefined || updates.gender !== undefined) {
      payload.user_metadata = { ...user.user_metadata };
      if (updates.full_name !== undefined) payload.user_metadata.full_name = updates.full_name;
      if (updates.phone_number !== undefined) payload.user_metadata.phone_number = updates.phone_number;
      if (updates.date_of_birth !== undefined) payload.user_metadata.date_of_birth = updates.date_of_birth;
      if (updates.gender !== undefined) payload.user_metadata.gender = updates.gender;
    }

    const updatedUser = await AccountRepository.updateUser(targetId, payload);
    return this.formatUser(updatedUser);
  }

  static async setAccountStatus(callerRole: string, targetId: string, isActive: boolean) {
    const user = await AccountRepository.getUserById(targetId);
    
    // Check RBAC for Staff
    if (callerRole === 'STAFF') {
      const targetRole = user.user_metadata?.role;
      if (targetRole !== 'LEARNER' && targetRole !== 'TUTOR') {
        throw new Error('Forbidden: Staff can only change status of Learner or Tutor accounts');
      }
    }

    // ban_duration: 'none' to unban, '876000h' to ban for 100 years
    const payload = { ban_duration: isActive ? 'none' : '876000h' };
    const updatedUser = await AccountRepository.updateUser(targetId, payload);
    
    return this.formatUser(updatedUser);
  }
}
