import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2 } from 'lucide-react';

interface AcceptanceCriteriaListProps {
  criteria: string[];
  className?: string;
}

const AcceptanceCriteriaList: React.FC<AcceptanceCriteriaListProps> = ({ criteria, className }) => {
  if (!criteria || criteria.length === 0) {
    return (
      <p className="text-xs text-muted/60 italic">No acceptance criteria defined.</p>
    );
  }

  return (
    <ul className={cn("space-y-2", className)}>
      {criteria.map((item, index) => (
        <li key={index} className="flex items-start gap-3 group/item">
          <div className="mt-0.5 flex-shrink-0">
            <CheckCircle2 size={14} className="text-accent/40 group-hover/item:text-accent transition-colors" />
          </div>
          <span className="text-secondary text-xs leading-relaxed group-hover/item:text-primary transition-colors">
            {item}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default AcceptanceCriteriaList;
