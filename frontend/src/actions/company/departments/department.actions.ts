"use client";

import { DepartmentService } from "@/services/company/departments/department.service";
import { Department } from "@/shared/types/company/departments/department.type";

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
    console.error("Error creating department:", error?.message);
    throw error;
  }
};

export const updateDepartmentAction = async (id: string, name: string) => {
  try {
    return await DepartmentService.updateDepartment(id, name);
  } catch (error: any) {
    console.error("Error updating department:", error?.message);
    throw error;
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
