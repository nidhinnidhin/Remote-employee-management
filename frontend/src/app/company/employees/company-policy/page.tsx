"use client";

import React, { useState } from "react";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import PolicyHeader from "@/components/company/policy/PolicyHeader";
import PolicyTabs, { PolicyTabType } from "@/components/company/policy/PolicyTabs";
import WorkingHoursConfiguration from "@/components/company/policy/WorkingHoursConfiguration";

const CompanyPolicyPage = () => {
  const [activeTab, setActiveTab] = useState<PolicyTabType>("Working Hours");

  const handleSave = () => {
    // Logic to save changes
    console.log("Saving changes for", activeTab);
  };

  return (
    <AdminLayoutWrapper>
      <PolicyHeader onSave={handleSave} />

      <PolicyTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="transition-all duration-300">
        {activeTab === "Working Hours" && <WorkingHoursConfiguration />}
        {activeTab !== "Working Hours" && (
          <div className="bg-white rounded-xl p-12 text-center border border-pink-50 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{activeTab}</h3>
            <p className="text-gray-500 max-w-sm mx-auto">This configuration is not yet included but will be added soon.</p>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
};

export default CompanyPolicyPage;