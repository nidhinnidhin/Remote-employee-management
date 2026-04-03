import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { UserStory, CreateStoryPayload, UpdateStoryPayload } from "@/shared/types/company/projects/user-story.type";

export const StoryService = {
  getStoriesByProject: async (projectId: string) => {
    const response = await clientApi.get<UserStory[]>(API_ROUTES.COMPANY.STORIES.BY_PROJECT(projectId));
    return response.data;
  },

  getStoryById: async (id: string) => {
    const response = await clientApi.get<UserStory>(API_ROUTES.COMPANY.STORIES.BY_ID(id));
    return response.data;
  },

  createStory: async (payload: CreateStoryPayload) => {
    const response = await clientApi.post<UserStory>(API_ROUTES.COMPANY.STORIES.BASE, payload);
    return response.data;
  },

  updateStory: async (id: string, payload: UpdateStoryPayload) => {
    const response = await clientApi.patch<UserStory>(API_ROUTES.COMPANY.STORIES.BY_ID(id), payload);
    return response.data;
  },

  deleteStory: async (id: string) => {
    const response = await clientApi.delete(API_ROUTES.COMPANY.STORIES.BY_ID(id));
    return response.data;
  },
};
