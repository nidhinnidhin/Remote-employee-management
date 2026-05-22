
export interface Section {
  _id: string;
  title: string;
  points: string[];
}

export interface LeavePolicyProps {
  sections: Section[];
  leaveDistribution?: Array<{ type: string; days: number }>;
}

export interface WorkingHoursProps {
  sections: Section[];
  workStartTime?: string;
  workEndTime?: string;
  morningBreakStart?: string;
  morningBreakEnd?: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  eveningBreakStart?: string;
  eveningBreakEnd?: string;
}

export interface PolicySection {
  _id: string;
  title: string;
  points: string[];
}

export interface CompanyPolicy {
  _id: string;
  type: string;
  title: string;
  isActive: boolean;
  content: {
    sections: PolicySection[];
    workStartTime?: string;
    workEndTime?: string;
    morningBreakStart?: string;
    morningBreakEnd?: string;
    lunchBreakStart?: string;
    lunchBreakEnd?: string;
    eveningBreakStart?: string;
    eveningBreakEnd?: string;
  };
  leaveDistribution?: Array<{ type: string; days: number }>;
}