import { supabase, supabaseAdmin } from '../config/supabase';

export class LearnerService {
  /**
   * Lấy danh sách tất cả học viên
   */
  static async getAll() {
    const { data, error } = await supabase
      .from('learner')
      .select('*, account(email, phone_number, status, role)');
    if (error) throw error;
    return data;
  }

  /**
   * Lấy chi tiết 1 học viên
   */
  static async getById(id: string) {
    const { data, error } = await supabase
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
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'LEARNER',
        full_name: full_name,
        phone_number: phone_number
      }
    });
    
    if (error) throw error;
    return data.user;
  }

  /**
   * Cập nhật thông tin học viên
   */
  static async update(id: string, learnerData: any) {
    const { full_name, phone_number, status } = learnerData;
    
    // Cập nhật bảng learner nếu có full_name
    if (full_name) {
      const { error } = await supabase
        .from('learner')
        .update({ full_name, updated_at: new Date().toISOString() })
        .eq('account_id', id);
      if (error) throw error;
    }
    
    // Cập nhật bảng account nếu có phone_number hoặc status
    if (phone_number || status) {
      const updateData: any = { updated_at: new Date().toISOString() };
      if (phone_number) updateData.phone_number = phone_number;
      if (status) updateData.status = status;
      
      const { error: accError } = await supabase
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
    // Xóa user từ Supabase Auth sẽ tự động xóa bản ghi trong bảng account và learner
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
    return data;
  }
}
