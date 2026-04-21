"use client";

import { DepartmentService } from "@/services/company/departments/department.service";
import { Department } from "@/shared/types/company/departments/department.type";

const handleActionError = (error: any, context: string) => {
  const serverData = error.response?.data;
  let message = "An unexpected error occurred";

  if (serverData) {
    if (Array.isArray(serverData.message)) {
      message = serverData.message[0]; 
    } else if (typeof serverData.message === 'string') {
      message = serverData.message;
    }
  } else {
    message = error.message || "Connection failed";
  }
  
  console.error(`[Department Action] ${context} failed:`, message);
  throw new Error(message); 
};

export const getDepartmentsAction = async (): Promise<Department[]> => {
  try {
    return await DepartmentService.getDepartments();
  } catch (error: any) {
    console.error("Error fetching departments:", error?.message);
    throw error;
  }
};

export const createDepartmentAction = async (name: string) => {
  try {
    return await DepartmentService.createDepartment(name);
  } catch (error: any) {
    throw handleActionError(error, "Create");
  }
};

export const updateDepartmentAction = async (id: string, name: string) => {
  try {
    if (!id) throw new Error("Missing department ID");
    return await DepartmentService.updateDepartment(id, name);
  } catch (error: any) {
    throw handleActionError(error, "Update");
  }
};

export const deleteDepartmentAction = async (id: string) => {
  try {
    return await DepartmentService.deleteDepartment(id);
  } catch (error: any) {
    console.error("Error deleting department:", error?.message);
    throw error;
  }
};

export const addEmployeeToDepartmentAction = async (departmentId: string, employeeId: string) => {
  try {
    return await DepartmentService.addEmployeeToDepartment(departmentId, employeeId);
  } catch (error: any) {
    console.error("Error assigning employee to department:", error?.message);
    throw error;
  }
};

export const removeEmployeeFromDepartmentAction = async (departmentId: string, employeeId: string) => {
  try {
    return await DepartmentService.removeEmployeeFromDepartment(departmentId, employeeId);
  } catch (error: any) {
    console.error("Error removing employee from department:", error?.message);
    throw error;
  }
};

