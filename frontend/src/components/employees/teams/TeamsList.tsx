"use client";

import React from "react";
import { Department } from "@/shared/types/company/department.types";
import { DepartmentAccordion } from "./DepartmentAccordion";
import { Users2, Search } from "lucide-react";
import { motion } from "framer-motion";

interface TeamsListProps {
  departments: Department[];
}

export const TeamsList: React.FC<TeamsListProps> = ({ departments }) => {
  if (!departments || departments.length === 0) {
    return (
      <div 
        className="flex flex-col items-center justify-center p-20 rounded-3xl border border-dashed"
        style={{ borderColor: "rgba(var(--color-border-subtle), 0.5)" }}
      >
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "rgba(var(--color-accent), 0.1)" }}
        >
          <Users2 size={32} className="text-accent" style={{ color: "rgb(var(--color-accent))" }} />
        </div>
        <h3 className="text-xl font-bold mb-2">No Teams Found</h3>
        <p className="text-muted-foreground text-center max-w-xs">
          You haven&apos;t been assigned to any departments or teams yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">My Active Teams ({departments.length})</h2>
          <p className="text-sm text-muted-foreground mt-1 font-medium">Manage and collaborate with your team members across departments.</p>
        </div>
        
        <div className="relative group max-w-md w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-accent transition-colors duration-200" size={18} />
          <input
            type="text"
            placeholder="Search departments..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-surface/30 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium text-sm"
            style={{
              backgroundColor: "rgba(var(--color-surface), 0.3)",
              borderColor: "rgba(var(--color-border-subtle), 0.8)",
            }}
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        {departments.map((dept) => (
          <DepartmentAccordion key={dept.id} department={dept} />
        ))}
      </motion.div>
    </div>
  );
};
