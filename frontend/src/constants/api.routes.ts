export const API_ROUTES = {
    AUTH: {
        LOGIN: "/auth/login",
        REGISTER: "/auth/register",
        REFRESH: "/auth/refresh",
        LOGOUT: "/auth/logout",
        ONBOARD: "/auth/onboard",
        PASSWORD: {
            FORGOT: "/auth/password/forgot",
            VERIFY_RESET: "/auth/password/verify-reset",
            RESET: "/auth/password/reset",
        },
        OTP: {
            VERIFY: "/auth/otp/verify",
            RESEND: "/auth/otp/resend",
        },
        PROFILE: {
            ME: "/auth/profile/me",
            UPDATE: "/auth/profile/update",
            SKILLS: "/auth/profile/skills",
            REQUEST_EMAIL_CHANGE: "/auth/profile/request-email-change",
            VERIFY_EMAIL_CHANGE: "/auth/profile/verify-email-change",
            UPLOAD_IMAGE: "/auth/profile/upload-image",
        },
        DOCUMENTS: {
            BASE: "/auth/documents",
            BY_ID: (id: string) => `/auth/documents/${id}`,
        },
    },
    COMPANY: {
        EMPLOYEES: {
            BASE: "/company/employees",
            STATUS: (id: string) => `/company/employees/${id}/status`,
            RESEND_INVITE: (id: string) => `/company/employees/${id}/resend-invite`,
            VERIFY_INVITE: "/company/employees/verify-invite",
        },
        DEPARTMENTS: {
            GET_ALL: "/departments",
            GET_MY_DEPARTMENTS: "/departments/my-departments",
            CREATE: "/departments",
            UPDATE: (id: string) => `/departments/${id}`,
            DELETE: (id: string) => `/departments/${id}`,
            ADD_EMPLOYEE: "/departments/add-employee",
            REMOVE_EMPLOYEE: "/departments/remove-employee",
        },
        POLICIES: "/company-policies",
        PROJECTS: {
            BASE: "/projects",
            BY_ID: (id: string) => `/projects/${id}`,
        },
    },
    SUPER_ADMIN: {
        COMPANIES: "/super-admin/companies",
    },
} as const;
