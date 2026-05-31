export enum ActivityAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  OTHER = 'OTHER',
}

export class ActivityLogEntity {
  constructor(
    public readonly id: string,
    public readonly companyId: string | null, // null for super admin actions
    public readonly userId: string,
    public readonly userRole: string, // Employee, CompanyAdmin, SuperAdmin
    public readonly action: ActivityAction,
    public readonly details: string,
    public readonly ipAddress?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}
