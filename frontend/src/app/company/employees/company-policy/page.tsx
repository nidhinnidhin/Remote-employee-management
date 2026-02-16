"use client";

import React, { useState, useEffect } from "react";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import PolicyHeader from "@/components/company/policy/PolicyHeader";
import PolicyTabs from "@/components/company/policy/PolicyTabs";
import { PolicyTabType } from "@/shared/types/company/policy/policy-tab-map.type";
import WorkingHoursConfiguration from "@/components/company/policy/WorkingHoursConfiguration";
import LeavePolicyConfiguration from "@/components/company/policy/LeavePolicyConfiguration";
import {
  getAdminCompanyPolicies,
  createOrUpdateCompanyPolicies,
} from "@/services/company/policy/company-policy.service";
import { toast } from "sonner";

const CompanyPolicyPage = () => {
  const [activeTab, setActiveTab] =
    useState<PolicyTabType>("Working Hours");

  const [workingHoursData, setWorkingHoursData] = useState<any>(null);
  const [leaveData, setLeaveData] = useState<any>(null);

  const [initialWorkingHours, setInitialWorkingHours] =
    useState<any>(null);
  const [initialLeave, setInitialLeave] = useState<any>(null);

  // 🔥 FETCH SAVED POLICIES
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const policies = await getAdminCompanyPolicies();

        const working = policies.find(
          (p: any) => p.type === "WORKING_HOURS"
        );

        const leave = policies.find(
          (p: any) => p.type === "LEAVE_POLICY"
        );

        if (working) setInitialWorkingHours(working.content);
        if (leave) setInitialLeave(leave.content);
      } catch (error) {
        console.error("Failed to fetch policies", error);
      }
    };

    fetchPolicies();
  }, []);

  const handleSave = async () => {
    try {
      const policies: any[] = [];

      if (workingHoursData) {
        policies.push({
          type: "WORKING_HOURS",
          title: "Working Hours",
          content: workingHoursData,
        });
      }

      if (leaveData) {
        policies.push({
          type: "LEAVE_POLICY",
          title: "Leave Policy",
          content: leaveData,
        });
      }

      if (policies.length === 0) {
        toast.warning("No changes to save");
        return;
      }

      await createOrUpdateCompanyPolicies({ policies });

      toast.success("Policies updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update policies");
    }
  };

  return (
    <AdminLayoutWrapper>
      <PolicyHeader onSave={handleSave} />

      <PolicyTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="transition-all duration-300">
        {activeTab === "Working Hours" && (
          <WorkingHoursConfiguration
            onChange={setWorkingHoursData}
            initialData={initialWorkingHours}
          />
        )}

        {activeTab === "Leave Policy" && (
          <LeavePolicyConfiguration
            onChange={setLeaveData}
            initialData={initialLeave}
          />
        )}

        {activeTab !== "Working Hours" &&
          activeTab !== "Leave Policy" && (
            <div className="bg-white rounded-xl p-12 text-center border border-pink-50 shadow-sm">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⏳</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {activeTab}
              </h3>
              <p className="text-gray-500 max-w-sm mx-auto">
                This configuration is not yet included but will be added
                soon.
              </p>
            </div>
          )}
      </div>
    </AdminLayoutWrapper>
  );
};

export default CompanyPolicyPage;
