import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { Task, CreateTaskPayload, UpdateTaskPayload, MoveTaskPayload, MyTasksResponse } from "@/shared/types/company/projects/task.type";
import { AxiosInstance } from "axios";

export const TaskService = {
  async getTasksByStory(storyId: string, api: AxiosInstance = clientApi): Promise<Task[]> {
    const response = await api.get(API_ROUTES.COMPANY.TASKS.BY_STORY(storyId));
    return response.data;
  },

  async getTaskById(id: string, api: AxiosInstance = clientApi): Promise<Task> {
    const response = await api.get(API_ROUTES.COMPANY.TASKS.BY_ID(id));
    return response.data;
  },

  async createTask(payload: CreateTaskPayload, api: AxiosInstance = clientApi): Promise<Task> {
    const response = await api.post(API_ROUTES.COMPANY.TASKS.BASE, payload);
    return response.data;
  },

  async updateTask(id: string, payload: UpdateTaskPayload, api: AxiosInstance = clientApi): Promise<Task> {
    const response = await api.patch(API_ROUTES.COMPANY.TASKS.BY_ID(id), payload);
    return response.data;
  },

  async moveTask(id: string, payload: MoveTaskPayload, api: AxiosInstance = clientApi): Promise<Task> {
    const response = await api.patch(API_ROUTES.COMPANY.TASKS.MOVE(id), payload);
    return response.data;
  },

  async deleteTask(id: string, api: AxiosInstance = clientApi): Promise<void> {
    await api.delete(API_ROUTES.COMPANY.TASKS.BY_ID(id));
  },

  async getMyTasks(api: AxiosInstance = clientApi): Promise<MyTasksResponse> {
    const response = await api.get(API_ROUTES.COMPANY.TASKS.MY_TASKS);
    return response.data;
  },
};
