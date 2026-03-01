/**
 * Role-based redirect map
 */
const ROLE_REDIRECTS: Record<string, string> = {
  SUPER_ADMIN: "/super-admin/companies",
  COMPANY_ADMIN: "/admin/employees",
  EMPLOYEE: "/employee/dashboard",
};

/**
 * Get the appropriate dashboard URL for a given role
 */
export function getRedirectForRole(role: string): string {
  return ROLE_REDIRECTS[role] || "/auth/login";
}
