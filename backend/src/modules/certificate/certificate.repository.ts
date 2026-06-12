import { supabaseAdmin } from '../../configs/supabase';
import type { Certificate } from './certificate.model';

export class CertificateRepository {
  static async findAllByTutorId(tutorId: string) {
    const { data, error } = await supabaseAdmin
      .from('tutor_certificates')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Database Error: ${error.message}`);
    }

    return data;
  }

  static async findAllWithTutorInfo(status?: string) {
    let query = supabaseAdmin
      .from('tutor_certificates')
      .select(`
        *,
        tutor (
          account (
            full_name,
            email
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Database Error: ${error.message}`);
    }

    return data;
  }

  static async findById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('tutor_certificates')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      throw new Error(`Database Error: ${error.message}`);
    }

    return data;
  }

  static async create(CertificateData: Omit<Certificate, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabaseAdmin
      .from('tutor_certificates')
      .insert([CertificateData])
      .select()
      .single();

    if (error) {
      throw new Error(`Database Error: ${error.message}`);
    }

    return data;
  }

  static async updateById(id: string, CertificateData: Partial<Certificate>) {
    const { data, error } = await supabaseAdmin
      .from('tutor_certificates')
      .update(CertificateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Database Error: ${error.message}`);
    }

    return data;
  }

  static async deleteById(id: string) {
    const { error } = await supabaseAdmin
      .from('tutor_certificates')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Database Error: ${error.message}`);
    }

    return true;
  }
}
