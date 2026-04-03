import React from 'react';
import { cn } from '@/lib/utils';
import { StoryPoints } from '@/shared/types/company/projects/user-story.type';

interface StoryPointsBadgeProps {
  points: StoryPoints;
  className?: string;
}

const StoryPointsBadge: React.FC<StoryPointsBadgeProps> = ({ points, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20 transition-all duration-300',
        className
      )}
    >
      {points} pts
    </span>
  );
};

export default StoryPointsBadge;
