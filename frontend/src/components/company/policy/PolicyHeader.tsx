"use client";

import React from "react";
import Button from "@/components/ui/Button";

interface PolicyHeaderProps {
  onSave: () => void;
}

const PolicyHeader: React.FC<PolicyHeaderProps> = ({ onSave }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-accent mb-1">
          Company Policies & Rules
        </h1>
        <p className="text-secondary">
          Configure company-wide policies and guidelines
        </p>
      </div>

      <Button
        onClick={onSave}
        className="btn-primary px-8 py-2.5"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default PolicyHeader;
