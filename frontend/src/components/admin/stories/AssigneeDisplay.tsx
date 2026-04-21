import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserCircle } from "lucide-react";

interface AssigneeDisplayProps {
  name?: string;
  avatar?: string;
  className?: string;
}

const AssigneeDisplay: React.FC<AssigneeDisplayProps> = ({
  name,
  avatar,
  className,
}) => {
  if (!name) {
    return (
      <div
        className={cn(
          "flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 transition-colors hover:text-zinc-600",
          className,
        )}
      >
        <UserCircle className="w-4 h-4 stroke-[1.5px]" />
        <span className="text-[11px] font-medium tracking-tight">
          Unassigned
        </span>
      </div>
    );
  }

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex items-center gap-2 group cursor-pointer select-none",
        className,
      )}
    >
      <div className="relative h-6 w-6 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-zinc-200 dark:bg-zinc-800 shadow-sm transition-transform group-hover:scale-105">
        {avatar ? (
          <Image src={avatar} alt={name} fill className="object-cover" />
        ) : (
          <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
            {initials}
          </span>
        )}
      </div>
      <span className="text-[12px] font-medium text-gray-200 dark:text-zinc-400 dark:group-hover:text-zinc-100 transition-colors truncate max-w-[120px] tracking-tight">
        {name}
      </span>
    </div>
  );
};

export default AssigneeDisplay;
