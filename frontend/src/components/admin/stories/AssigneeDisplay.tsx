import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AssigneeDisplayProps {
  name?: string;
  avatar?: string;
  className?: string;
}

const AssigneeDisplay: React.FC<AssigneeDisplayProps> = ({ name, avatar, className }) => {
  if (!name) {
    return (
      <div className={cn("flex items-center gap-2 text-muted text-[11px] font-medium italic", className)}>
        Unassigned
      </div>
    );
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className={cn("flex items-center gap-2 group/assignee cursor-default", className)} title={name}>
      <div className="h-7 w-7 rounded-full bg-[rgb(var(--color-accent-subtle))] border border-[rgb(var(--color-accent))]/20 flex items-center justify-center overflow-hidden shrink-0 transition-transform group-hover/assignee:scale-105">
        {avatar ? (
          <Image
            src={avatar}
            alt={name}
            width={28}
            height={28}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[10px] font-black text-[rgb(var(--color-accent))]">{initials}</span>
        )}
      </div>
      <span className="text-[11px] font-bold text-secondary group-hover/assignee:text-primary transition-colors truncate max-w-[100px]">
        {name}
      </span>
    </div>
  );
};

export default AssigneeDisplay;
