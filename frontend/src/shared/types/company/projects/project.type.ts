export interface Project {
  _id: string;
  id?: string; // Standardize for code that uses .id
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status: 'Active' | 'Completed' | 'On Hold' | 'Planning';
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: 'Active' | 'Completed' | 'On Hold' | 'Planning';
  members?: string[];
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> { }
