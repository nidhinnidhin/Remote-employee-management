import { clientApi } from "@/lib/axios/axiosClient";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";

export const getEmployees = async (): Promise<Employee[]> => {
    const response = await clientApi.get("/company/employees");
    // Backend returns Employee entities which might need mapping if frontend Employee type is different
    // For now assuming they match or are compatible enough for the table
    return response.data;
};

export const getEmployeeDetails = async (id: string): Promise<Employee> => {
    const response = await clientApi.get(`/company/employees/${id}`);
    return response.data;
};

export const updateEmployeeStatus = async (id: string, status: "ACTIVE" | "SUSPENDED"): Promise<{ message: string }> => {
    const response = await clientApi.patch(`/company/employees/${id}/status`, { status });
    return response.data;
};
