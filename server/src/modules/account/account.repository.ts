import { supabaseAdmin } from '../../configs/supabase';

export class AccountRepository {
  /**
   * Get all users from Supabase Auth
   */
  static async getAllUsers(page: number = 1, limit: number = 50) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page: page,
      perPage: limit
    });
    if (error) throw error;
    return data.users;
  }

  /**
   * Get a specific user by ID
   */
  static async getUserById(userId: string) {
    const { data, error } = await supabaseAdmin.auth.admin.getUserById(userId);
    if (error) throw error;
    return data.user;
  }

  /**
   * Create a new user account (Admin/Staff only)
   */
  static async createUser(email: string, password: string, role: string, fullName: string, accountCode: string, phoneNumber?: string) {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm for manually created accounts
      user_metadata: {
        account_code: accountCode,
        role: role.toUpperCase(),
        full_name: fullName,
        phone_number: phoneNumber || null
      }
    });
    if (error) throw error;
    return data.user;
  }

  /**
   * Update an existing user's metadata/email/password
   */
  static async updateUser(userId: string, updates: any) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, updates);
    if (error) throw error;
    return data.user;
  }
}
