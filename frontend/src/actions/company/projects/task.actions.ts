import { TaskService } from "@/services/company/projects/task.service";
import { CreateTaskPayload, UpdateTaskPayload, MoveTaskPayload, Task, MyTasksResponse } from "@/shared/types/company/projects/task.type";

export const getTasksByStoryAction = async (storyId: string) => {
  try {
    const data = await TaskService.getTasksByStory(storyId);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch tasks",
    };
  }
};

export const getTaskByIdAction = async (id: string) => {
  try {
    const data = await TaskService.getTaskById(id);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch task",
    };
  }
};

export const createTaskAction = async (payload: CreateTaskPayload) => {
  try {
    const data = await TaskService.createTask(payload);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to create task",
    };
  }
};

export const updateTaskAction = async (id: string, payload: UpdateTaskPayload) => {
  try {
    const data = await TaskService.updateTask(id, payload);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to update task",
    };
  }
};

export const moveTaskAction = async (id: string, payload: MoveTaskPayload) => {
  try {
    const data = await TaskService.moveTask(id, payload);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to move task",
    };
  }
};

export const deleteTaskAction = async (id: string) => {
  try {
    await TaskService.deleteTask(id);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to delete task",
    };
  }
};

export const fetchMyTasksAction = async () => {
  try {
    const data = await TaskService.getMyTasks();
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || "Failed to fetch your tasks",
    };
  }
};
