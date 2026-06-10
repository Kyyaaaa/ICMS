import { supabaseAdmin } from '../../configs/supabase';

export class AccountRepository {
  /**
   * Get all users from public.account
   */
  static async getAllUsers(page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await supabaseAdmin
      .from('account')
      .select('*, roles(name)', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data) {
      data.forEach(item => {
        if (item.roles && (item.roles as any).name) {
          item.role = (item.roles as any).name;
        }
      });
    }

    return { data, total: count || 0 };
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
    // 1. Create in Supabase Auth (DB trigger will automatically create the record in public.account)
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

    // 2. Fetch from public.account
    const { data: accountData, error: accountError } = await supabaseAdmin
      .from('account')
      .select('*, roles(name)')
      .eq('id', authData.user.id)
      .single();

    if (accountError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw accountError;
    }

    // Map role name for backward compatibility
    if (accountData.roles && (accountData.roles as any).name) {
      accountData.role = (accountData.roles as any).name;
    }

    return accountData;
  }

  /**
   * Update an existing user's metadata/email
   */
  static async updateUser(userId: string, updates: any) {
    // Nếu có update password thì phải dùng auth.admin
    if (updates.password) {
      const { error: passError } = await supabaseAdmin.auth.admin.updateUserById(userId, { password: updates.password });
      if (passError) throw passError;
      delete updates.password; // Không lưu pass vào public.account
    }

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
