"use client";

import React from "react";
import { Edit3, Trash2, ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";
import Table from "@/components/ui/Table";
import { Column } from "@/shared/types/ui/table-props.type";
import { Project } from "@/shared/types/company/projects/project.type";
import ProjectStatusBadge from "./ProjectStatusBadge";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/date/date-format";

interface ProjectsTableProps {
  projects: Project[];
  isLoading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
  projects,
  isLoading,
  onEdit,
  onDelete,
}) => {
  const columns: Column<Project>[] = [
    {
      header: "Project Name",
      accessor: (project) => (
        <div className="flex flex-col">
          <span className="font-bold text-primary">{project.name}</span>
          <span className="text-[10px] text-muted truncate max-w-[200px]">
            {project.description || "No description"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (project) => <ProjectStatusBadge status={project.status} />,
    },
    {
      header: "Start Date",
      accessor: (project) => (
        <div className="flex items-center gap-2 text-xs text-secondary">
          <Calendar size={12} className="text-muted" />
          {project.startDate ? formatDate(project.startDate) : "N/A"}
        </div>
      ),
    },
    {
      header: "End Date",
      accessor: (project) => (
        <div className="flex items-center gap-2 text-xs text-secondary">
          <Calendar size={12} className="text-muted" />
          {project.endDate ? formatDate(project.endDate) : "N/A"}
        </div>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      accessor: (project) => (
        <div className="flex items-center justify-end gap-2">
          <Link href={`/admin/projects/${project._id || project.id}`}>
            <Button variant="ghost" className="p-2 h-auto" title="View Details">
              <ExternalLink size={16} className="text-accent" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="p-2 h-auto"
            title="Edit Project"
            onClick={() => onEdit(project)}
          >
            <Edit3 size={16} className="text-secondary hover:text-primary" />
          </Button>
          <Button
            variant="ghost"
            className="p-2 h-auto"
            title="Delete Project"
            onClick={() => onDelete(project)}
          >
            <Trash2 size={16} className="text-danger/70 hover:text-danger" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      data={projects}
      columns={columns}
      keyExtractor={(project) => project._id || project.id || ""}
      isLoading={isLoading}
      emptyMessage="No projects found. Create your first project to get started!"
    />
  );
};

export default ProjectsTable;
