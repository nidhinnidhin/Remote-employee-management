export interface AttendanceActivity {
  type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END';
  breakType: 'TEA' | 'LUNCH' | 'EVENING_TEA' | null;
  timestamp: string;
  remarks?: string;
}

export interface AttendanceLog {
  id: string;
  userId: string;
  companyId: string;
  date: string; // YYYY-MM-DD
  status: 'WORKING' | 'BREAK' | 'COMPLETED';
  clockIn: string;
  clockOut: string | null;
  activities: AttendanceActivity[];
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  createdAt?: string;
  updatedAt?: string;
  employeeName?: string; // Enhanced property for admin list
  employeeEmail?: string;
  lateReason?: string;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  adminRemarks?: string;
  earlyOutReason?: string;
  earlyOutApprovalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
  earlyOutAdminRemarks?: string;
  pendingBreakRequest?: {
    breakType: 'TEA' | 'LUNCH' | 'EVENING_TEA';
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    adminRemarks?: string;
  } | null;
}
