import { requireRole } from "@/lib/auth/unified-auth";
import ProjectDetailsPage from "@/components/company/projects/ProjectDetailsPage";

const ProjectDetail = async () => {
  // Protect the route - only allow COMPANY_ADMIN
  await requireRole("COMPANY_ADMIN");

  return (
    <ProjectDetailsPage />
  );
}

export default ProjectDetail;
