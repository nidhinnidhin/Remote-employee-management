import React from 'react';
import { cn } from '@/lib/utils';

export type ProjectStatus = 'Active' | 'Completed' | 'On Hold';

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (status: ProjectStatus) => {
    switch (status) {
      case 'Active':
        return 'bg-[rgb(34,197,94,0.15)] text-[#4ade80] border-[rgba(34,197,94,0.3)] shadow-[0_0_12px_rgba(34,197,94,0.2)]';
      case 'On Hold':
        return 'bg-[rgb(255,159,67,0.15)] text-[#fb923c] border-[rgba(255,159,67,0.3)] shadow-[0_0_12px_rgba(255,159,67,0.2)]';
      case 'Completed':
        return 'bg-[rgb(169,179,214,0.15)] text-[#a9b3d6] border-[rgba(169,179,214,0.3)]';
      default:
        return 'bg-[rgb(var(--color-badge-bg))] text-[rgb(var(--color-badge-text))]';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-300',
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default ProjectStatusBadge;
