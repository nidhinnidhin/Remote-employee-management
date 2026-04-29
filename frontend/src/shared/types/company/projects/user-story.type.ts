export type StoryStatus = 'Backlog' | 'In Progress' | 'Done';
export type StoryPriority = 'Low' | 'Medium' | 'High';

export interface UserStory {
  id: string;
  companyId: string;
  projectId: string;
  title: string;
  description: string;
  status: StoryStatus;
  priority: StoryPriority;
  assigneeId: string;
  acceptanceCriteria: string[];
  storyPoints: number;
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
  assigneeId: string;
  acceptanceCriteria: string[];
  storyPoints: number;
}

export interface UpdateStoryPayload extends Partial<Omit<CreateStoryPayload, 'projectId'>> {}
