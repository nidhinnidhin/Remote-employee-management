export enum UserStoryStatus {
  TODO = 'Todo',
  BACKLOG = 'Backlog',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'Review',
  DONE = 'Done',
}
export enum UserStoryPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
}
export type IssueType = 'Story' | 'Bug';

export interface UserStory {
  id: string;
  companyId: string;
  projectId: string;
  title: string;
  description: string;
  status: UserStoryStatus;
  priority: UserStoryPriority;
  type: IssueType;
  assigneeId: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  isInBacklog: boolean;
  attachments: string[];
  links: string[];
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateStoryPayload {
  projectId: string;
  title: string;
  description: string;
  status: UserStoryStatus;
  priority: UserStoryPriority;
  type: IssueType;
  assigneeId: string;
  acceptanceCriteria: string[];
  storyPoints?: number;
  isInBacklog?: boolean;
  addToActiveSprint?: boolean;
  attachments?: string[];
  links?: string[];
}

export interface UpdateStoryPayload extends Partial<Omit<CreateStoryPayload, 'projectId'>> {}
