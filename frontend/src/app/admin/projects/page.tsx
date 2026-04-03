import { requireRole } from "@/lib/auth/unified-auth";
import ProjectsPage from "@/components/company/projects/ProjectsPage";

const Projects = async () => {
  // Protect the route - only allow COMPANY_ADMIN
  await requireRole("COMPANY_ADMIN");

  return (
    <ProjectsPage />
  );
}

export default Projects;
