"use client";

import React, { useState, useEffect } from "react";
import { Plus, Briefcase } from "lucide-react";
import AdminLayoutWrapper from "../layout/AdminLayoutWrapper";
import Button from "@/components/ui/Button";
import ProjectsTable from "./ProjectsTable";
import CreateProjectModal from "./modals/CreateProjectModal";
import EditProjectModal from "./modals/EditProjectModal";
import DeleteProjectConfirmation from "./modals/DeleteProjectConfirmation";
import { Project } from "@/shared/types/company/projects/project.type";
import { getAllProjectsAction, deleteProjectAction } from "@/actions/company/projects/project.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    const result = await getAllProjectsAction();
    if (result.success && result.data) {
      setProjects(result.data);
    } else {
      toast.error(result.error || PROJECT_MESSAGES.PROJECT_FETCH_FAILED);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedProject) return;
    const result = await deleteProjectAction(selectedProject._id || selectedProject.id || "");
    if (result.success) {
      toast.success(PROJECT_MESSAGES.PROJECT_DELETED);
      fetchProjects();
    } else {
      toast.error(result.error || PROJECT_MESSAGES.PROJECT_DELETE_FAILED);
    }
  };

  return (
    <AdminLayoutWrapper>
      <div className="flex flex-col gap-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="section-icon-wrap">
                <Briefcase className="section-icon" />
              </div>
              <h1 className="text-3xl font-black text-primary tracking-tight font-heading">
                Projects
              </h1>
            </div>
            <p className="text-muted text-sm font-medium ml-11">
              Manage all company projects and tracking.
            </p>
          </div>

          <Button
            variant="primary"
            className="flex items-center gap-2 px-6"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={18} strokeWidth={2.5} />
            <span>Create Project</span>
          </Button>
        </div>

        {/* Table Section */}
        <ProjectsTable
          projects={projects}
          isLoading={loading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Modals */}
      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={fetchProjects}
      />

      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
        }}
        onSuccess={fetchProjects}
        project={selectedProject}
      />

      <DeleteProjectConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={handleDeleteConfirm}
        projectName={selectedProject?.name || ""}
      />
    </AdminLayoutWrapper>
  );
};

export default ProjectsPage;
