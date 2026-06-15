"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Users } from "lucide-react";
import { Department } from "@/shared/types/company/department.types";
import { MemberCard } from "./MemberCard";
import { cn } from "@/lib/utils";

interface DepartmentAccordionProps {
  department: Department;
}

export const DepartmentAccordion: React.FC<DepartmentAccordionProps> = ({
  department,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  // Track failed image URLs dynamically to prevent broken image crashes
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [teamImageFailed, setTeamImageFailed] = useState(false);

  const commonTeamImage =
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=200&h=200&auto=format&fit=crop";

  return (
    <div
      className="rounded-2xl border mb-4 overflow-hidden transition-all duration-300"
      style={{
        backgroundColor: "rgba(var(--color-surface), 0.5)",
        borderColor: "rgb(var(--color-border-subtle))",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-5 min-w-0">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-lg bg-white/[0.04] flex items-center justify-center">
            {commonTeamImage && !teamImageFailed ? (
              <Image
                src={commonTeamImage}
                alt="Team"
                fill
                className="object-cover"
                onError={() => setTeamImageFailed(true)}
              />
            ) : (
              <span 
                className="text-sm font-bold uppercase"
                style={{ color: "rgb(var(--color-text-muted))" }}
              >
                {department.name ? department.name.charAt(0) : "D"}
              </span>
            )}
          </div>
          <div className="text-left min-w-0">
            <h3
              className="text-lg font-bold truncate"
              style={{ color: "rgb(var(--color-text))" }}
            >
              {department.name}
            </h3>
            <div className="flex items-center gap-4 mt-1.5 font-medium">
              <div className="flex items-center gap-1.5">
                <Users size={14} className="text-muted-foreground" />
                <span
                  className="text-xs"
                  style={{ color: "rgb(var(--color-text-muted))" }}
                >
                  {department.employeeIds.length} members
                </span>
              </div>

              {/* Member Avatars Stack */}
              <div className="flex -space-x-2 overflow-hidden items-center ml-1">
                {department.employeeIds.slice(0, 5).map((member) => {
                  const hasValidAvatar = member.avatar && !failedImages[member.id];

                  return (
                    <div
                      key={member.id}
                      className="relative w-7 h-7 rounded-full border-2 overflow-hidden flex items-center justify-center text-[10px] font-bold uppercase shadow-sm bg-white/[0.08]"
                      style={{ 
                        borderColor: "rgb(var(--color-surface))",
                        color: "rgb(var(--color-text-muted))"
                      }}
                    >
                      {hasValidAvatar ? (
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          fill
                          className="object-cover"
                          onError={() => {
                            setFailedImages(prev => ({ ...prev, [member.id]: true }));
                          }}
                        />
                      ) : (
                        <span>
                          {member.name ? member.name.charAt(0) : "M"}
                        </span>
                      )}
                    </div>
                  );
                })}
                {department.employeeIds.length > 5 && (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] border-2 font-bold z-10"
                    style={{
                      backgroundColor: "rgb(var(--color-accent))",
                      borderColor: "rgb(var(--color-surface))",
                      color: "white",
                    }}
                  >
                    +{department.employeeIds.length - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 text-muted-foreground"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      {/* Accordion Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div
              className="px-5 pb-6 pt-2 "
              style={{ borderColor: "rgba(var(--color-border-subtle), 0.5)" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {department.employeeIds.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};