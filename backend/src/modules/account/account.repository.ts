import { supabaseAdmin } from '../../configs/supabase';

export class AccountRepository {
  /**
   * Get all users from public.account with optional filtering
   */
  static async listAccounts(callerRole: string, filterRole?: string, search?: string, page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit; // for slice later

    let query = supabaseAdmin
      .from('account')
      .select('*, roles!inner(name)')
      .neq('email', 'admin@icms.edu.vn');

    if (callerRole === 'STAFF') {
      query = query.in('roles.name', ['LEARNER', 'TUTOR']);
    }

    if (filterRole) {
      query = query.eq('roles.name', filterRole.toUpperCase());
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    
    return data || [];
  }

  /**
   * Get a specific user by ID
   */
  static async getUserById(userId: string) {
    const { data, error } = await supabaseAdmin
      .from('account')
      .select('*, roles(name)')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Account not found');

    if (data.roles && (data.roles as any).name) {
      data.role = (data.roles as any).name;
    }

    return data;
  }

  /**
   * Create a new user account (Admin/Staff only)
   */
  static async createUser(email: string, password: string, role: string, fullName: string, phoneNumber?: string) {
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: role.toUpperCase(),
        full_name: fullName,
        phone_number: phoneNumber || null
      }
    });
    if (authError) throw authError;

    const { data: accountData, error: accountError } = await supabaseAdmin
      .from('account')
      .select('*, roles(name)')
      .eq('id', authData.user.id)
      .single();

    if (accountError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw accountError;
    }

    if (accountData.roles && (accountData.roles as any).name) {
      accountData.role = (accountData.roles as any).name;
    }

    return accountData;
  }

  /**
   * Update auth fields (email, password)
   */
  static async updateAuthFields(userId: string, email?: string, password?: string) {
    const authUpdates: any = {};
    if (email) {
      authUpdates.email = email;
      authUpdates.email_confirm = true;
    }
    if (password) {
      authUpdates.password = password;
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, authUpdates);
      if (error) throw error;
    }
  }

  /**
   * Set ban duration in Supabase Auth
   */
  static async setBanDuration(userId: string, duration: string) {
    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      ban_duration: duration
    });
    if (error) throw error;
  }

  /**
   * Update an existing user's metadata in public.account
   */
  static async updateUser(userId: string, updates: any) {
    if (Object.keys(updates).length === 0) {
      return await this.getUserById(userId);
    }

    const { error } = await supabaseAdmin
      .from('account')
      .update(updates)
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return await this.getUserById(userId);
  }
}
