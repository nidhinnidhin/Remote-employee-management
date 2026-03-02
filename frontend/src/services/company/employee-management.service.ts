import { clientApi } from "@/lib/axios/axiosClient";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";

export const getEmployees = async () => {
    const response = await clientApi.get<Employee[]>("/company/employees");
    return response.data;
};

export const updateEmployeeStatus = async (id: string, status: string) => {
    const response = await clientApi.patch(`/company/employees/${id}/status`, { status });
    return response.data;
};

export const resendEmployeeInvite = async (employeeId: string) => {
    const response = await clientApi.post(`/company/employees/${employeeId}/resend-invite`);
    return response.data;
};
