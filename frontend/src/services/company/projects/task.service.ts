import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { Task, CreateTaskPayload, UpdateTaskPayload, MoveTaskPayload, MyTasksResponse } from "@/shared/types/company/projects/task.type";

export const TaskService = {
  async getTasksByStory(storyId: string): Promise<Task[]> {
    const response = await clientApi.get(API_ROUTES.COMPANY.TASKS.BY_STORY(storyId));
    return response.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await clientApi.get(API_ROUTES.COMPANY.TASKS.BY_ID(id));
    return response.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await clientApi.post(API_ROUTES.COMPANY.TASKS.BASE, payload);
    return response.data;
  },

  async updateTask(id: string, payload: UpdateTaskPayload): Promise<Task> {
    const response = await clientApi.patch(API_ROUTES.COMPANY.TASKS.BY_ID(id), payload);
    return response.data;
  },

  async moveTask(id: string, payload: MoveTaskPayload): Promise<Task> {
    const response = await clientApi.patch(API_ROUTES.COMPANY.TASKS.MOVE(id), payload);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await clientApi.delete(API_ROUTES.COMPANY.TASKS.BY_ID(id));
  },

  async getMyTasks(): Promise<MyTasksResponse> {
    const response = await clientApi.get(API_ROUTES.COMPANY.TASKS.MY_TASKS);
    return response.data;
  },
};
