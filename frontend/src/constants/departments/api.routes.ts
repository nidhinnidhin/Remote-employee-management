export const API_ROUTES = {
  COMPANY: {
    EMPLOYEES: {
      BASE: "/company/employees",
      STATUS: (id: string) => `/company/employees/${id}/status`,
      RESEND_INVITE: (id: string) =>
        `/company/employees/${id}/resend-invite`,
      VERIFY_INVITE: "/company/employees/verify-invite",
    },

    DEPARTMENTS: {
      GET_ALL: "/departments",
      CREATE: "/departments",
      UPDATE: (id: string) => `/departments/${id}`,
      DELETE: (id: string) => `/departments/${id}`,
      ADD_EMPLOYEE: "/departments/add-employee",
      REMOVE_EMPLOYEE: "/departments/remove-employee",
    },
  },

  AUTH: {
    REFRESH: "/auth/refresh",
  },
} as const;