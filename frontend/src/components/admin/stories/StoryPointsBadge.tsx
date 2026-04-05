import React from 'react';
import { cn } from '@/lib/utils';
import { StoryPoints } from '@/shared/types/company/projects/user-story.type';
import { Layers } from 'lucide-react'; // Represents stack/effort

interface StoryPointsBadgeProps {
  points: StoryPoints;
  className?: string;
}

const StoryPointsBadge: React.FC<StoryPointsBadgeProps> = ({ points, className }) => {
  return (
    <div
      className={cn(
        // Base: Monochromatic & clean
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md',
        'bg-zinc-100 text-zinc-600 border border-zinc-200/60',
        'dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50',
        // Typography
        'text-[11px] font-semibold tabular-nums leading-none tracking-tight',
        'transition-colors duration-200 select-none',
        className
      )}
    >
      <Layers className="w-3 h-3 opacity-70" strokeWidth={2.5} />
      <span>{points}</span>
      <span className="text-[9px] uppercase opacity-50 font-bold tracking-tighter">pts</span>
    </div>
  );
};

export default StoryPointsBadge;