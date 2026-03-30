import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/departments/api.routes";
import { Department } from "@/shared/types/company/departments/department.type";

export const DepartmentService = {
  async getDepartments(): Promise<Department[]> {
    const res = await clientApi.get(
      API_ROUTES.COMPANY.DEPARTMENTS.GET_ALL
    );
    return res.data;
  },

  async createDepartment(name: string) {
    const res = await clientApi.post(
      API_ROUTES.COMPANY.DEPARTMENTS.CREATE,
      { name }
    );
    return res.data;
  },

  async addEmployeeToDepartment(
    departmentId: string,
    employeeId: string
  ) {
    const res = await clientApi.post(
      API_ROUTES.COMPANY.DEPARTMENTS.ADD_EMPLOYEE,
      { departmentId, employeeId }
    );
    return res.data;
  },

  async updateDepartment(id: string, name: string) {
    const res = await clientApi.patch(
      API_ROUTES.COMPANY.DEPARTMENTS.UPDATE(id),
      { name }
    );
    return res.data;
  },

  async deleteDepartment(id: string) {
    const res = await clientApi.delete(
      API_ROUTES.COMPANY.DEPARTMENTS.DELETE(id)
    );
    return res.data;
  },

  async removeEmployeeFromDepartment(
    departmentId: string,
    employeeId: string
  ) {
    const res = await clientApi.post(
      API_ROUTES.COMPANY.DEPARTMENTS.REMOVE_EMPLOYEE,
      { departmentId, employeeId }
    );
    return res.data;
  },
};