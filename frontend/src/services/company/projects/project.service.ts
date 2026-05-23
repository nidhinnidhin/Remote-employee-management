import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import {
  Project,
  CreateProjectPayload,
  UpdateProjectPayload,
} from "@/shared/types/company/projects/project.type";
import { AxiosInstance } from "axios";

export const ProjectService = {
  getAllProjects: async (api: AxiosInstance = clientApi) => {
    const response = await api.get<Project[]>(API_ROUTES.COMPANY.PROJECTS.BASE);
    return response.data;
  },

  getProjectById: async (id: string, api: AxiosInstance = clientApi) => {
    const response = await api.get<Project>(
      API_ROUTES.COMPANY.PROJECTS.BY_ID(id),
    );
    return response.data;
  },

  createProject: async (
    payload: CreateProjectPayload,
    api: AxiosInstance = clientApi,
  ) => {
    const response = await api.post<Project>(
      API_ROUTES.COMPANY.PROJECTS.BASE,
      payload,
    );
    return response.data;
  },

  updateProject: async (
    id: string,
    payload: UpdateProjectPayload,
    api: AxiosInstance = clientApi,
  ) => {
    const response = await api.patch<Project>(
      API_ROUTES.COMPANY.PROJECTS.BY_ID(id),
      payload,
    );
    return response.data;
  },

  deleteProject: async (id: string, api: AxiosInstance = clientApi) => {
    const response = await api.delete(API_ROUTES.COMPANY.PROJECTS.BY_ID(id));
    return response.data;
  },

  uploadResource: async (
    formData: FormData,
    api: AxiosInstance = clientApi,
  ) => {
    const response = await api.post<{ url: string; publicId: string }>(
      API_ROUTES.COMPANY.PROJECTS.UPLOAD,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  searchProjects: async (
    params: { page: number; limit: number; search?: string; memberId?: string },
    api: AxiosInstance = clientApi,
  ) => {
    const response = await api.get<{ data: Project[]; total: number }>(
      API_ROUTES.COMPANY.PROJECTS.SEARCH,
      { params },
    );
    return response.data;
  },
};
