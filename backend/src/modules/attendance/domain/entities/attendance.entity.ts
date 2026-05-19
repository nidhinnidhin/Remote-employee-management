export class AttendanceActivityEntity {
  constructor(
    public readonly type: 'CLOCK_IN' | 'CLOCK_OUT' | 'BREAK_START' | 'BREAK_END',
    public readonly breakType: 'TEA' | 'LUNCH' | 'EVENING_TEA' | null,
    public readonly timestamp: Date,
    public readonly remarks?: string,
  ) {}
}

export class AttendanceEntity {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly companyId: string,
    public readonly date: string, // formatted as YYYY-MM-DD
    public readonly status: 'WORKING' | 'BREAK' | 'COMPLETED',
    public readonly clockIn: Date,
    public readonly clockOut: Date | null,
    public readonly activities: AttendanceActivityEntity[],
    public readonly totalWorkMinutes: number,
    public readonly totalBreakMinutes: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly employeeName?: string,
    public readonly employeeEmail?: string,
  ) {}
}
