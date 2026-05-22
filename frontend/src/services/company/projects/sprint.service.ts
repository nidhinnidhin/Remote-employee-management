import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { Sprint, CreateSprintPayload, UpdateSprintPayload } from "@/shared/types/company/projects/sprint.type";
import { AxiosInstance } from "axios";

export const SprintService = {
  getSprintsByProject: async (projectId: string, api: AxiosInstance = clientApi) => {
    const response = await api.get<Sprint[]>(API_ROUTES.COMPANY.SPRINTS.BY_PROJECT(projectId));
    return response.data;
  },

  getSprintById: async (id: string, api: AxiosInstance = clientApi) => {
    const response = await api.get<Sprint>(API_ROUTES.COMPANY.SPRINTS.BY_ID(id));
    return response.data;
  },

  createSprint: async (projectId: string, payload: CreateSprintPayload, api: AxiosInstance = clientApi) => {
    const response = await api.post<Sprint>(`${API_ROUTES.COMPANY.SPRINTS.BASE}/${projectId}`, payload);
    return response.data;
  },

  updateSprint: async (id: string, payload: UpdateSprintPayload, api: AxiosInstance = clientApi) => {
    const response = await api.patch<Sprint>(API_ROUTES.COMPANY.SPRINTS.BY_ID(id), payload);
    return response.data;
  },
};
