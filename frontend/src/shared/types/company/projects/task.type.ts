export enum TaskStatus {
  TODO = 'Todo',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

export interface Task {
  id: string;
  companyId: string;
  projectId: string;
  storyId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  order: number;
  assignedTo?: string;
  assignedBy?: string;
  createdBy: string;
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateTaskPayload {
  projectId: string;
  storyId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  estimatedHours?: number;
  assignedTo?: string;
  dueDate?: string;
}

export interface UpdateTaskPayload extends Partial<Omit<CreateTaskPayload, 'projectId' | 'storyId'>> {
  actualHours?: number;
}

export interface MoveTaskPayload {
  status: TaskStatus;
  order: number;
}

export interface EmployeeTaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
}

export interface MyTasksResponse {
  tasks: Task[];
  stats: EmployeeTaskStats;
}
