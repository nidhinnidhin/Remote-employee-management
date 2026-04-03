import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { Project, CreateProjectPayload, UpdateProjectPayload } from "@/shared/types/company/projects/project.type";

export const ProjectService = {
  getAllProjects: async () => {
    const response = await clientApi.get<Project[]>(API_ROUTES.COMPANY.PROJECTS.BASE);
    return response.data;
  },

  getProjectById: async (id: string) => {
    const response = await clientApi.get<Project>(API_ROUTES.COMPANY.PROJECTS.BY_ID(id));
    return response.data;
  },

  createProject: async (payload: CreateProjectPayload) => {
    const response = await clientApi.post<Project>(API_ROUTES.COMPANY.PROJECTS.BASE, payload);
    return response.data;
  },

  updateProject: async (id: string, payload: UpdateProjectPayload) => {
    const response = await clientApi.patch<Project>(API_ROUTES.COMPANY.PROJECTS.BY_ID(id), payload);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await clientApi.delete(API_ROUTES.COMPANY.PROJECTS.BY_ID(id));
    return response.data;
  },
};
