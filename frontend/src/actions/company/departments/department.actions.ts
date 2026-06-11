"use client";

import { DepartmentService } from "@/services/company/departments/department.service";
import { Department } from "@/shared/types/company/departments/department.type";

const handleActionError = (error: unknown, context: string) => {
  const err = error as { response?: { data?: { message?: string | string[]; errors?: Record<string, string[]> } }; message?: string };
  const serverData = err.response?.data;
  let message = "An unexpected error occurred";

  if (serverData) {
    if (serverData.errors) {
      console.error(`[Department Action] ${context} validation errors:`, serverData.errors);
      const firstError = Object.values(serverData.errors)[0];
      if (Array.isArray(firstError)) {
        message = `${Object.keys(serverData.errors)[0]}: ${firstError[0]}`;
      }
    } else if (Array.isArray(serverData.message)) {
      message = serverData.message[0]; 
    } else if (typeof serverData.message === 'string') {
      message = serverData.message;
    }
  } else {
    message = err.message || "Connection failed";
  }
  
  console.error(`[Department Action] ${context} failed:`, message);
  throw new Error(message); 
};

export const getDepartmentsAction = async (): Promise<Department[]> => {
  try {
    return await DepartmentService.getDepartments();
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error fetching departments:", err?.message);
    throw error;
  }
};

export const searchDepartmentsAction = async (params: { page: number; limit: number; search?: string; employeeId?: string }): Promise<{ data: Department[]; total: number }> => {
  try {
    const { page, limit, search, employeeId } = params;
    return await DepartmentService.searchDepartments({ page, limit, search, employeeId });
  } catch (error: unknown) {
    throw handleActionError(error, "Search");
  }
};

export const createDepartmentAction = async (name: string) => {
  try {
    return await DepartmentService.createDepartment(name);
  } catch (error: unknown) {
    throw handleActionError(error, "Create");
  }
};

export const updateDepartmentAction = async (id: string, name: string) => {
  try {
    if (!id) throw new Error("Missing department ID");
    return await DepartmentService.updateDepartment(id, name);
  } catch (error: unknown) {
    throw handleActionError(error, "Update");
  }
};

export const deleteDepartmentAction = async (id: string) => {
  try {
    return await DepartmentService.deleteDepartment(id);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error deleting department:", err?.message);
    throw error;
  }
};

export const addEmployeeToDepartmentAction = async (departmentId: string, employeeId: string) => {
  try {
    return await DepartmentService.addEmployeeToDepartment(departmentId, employeeId);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error assigning employee to department:", err?.message);
    throw error;
  }
};

export const removeEmployeeFromDepartmentAction = async (departmentId: string, employeeId: string) => {
  try {
    return await DepartmentService.removeEmployeeFromDepartment(departmentId, employeeId);
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error removing employee from department:", err?.message);
    throw error;
  }
};

