import React from 'react';
import { cn } from '@/lib/utils';
import { StoryPriority } from '@/shared/types/company/projects/user-story.type';
import { 
  SignalHigh, 
  SignalMedium, 
  SignalLow, 
  AlertCircle 
} from 'lucide-react';

interface StoryPriorityBadgeProps {
  priority: StoryPriority;
  className?: string;
}

const StoryPriorityBadge: React.FC<StoryPriorityBadgeProps> = ({ priority, className }) => {
  const config = {
    High: {
      icon: SignalHigh,
      styles: 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30',
    },
    Medium: {
      icon: SignalMedium,
      styles: 'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30',
    },
    Low: {
      icon: SignalLow,
      styles: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30',
    },
    default: {
      icon: AlertCircle,
      styles: 'bg-slate-500/10 text-slate-600 border-slate-500/20 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-500/30',
    }
  };

  const { icon: Icon, styles } = config[priority] || config.default;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded border leading-none',
        'text-[11px] font-medium transition-all select-none', 
        styles,
        className
      )}
    >
      <Icon className="w-3 h-3 shrink-0" strokeWidth={2.5} />
      <span>{priority}</span>
    </div>
  );
};

export default StoryPriorityBadge;