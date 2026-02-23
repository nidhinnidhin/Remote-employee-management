import React from "react";

interface EmptyTabProps {
  title: string;
}

const EmptyTab: React.FC<EmptyTabProps> = ({ title }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[200px]">
      <p className="text-sm text-gray-400">{title} — coming soon</p>
    </div>
  );
};

export default EmptyTab;