import { ProjectService } from "@/services/company/projects/project.service";
import { CreateProjectPayload, UpdateProjectPayload } from "@/shared/types/company/projects/project.type";

export const getAllProjectsAction = async () => {
  try {
    const data = await ProjectService.getAllProjects();
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching projects:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch projects" };
  }
};

export const getProjectByIdAction = async (id: string) => {
  try {
    const data = await ProjectService.getProjectById(id);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching project:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch project" };
  }
};

export const createProjectAction = async (payload: CreateProjectPayload) => {
  try {
    const data = await ProjectService.createProject(payload);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating project:", error?.message);
    return { success: false, error: error?.message || "Failed to create project" };
  }
};

export const updateProjectAction = async (id: string, payload: UpdateProjectPayload) => {
  try {
    const data = await ProjectService.updateProject(id, payload);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error updating project:", error?.message);
    return { success: false, error: error?.message || "Failed to update project" };
  }
};

export const deleteProjectAction = async (id: string) => {
  try {
    await ProjectService.deleteProject(id);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error?.message);
    return { success: false, error: error?.message || "Failed to delete project" };
  }
};
