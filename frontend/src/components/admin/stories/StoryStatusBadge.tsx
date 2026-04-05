import React from 'react';
import { cn } from '@/lib/utils';
import { StoryStatus } from '@/shared/types/company/projects/user-story.type';
import { 
  CheckCircle2, 
  CircleDashed, 
  CircleDot, 
  Clock 
} from 'lucide-react';

interface StoryStatusBadgeProps {
  status: StoryStatus;
  className?: string;
}

const StoryStatusBadge: React.FC<StoryStatusBadgeProps> = ({ status, className }) => {
  const config = {
    'Done': {
      icon: CheckCircle2,
      styles: 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5 dark:text-emerald-400 dark:border-emerald-500/20',
    },
    'In Progress': {
      icon: CircleDot,
      styles: 'text-blue-600 border-blue-500/20 bg-blue-500/5 dark:text-blue-400 dark:border-blue-500/20',
    },
    'Backlog': {
      icon: CircleDashed,
      styles: 'text-zinc-500 border-zinc-500/20 bg-zinc-500/5 dark:text-zinc-400 dark:border-zinc-500/20',
    },
    'Todo': {
      icon: Clock,
      styles: 'text-zinc-600 border-zinc-500/20 bg-zinc-500/5 dark:text-zinc-400 dark:border-zinc-500/20',
    }
  };

  const { icon: Icon, styles } = config[status as keyof typeof config] || config['Todo'];

  return (
    <div
      className={cn(
        // The SaaS Look: Low-saturation background, thin border, tight padding
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border',
        'text-[11px] font-semibold tracking-tight leading-none transition-all duration-200',
        styles,
        className
      )}
    >
      <Icon className="w-3 h-3 shrink-0 stroke-[2.5px]" />
      <span>{status}</span>
    </div>
  );
};

export default StoryStatusBadge;