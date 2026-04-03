import React from 'react';
import { cn } from '@/lib/utils';
import { StoryStatus } from '@/shared/types/company/projects/user-story.type';

interface StoryStatusBadgeProps {
  status: StoryStatus;
  className?: string;
}

const StoryStatusBadge: React.FC<StoryStatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (s: StoryStatus) => {
    switch (s) {
      case 'Done':
        return 'bg-[rgb(var(--color-success-subtle))] text-[rgb(var(--color-success))] border-[rgb(var(--color-success-border))]';
      case 'In Progress':
        return 'bg-[rgb(var(--color-accent-subtle))] text-[rgb(var(--color-accent))] border-[rgb(var(--color-accent))] shadow-[0_0_12px_rgba(var(--color-accent),0.2)]';
      case 'Backlog':
        return 'bg-muted/10 text-muted border-muted/20';
      default:
        return 'bg-muted/10 text-muted border-muted/20';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all duration-300',
        getStatusStyles(status),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StoryStatusBadge;
