import { supabase, supabaseAdmin } from '../../configs/supabase';

export class LearnerService {
  /**
   * Lấy danh sách tất cả học viên
   */
  static async getAll() {
    const { data, error } = await supabaseAdmin
      .from('learner')
      .select('*, account(email, phone_number, status, role)');
    if (error) throw error;
    return data;
  }

  /**
   * Lấy chi tiết 1 học viên
   */
  static async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('learner')
      .select('*, account(email, phone_number, status, role)')
      .eq('account_id', id)
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * Tạo học viên mới (Dùng cho Admin/Staff)
   */
  static async create(learnerData: any) {
    const { email, password, full_name, phone_number } = learnerData;
    
    // Gọi Supabase Admin để tạo tài khoản, bypass phần gửi email
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'LEARNER',
        full_name: full_name,
        phone_number: phone_number
      }
    });
    
    if (authError) throw authError;

    // Fetch from public.account
    const { data: accountData, error: accountError } = await supabaseAdmin
      .from('account')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (accountError) {
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      throw accountError;
    }

    return accountData;
  }

  /**
   * Cập nhật thông tin học viên
   */
  static async update(id: string, learnerData: any) {
    const { full_name, phone_number, status } = learnerData;
    

    
    // Cập nhật bảng account nếu có phone_number, status, hoặc full_name
    if (phone_number || status || full_name) {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (phone_number) updateData.phone_number = phone_number;
      if (status) updateData.status = status;
      if (full_name) updateData.full_name = full_name;
      
      const { error: accError } = await supabaseAdmin
        .from('account')
        .update(updateData)
        .eq('id', id);
      if (accError) throw accError;
    }
    
    // Trả về bản ghi mới nhất
    return this.getById(id);
  }

  /**
   * Xóa học viên
   */
  static async delete(id: string) {
    // Xóa khỏi bảng account trước (nếu database chưa setup ON DELETE CASCADE)
    await supabaseAdmin.from('account').delete().eq('id', id);

    // Xóa user từ Supabase Auth
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    return data;
  }
}
