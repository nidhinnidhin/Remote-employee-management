export interface DepartmentTeam {
  id: string;
  name: string;
  memberCount?: number;
}

export interface Department {
  id: string;
  name: string;
  companyId: string;
  employeeIds: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  }[];
  createdAt: string;
  updatedAt: string;

  // UI derived fields (optional)
  teamCount?: number;
  teams?: DepartmentTeam[];
}