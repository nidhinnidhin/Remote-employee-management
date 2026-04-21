export interface DepartmentMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Department {
  id: string;
  name: string;
  companyId: string;
  employeeIds: DepartmentMember[];
  createdAt?: string;
  updatedAt?: string;
}
