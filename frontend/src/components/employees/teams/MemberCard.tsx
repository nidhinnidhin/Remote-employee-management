"use client";

import React, { useState } from "react";
import Image from "next/image";
import { DepartmentMember } from "@/shared/types/company/department.types";
import { Mail } from "lucide-react";

interface MemberCardProps {
  member: DepartmentMember;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  const [imgFailed, setImgFailed] = useState(false);
  const hasValidAvatar = member.avatar && !imgFailed;

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-lg group"
      style={{
        backgroundColor: "rgb(var(--color-surface))",
        borderColor: "rgb(var(--color-border-subtle))",
      }}
    >
      <div
        className="relative w-12 h-12 rounded-full overflow-hidden border-2 shrink-0 flex items-center justify-center text-sm font-bold uppercase select-none bg-white/[0.06]"
        style={{
          borderColor: "rgba(var(--color-text-muted), 0.15)",
          color: "rgb(var(--color-text-muted))",
        }}
      >
        {hasValidAvatar ? (
          <Image
            src={member.avatar}
            alt={member.name}
            fill
            className="object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span>{member.name ? member.name.charAt(0) : "M"}</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-semibold truncate"
          style={{ color: "rgb(var(--color-text))" }}
        >
          {member.name}
        </h4>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Mail size={12} className="text-muted-foreground" />
          <p
            className="text-xs truncate font-medium"
            style={{ color: "rgb(var(--color-text-muted))" }}
          >
            {member.email}
          </p>
        </div>
      </div>
    </div>
  );
};
