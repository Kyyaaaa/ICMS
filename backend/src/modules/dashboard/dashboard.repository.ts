import { supabaseAdmin } from '../../configs/supabase';

export const DashboardRepository = {
  // Learner
  getLearnerActiveClasses: async (learnerId: string) => {
    return supabaseAdmin
      .from('enrollments')
      .select('*', { count: 'exact', head: true })
      .eq('learner_id', learnerId);
  },
  getLearnerAttendances: async (learnerId: string) => {
    return supabaseAdmin
      .from('attendances')
      .select('status, class_sessions(date)')
      .eq('learner_id', learnerId);
  },
  getLearnerCompletedLessons: async (learnerId: string) => {
    return supabaseAdmin
      .from('attendances')
      .select('*', { count: 'exact', head: true })
      .eq('learner_id', learnerId)
      .eq('status', 'PRESENT');
  },
  getLearnerEnrollments: async (learnerId: string) => {
    return supabaseAdmin
      .from('enrollments')
      .select('class_id')
      .eq('learner_id', learnerId);
  },
  getUpcomingSessionsByClassIds: async (classIds: string[]) => {
    const now = new Date().toISOString().split('T')[0];
    return supabaseAdmin
      .from('class_sessions')
      .select('id, date, slot, session_number, classroom:classroom!classroom_id(room_name), tutor:account!tutor_id(full_name), classes(name, courses(title))')
      .in('class_id', classIds)
      .gte('date', now)
      .order('date', { ascending: true })
      .order('slot', { ascending: true })
      .limit(3);
  },
  getLearnerPendingInvoices: async (learnerId: string) => {
    return supabaseAdmin
      .from('invoices')
      .select('id, invoice_code, status, amount, due_date, created_at, classes(name), invoice_installments(*)')
      .eq('learner_id', learnerId)
      .in('status', ['PENDING', 'PARTIAL'])
      .order('due_date', { ascending: true })
      .limit(5);
  },

  // Tutor
  getTutorActiveClasses: async (tutorId: string) => {
    return supabaseAdmin
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .eq('tutor_id', tutorId)
      .in('status', ['ONGOING', 'UPCOMING']);
  },
  getTutorUpcomingSessionsCount: async (tutorId: string) => {
    const now = new Date().toISOString().split('T')[0];
    return supabaseAdmin
      .from('class_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('tutor_id', tutorId)
      .gte('date', now);
  },
  getTutorPendingRequestsCount: async (tutorId: string) => {
    return supabaseAdmin
      .from('change_requests')
      .select('*', { count: 'exact', head: true })
      .eq('tutor_id', tutorId)
      .eq('status', 'Pending');
  },
  getTutorTotalStudents: async (tutorId: string) => {
    // get active classes for this tutor (upcoming and ongoing)
    const { data: classes } = await supabaseAdmin
      .from('classes')
      .select('id')
      .eq('tutor_id', tutorId)
      .in('status', ['ONGOING', 'UPCOMING']);
      
    if (!classes || classes.length === 0) return { count: 0 };
    const classIds = classes.map(c => c.id);
    
    // get unique learners in these classes
    return supabaseAdmin
      .from('enrollments')
      .select('learner_id', { count: 'exact', head: true })
      .in('class_id', classIds)
      .eq('status', 'ACTIVE');
  },
  getTutorUpcomingSessions: async (tutorId: string) => {
    const now = new Date().toISOString().split('T')[0];
    return supabaseAdmin
      .from('class_sessions')
      .select('id, date, slot, session_number, classroom:classroom!classroom_id(room_name), classes(name, courses(title))')
      .eq('tutor_id', tutorId)
      .gte('date', now)
      .order('date', { ascending: true })
      .order('slot', { ascending: true })
      .limit(5);
  },
  getTutorPendingRequests: async (tutorId: string) => {
    return supabaseAdmin
      .from('change_requests')
      .select('id, type, created_at, status')
      .eq('tutor_id', tutorId)
      .eq('status', 'Pending')
      .limit(3);
  },

  // Staff
  getRoleIdByName: async (name: string) => {
    return supabaseAdmin.from('roles').select('id').eq('name', name).single();
  },
  getAccountCountByRole: async (roleId: string) => {
    return supabaseAdmin.from('account').select('*', { count: 'exact', head: true }).eq('role_id', roleId);
  },
  getGlobalTotalStudents: async () => {
    const { data: classes } = await supabaseAdmin
      .from('classes')
      .select('id')
      .in('status', ['ONGOING', 'UPCOMING']);
      
    if (!classes || classes.length === 0) return { count: 0 };
    const classIds = classes.map(c => c.id);
    
    return supabaseAdmin
      .from('enrollments')
      .select('learner_id', { count: 'exact', head: true })
      .in('class_id', classIds)
      .eq('status', 'ACTIVE');
  },
  getActiveClassesCount: async () => {
    return supabaseAdmin
      .from('classes')
      .select('*', { count: 'exact', head: true })
      .in('status', ['ONGOING', 'UPCOMING']);
  },
  getPendingInvoicesCount: async () => {
    return supabaseAdmin
      .from('invoices')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'PENDING');
  },
  getOpenTicketsCount: async () => {
    return supabaseAdmin
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Open');
  },
  getPendingChangeRequestsCount: async () => {
    return supabaseAdmin
      .from('change_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending');
  },
  getPendingConsultationsCount: async () => {
    return supabaseAdmin
      .from('consultation_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'Pending');
  },
  getGlobalUpcomingSessions: async () => {
    const now = new Date().toISOString().split('T')[0];
    return supabaseAdmin
      .from('class_sessions')
      .select('id, date, slot, session_number, classroom:classroom!classroom_id(room_name), tutor:account!tutor_id(full_name), classes(name, courses(title))')
      .gte('date', now)
      .order('date', { ascending: true })
      .order('slot', { ascending: true })
      .limit(4);
  },
  getOpenTickets: async () => {
    return supabaseAdmin
      .from('support_tickets')
      .select('id, title, created_at')
      .eq('status', 'Open')
      .limit(3);
  },
  getPendingChangeRequests: async () => {
    return supabaseAdmin
      .from('change_requests')
      .select('id, type, created_at')
      .eq('status', 'Pending')
      .order('created_at', { ascending: false })
      .limit(3);
  },
  getPendingInvoicesList: async () => {
    return supabaseAdmin
      .from('invoices')
      .select('id, invoice_code, created_at')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(3);
  },
  getPendingConsultations: async () => {
    return supabaseAdmin
      .from('consultation_requests')
      .select('id, guest_name, created_at')
      .eq('status', 'Pending')
      .order('created_at', { ascending: false })
      .limit(3);
  },

  // Admin
  getCoursesCount: async () => {
    return supabaseAdmin.from('courses').select('*', { count: 'exact', head: true });
  },
  getClassroomsCount: async () => {
    return supabaseAdmin.from('classroom').select('*', { count: 'exact', head: true });
  },
  getClassesCount: async () => {
    return supabaseAdmin.from('classes').select('*', { count: 'exact', head: true });
  },
  getPaidInvoices: async () => {
    return supabaseAdmin.from('invoices').select('amount').eq('status', 'PAID');
  },
  getPaidInstallments: async () => {
    return supabaseAdmin.from('invoice_installments').select('amount').eq('status', 'PAID');
  }
};
