import { FRONTEND_ROUTES } from "@/constants/frontend.routes";

/**
 * Role-based redirect map
 */
const ROLE_REDIRECTS: Record<string, string> = {
  SUPER_ADMIN: FRONTEND_ROUTES.SUPER_ADMIN.COMPANIES,
  COMPANY_ADMIN: FRONTEND_ROUTES.ADMIN.EMPLOYEES,
  EMPLOYEE: FRONTEND_ROUTES.EMPLOYEE.DASHBOARD,
};

/**
 * Get the appropriate dashboard URL for a given role
 */
export function getRedirectForRole(role: string): string {
  return ROLE_REDIRECTS[role] || FRONTEND_ROUTES.AUTH.LOGIN;
}
