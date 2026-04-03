export type StoryStatus = 'Backlog' | 'In Progress' | 'Done';
export type StoryPriority = 'Low' | 'Medium' | 'High';
export type StoryPoints = 1 | 2 | 3 | 5 | 8 | 13;

export interface UserStory {
  id: string;
  companyId: string;
  projectId: string;
  title: string;
  description?: string;
  status: StoryStatus;
  priority: StoryPriority;
  storyPoints: StoryPoints;
  assigneeId?: string;
  acceptanceCriteria: string[];
  order: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

export interface CreateStoryPayload {
  projectId: string;
  title: string;
  description?: string;
  status?: StoryStatus;
  priority: StoryPriority;
  storyPoints: StoryPoints;
  assigneeId?: string;
  acceptanceCriteria: string[];
}

export interface UpdateStoryPayload extends Partial<Omit<CreateStoryPayload, 'projectId'>> {}
