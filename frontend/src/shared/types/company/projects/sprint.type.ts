export type SprintStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED';

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  status: SprintStatus;
  issueIds: string[];
  startDate?: string;
  endDate?: string;
  goal?: string;
  plannedPoints: number;
  completedPoints: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSprintPayload {
  name: string;
  projectId: string;
  goal?: string;
}

export interface UpdateSprintPayload {
  name?: string;
  goal?: string;
  status?: SprintStatus;
  startDate?: string;
  endDate?: string;
  issueIds?: string[];
}
