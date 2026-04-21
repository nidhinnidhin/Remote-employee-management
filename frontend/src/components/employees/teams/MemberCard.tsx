import React from "react";
import Image from "next/image";
import { DepartmentMember } from "@/shared/types/company/department.types";
import { Mail } from "lucide-react";

interface MemberCardProps {
  member: DepartmentMember;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div 
      className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg group"
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        borderColor: "rgb(var(--color-border-subtle))",
      }}
    >
      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 shrink-0">
        <Image
          src={member.avatar}
          alt={member.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold truncate" style={{ color: "rgb(var(--color-text))" }}>
          {member.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Mail size={12} className="text-muted-foreground" />
          <p className="text-xs truncate font-medium" style={{ color: "rgb(var(--color-text-muted))" }}>
            {member.email}
          </p>
        </div>
      </div>
    </div>
  );
};
