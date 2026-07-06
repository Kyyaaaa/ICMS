import { DashboardRepository } from './dashboard.repository';
import { FinanceService } from '../finance/finance.service';
import {
  LearnerDashboardStats, LearnerUpcomingClass, LearnerPendingTask,
  TutorDashboardStats, TutorUpcomingClass, TutorPendingTask,
  StaffDashboardStats, StaffUpcomingClass, StaffPendingTask,
  AdminDashboardStats
} from './dashboard.model';

const SLOT_LABELS: Record<string, string> = {
  'slot1': '07:30 - 09:30',
  'slot2': '09:30 - 11:30',
  'slot3': '13:30 - 15:30',
  'slot4': '15:30 - 17:30',
  'slot5': '18:00 - 20:00',
  'slot6': '20:00 - 22:00'
};

function formatSlotTime(slot: string) {
    if (!slot) return 'TBA';
    const key = slot.toLowerCase().trim();
    return SLOT_LABELS[key] ? `Slot ${key.replace('slot', '')} (${SLOT_LABELS[key]})` : slot.replace('slot', 'Slot ');
}

export const DashboardService = {
  getLearnerStats: async (learnerId: string): Promise<LearnerDashboardStats> => {
    const { count: activeClasses } = await DashboardRepository.getLearnerActiveClasses(learnerId);
    
    const { data: attendances } = await DashboardRepository.getLearnerAttendances(learnerId);
    let attendanceRate = 100;
    if (attendances && attendances.length > 0) {
        const presentCount = attendances.filter(a => a.status === 'PRESENT').length;
        attendanceRate = Math.round((presentCount / attendances.length) * 100);
    }

    const { count: completedLessons } = await DashboardRepository.getLearnerCompletedLessons(learnerId);

    return {
      activeClasses: activeClasses || 0,
      attendanceRate,
      completedLessons: completedLessons || 0
    };
  },

  getLearnerUpcomingClasses: async (learnerId: string): Promise<LearnerUpcomingClass[]> => {
    const { data: enrollments } = await DashboardRepository.getLearnerEnrollments(learnerId);
    if (!enrollments || enrollments.length === 0) return [];

    const classIds = enrollments.map(e => e.class_id);
    const { data: sessions } = await DashboardRepository.getUpcomingSessionsByClassIds(classIds);
    if (!sessions) return [];

    return sessions.map((s: any) => ({
      id: s.id,
      month: new Date(s.date).toLocaleString('en-US', { month: 'short' }),
      day: new Date(s.date).getDate().toString(),
      name: s.classes?.name || 'Unknown Class',
      time: formatSlotTime(s.slot),
      courseName: s.classes?.courses?.title || 'Unknown Course',
      sessionNumber: s.session_number || 0,
      room: s.classroom?.room_name || 'TBA',
      tutor: s.tutor?.full_name || 'TBA'
    }));
  },

  getLearnerPendingTasks: async (learnerId: string): Promise<LearnerPendingTask[]> => {
    const { data: invoices } = await DashboardRepository.getLearnerPendingInvoices(learnerId);
    if (!invoices) return [];

    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
    const validInvoices = invoices.filter((inv: any) => {
        if (inv.status === 'PENDING' && inv.created_at && new Date(inv.created_at) < fifteenMinsAgo) {
            return false;
        }
        return true;
    });

    return validInvoices.map((inv: any) => {
        let title = `Pay Invoice ${inv.invoice_code}`;
        let targetDueDate = inv.due_date;
        let isOverdue = false;

        if (inv.invoice_installments && inv.invoice_installments.length > 0) {
            const nextInst = inv.invoice_installments
                .filter((i: any) => i.status === 'PENDING' || i.status === 'OVERDUE')
                .sort((a: any, b: any) => a.installment_number - b.installment_number)[0];

            if (nextInst) {
                title = `Pay Installment #${nextInst.installment_number} (${inv.invoice_code})`;
                targetDueDate = nextInst.due_date || targetDueDate;
                if (nextInst.status === 'OVERDUE' || (targetDueDate && new Date(targetDueDate) < new Date())) {
                    isOverdue = true;
                }
            }
        } else {
            isOverdue = Boolean(targetDueDate && new Date(targetDueDate) < new Date());
        }

        return {
            id: inv.id,
            title,
            courseName: inv.classes?.name || 'Course Payment',
            dueDate: isOverdue ? 'Overdue' : (targetDueDate ? `Due on ${new Date(targetDueDate).toLocaleDateString('vi-VN')}` : 'Pending Payment'),
            iconType: 'CreditCard',
            bg: isOverdue ? 'bg-red-50' : 'bg-amber-50',
            color: isOverdue ? 'text-red-600' : 'text-amber-600',
            link: '/learner/payments'
        };
    });
  },

  getTutorStats: async (tutorId: string): Promise<TutorDashboardStats> => {
    const { count: activeClasses } = await DashboardRepository.getTutorActiveClasses(tutorId);
    const { count: upcomingSessions } = await DashboardRepository.getTutorUpcomingSessionsCount(tutorId);
    const { count: pendingRequests } = await DashboardRepository.getTutorPendingRequestsCount(tutorId);
    const { count: totalStudents } = await DashboardRepository.getTutorTotalStudents(tutorId);

    return {
      activeClasses: activeClasses || 0,
      upcomingSessions: upcomingSessions || 0,
      pendingRequests: pendingRequests || 0,
      totalStudents: totalStudents || 0
    };
  },

  getTutorUpcomingClasses: async (tutorId: string): Promise<TutorUpcomingClass[]> => {
    const { data: sessions } = await DashboardRepository.getTutorUpcomingSessions(tutorId);
    if (!sessions) return [];
    
    const dateOnly = new Date().toISOString().split('T')[0];

    return sessions.map((s: any) => ({
      time: formatSlotTime(s.slot),
      name: s.classes?.name || 'Class',
      courseName: s.classes?.courses?.title || 'Unknown Course',
      sessionNumber: s.session_number || 0,
      room: s.classroom?.room_name || 'TBA',
      status: s.date === dateOnly ? 'In Progress' : 'Upcoming'
    }));
  },

  getTutorPendingTasks: async (tutorId: string): Promise<TutorPendingTask[]> => {
    const { data: requests } = await DashboardRepository.getTutorPendingRequests(tutorId);
    
    if (!requests || requests.length === 0) return [];

    return requests.map((req: any) => ({
      title: `Pending Request: ${req.type}`,
      type: 'Request',
      time: new Date(req.created_at).toLocaleDateString('vi-VN'),
      iconType: 'FileText',
      bg: 'bg-purple-50',
      color: 'text-purple-600',
      link: '/tutor/change-requests'
    }));
  },

  getStaffStats: async (): Promise<StaffDashboardStats> => {
    const { data: role } = await DashboardRepository.getRoleIdByName('LEARNER');
    let totalLearners = 0;
    if (role) {
      const { count } = await DashboardRepository.getAccountCountByRole(role.id);
      totalLearners = count || 0;
    }

    const { count: activeClasses } = await DashboardRepository.getActiveClassesCount();
    const { count: pendingInvoices } = await DashboardRepository.getPendingInvoicesCount();
    const { count: openTickets } = await DashboardRepository.getOpenTicketsCount();

    return {
      totalLearners,
      activeClasses: activeClasses || 0,
      pendingInvoices: pendingInvoices || 0,
      openTickets: openTickets || 0
    };
  },

  getStaffUpcomingClasses: async (): Promise<StaffUpcomingClass[]> => {
    const { data: sessions } = await DashboardRepository.getGlobalUpcomingSessions();
    if (!sessions) return [];
    
    const now = new Date().toISOString().split('T')[0];

    return sessions.map((s: any) => ({
      time: formatSlotTime(s.slot),
      name: s.classes?.name || 'Class',
      courseName: s.classes?.courses?.title || 'Unknown Course',
      sessionNumber: s.session_number || 0,
      room: s.classroom?.room_name || 'TBA',
      tutor: s.tutor?.full_name || 'TBA',
      status: s.date === now ? 'In Progress' : 'Upcoming'
    }));
  },

  getStaffPendingTasks: async (): Promise<StaffPendingTask[]> => {
    const { data: tickets } = await DashboardRepository.getOpenTickets();
    if (!tickets || tickets.length === 0) return [];

    return tickets.map((ticket: any) => ({
      title: ticket.title,
      type: 'Support Ticket',
      time: new Date(ticket.created_at).toLocaleDateString('vi-VN'),
      iconType: 'MessageSquare',
      bg: 'bg-rose-50',
      color: 'text-rose-600',
      link: '/staff/support'
    }));
  },

  getAdminStats: async (): Promise<AdminDashboardStats> => {
    const { data: role } = await DashboardRepository.getRoleIdByName('LEARNER');
    let totalLearners = 0;
    if (role) {
      const { count } = await DashboardRepository.getAccountCountByRole(role.id);
      totalLearners = count || 0;
    }

    const { count: totalCourses } = await DashboardRepository.getCoursesCount();
    const { count: totalClasses } = await DashboardRepository.getClassesCount();
    const { count: totalClassrooms } = await DashboardRepository.getClassroomsCount();

    // Calculate Net Balance using FinanceService to match Finance module
    const transactions = await FinanceService.getAllTransactions();
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.paidAmount || 0), 0);
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.paidAmount || 0), 0);
    const totalRevenue = totalIncome - totalExpense;

    return {
      totalRevenue,
      totalLearners,
      totalCourses: totalCourses || 0,
      totalClasses: totalClasses || 0, // In original it was just /staff/classes so it counts all classes
      totalClassrooms: totalClassrooms || 0
    };
  }
};
