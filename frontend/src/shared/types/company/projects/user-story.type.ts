export type StoryStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Review' | 'Done';
export type StoryPriority = 'Low' | 'Medium' | 'High';
export type IssueType = 'Story' | 'Bug';

export interface UserStory {
  id: string;
  companyId: string;
  projectId: string;
  title: string;
  description: string;
  status: StoryStatus;
  priority: StoryPriority;
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
  status: StoryStatus;
  priority: StoryPriority;
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
