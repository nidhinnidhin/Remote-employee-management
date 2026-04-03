import React from 'react';
import { cn } from '@/lib/utils';
import { StoryPriority } from '@/shared/types/company/projects/user-story.type';

interface StoryPriorityBadgeProps {
  priority: StoryPriority;
  className?: string;
}

const StoryPriorityBadge: React.FC<StoryPriorityBadgeProps> = ({ priority, className }) => {
  const getPriorityStyles = (p: StoryPriority) => {
    switch (p) {
      case 'High':
        return 'bg-[rgb(var(--color-danger-subtle))] text-[rgb(var(--color-danger))] border-[rgb(var(--color-danger-border))] shadow-[0_0_12px_rgba(var(--color-danger),0.2)]';
      case 'Medium':
        return 'bg-[rgb(var(--color-warning-subtle))] text-[rgb(var(--color-warning))] border-[rgb(var(--color-warning-border))]';
      case 'Low':
        return 'bg-[rgb(var(--color-success-subtle))] text-[rgb(var(--color-success))] border-[rgb(var(--color-success-border))]';
      default:
        return 'bg-muted/10 text-muted border-muted/20';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border transition-all duration-300',
        getPriorityStyles(priority),
        className
      )}
    >
      {priority}
    </span>
  );
};

export default StoryPriorityBadge;
