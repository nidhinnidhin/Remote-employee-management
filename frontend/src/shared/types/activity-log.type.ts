export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  OTHER = 'OTHER',
}

export interface ActivityLog {
  id: string;
  companyId: string | null;
  userId: string;
  userRole: string;
  action: ActivityAction;
  details: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
}
