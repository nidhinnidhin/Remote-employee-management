"use client";

import React, { useState } from "react";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import PolicyHeader from "@/components/company/policy/PolicyHeader";
import PolicyTabs, {
  PolicyTabType,
} from "@/components/company/policy/PolicyTabs";
import WorkingHoursConfiguration from "@/components/company/policy/WorkingHoursConfiguration";
import LeavePolicyConfiguration from "@/components/company/policy/LeavePolicyConfiguration";
import { createOrUpdateCompanyPolicies } from "@/services/company/policy/company-policy.service";

const CompanyPolicyPage = () => {
  const [activeTab, setActiveTab] = useState<PolicyTabType>("Working Hours");
  const [workingHoursData, setWorkingHoursData] = useState<any>(null);
  const [leaveData, setLeaveData] = useState<any>(null);

  const handleSave = async () => {
    try {
      const payload = {
        policies: [
          {
            type: "WORKING_HOURS",
            title: "Working Hours",
            content: workingHoursData,
          },
          {
            type: "LEAVE_POLICY",
            title: "Leave Policy",
            content: leaveData,
          },
        ],
      };

      console.log('payloadddddddddddddd',payload);

      await createOrUpdateCompanyPolicies(payload);
      alert("Policies saved successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to save policies");
    }
  };

  return (
    <AdminLayoutWrapper>
      <PolicyHeader onSave={handleSave} />

      <PolicyTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="transition-all duration-300">
        {activeTab === "Working Hours" && (
          <WorkingHoursConfiguration onChange={setWorkingHoursData} />
        )}

        {activeTab === "Leave Policy" && (
          <LeavePolicyConfiguration onChange={setLeaveData} />
        )}

        {activeTab !== "Working Hours" && activeTab !== "Leave Policy" && (
          <div className="bg-white rounded-xl p-12 text-center border border-pink-50 shadow-sm">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⏳</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              This configuration is not yet included but will be added soon.
            </p>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
};

export default CompanyPolicyPage;
