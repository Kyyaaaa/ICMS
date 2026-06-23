import { supabaseAdmin } from '../../configs/supabase';
import { CreateConsultationDTO, UpdateConsultationDTO } from './consultation-request.model';

export class ConsultationRequestRepository {
  static async createRequest(data: CreateConsultationDTO) {
    const { data: requestData, error } = await supabaseAdmin
      .from('consultation_requests')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return requestData;
  }

  static async listRequests(statusFilter?: string, page: number = 1, limit: number = 50) {
    const from = (page - 1) * limit;
    const to = from + limit - 1; // Supabase range is inclusive

    let query = supabaseAdmin
      .from('consultation_requests')
      .select('*, handled_by:account(full_name, email)', { count: 'exact' });

    if (statusFilter) {
      query = query.eq('status', statusFilter);
    }

    // Order by created_at desc
    query = query.order('created_at', { ascending: false });
    
    // Pagination
    query = query.range(from, to);

    const { data, count, error } = await query;
    if (error) throw error;

    return { data: data || [], total: count || 0 };
  }

  static async getRequestById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('consultation_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Consultation request not found');

    return data;
  }

  static async updateRequest(id: string, updates: any) {
    // Also update updated_at automatically if we are passing generic updates
    updates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabaseAdmin
      .from('consultation_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
