
export interface Section {
  _id: string;
  title: string;
  points: string[];
}

export interface LeavePolicyProps {
  sections: Section[];
}

export interface WorkingHoursProps {
  sections: Section[];
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
  };
}