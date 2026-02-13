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
        <h1 className="text-3xl font-bold text-pink-500 mb-1">
          Company Policies & Rules
        </h1>
        <p className="text-gray-500">
          Configure company-wide policies and guidelines
        </p>
      </div>

      <Button
        onClick={onSave}
        className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-pink-200 transition-all"
      >
        Save Changes
      </Button>
    </div>
  );
};

export default PolicyHeader;
