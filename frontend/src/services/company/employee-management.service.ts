import { clientApi } from "@/lib/axios/axiosClient";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import { API_ROUTES } from "@/constants/api.routes";

export const getEmployees = async () => {
    const response = await clientApi.get<Employee[]>(API_ROUTES.COMPANY.EMPLOYEES.BASE);
    return response.data;
};

export const updateEmployeeStatus = async (id: string, status: string) => {
    const response = await clientApi.patch(API_ROUTES.COMPANY.EMPLOYEES.STATUS(id), { status });
    return response.data;
};

export const resendEmployeeInvite = async (employeeId: string) => {
    const response = await clientApi.post(API_ROUTES.COMPANY.EMPLOYEES.RESEND_INVITE(employeeId));
    return response.data;
};
