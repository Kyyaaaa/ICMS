import { supabaseAdmin } from '../../configs/supabase';
import { CreateLearnerInput, UpdateLearnerInput } from './learner.model';

export class LearnerRepository {
  static async getAll() {
    const { data, error } = await supabaseAdmin
      .from('account')
      .select('*, roles!inner(name)')
      .eq('roles.name', 'LEARNER');
    if (error) throw error;
    return data;
  }

  static async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('account')
      .select('*, roles!inner(name)')
      .eq('roles.name', 'LEARNER')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  static async create(learnerData: CreateLearnerInput) {
    const { email, password, full_name, phone_number } = learnerData;
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'LEARNER',
        full_name: full_name,
        phone_number: phone_number || null
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
      (accountData as any).role = (accountData.roles as any).name;
    }

    return accountData;
  }

  static async update(id: string, updateData: UpdateLearnerInput) {
    const { full_name, phone_number, status } = updateData;
    
    if (phone_number || status || full_name) {
      const updates: any = { updated_at: new Date().toISOString() };
      if (phone_number) updates.phone_number = phone_number;
      if (status) updates.status = status;
      if (full_name) updates.full_name = full_name;
      
      const { error: accError } = await supabaseAdmin
        .from('account')
        .update(updates)
        .eq('id', id);
      if (accError) throw accError;
    }
  }

  static async getTranscript(learnerId: string) {
    const { data: enrollments, error } = await supabaseAdmin
      .from('enrollments')
      .select(`
        class_id,
        classes!inner (
          id,
          name,
          grading_status,
          published_gradebook,
          courses (
            id,
            title,
            code
          )
        )
      `)
      .eq('learner_id', learnerId)
      .eq('status', 'ACTIVE')
      .eq('classes.grading_status', 'PUBLISHED');

    if (error) throw new Error(error.message);

    if (!enrollments || enrollments.length === 0) {
      return { enrollments: [] };
    }

    return { enrollments };
  }
}
