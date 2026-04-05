import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { UserStory, CreateStoryPayload, UpdateStoryPayload } from "@/shared/types/company/projects/user-story.type";
import { AxiosInstance } from "axios";

export const StoryService = {
  getStoriesByProject: async (projectId: string, api: AxiosInstance = clientApi) => {
    const response = await api.get<UserStory[]>(API_ROUTES.COMPANY.STORIES.BY_PROJECT(projectId));
    return response.data;
  },

  getStoryById: async (id: string, api: AxiosInstance = clientApi) => {
    const response = await api.get<UserStory>(API_ROUTES.COMPANY.STORIES.BY_ID(id));
    return response.data;
  },

  createStory: async (payload: CreateStoryPayload, api: AxiosInstance = clientApi) => {
    const response = await api.post<UserStory>(API_ROUTES.COMPANY.STORIES.BASE, payload);
    return response.data;
  },

  updateStory: async (id: string, payload: UpdateStoryPayload, api: AxiosInstance = clientApi) => {
    const response = await api.patch<UserStory>(API_ROUTES.COMPANY.STORIES.BY_ID(id), payload);
    return response.data;
  },

  deleteStory: async (id: string, api: AxiosInstance = clientApi) => {
    const response = await api.delete(API_ROUTES.COMPANY.STORIES.BY_ID(id));
    return response.data;
  },
};
