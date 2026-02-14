"use client";

import React, { useEffect, useState } from "react";
import { PolicyHeader } from "./PolicyHeader";
import { PolicyTabs } from "./PolicyTabs";
import { WorkingHours } from "./tabs/WorkingHours";
import { LeavePolicy } from "./tabs/LeavePolicy";
import { motion, AnimatePresence } from "framer-motion";
import { getCompanyPolicies, CompanyPolicy } from "@/services/employee/policy/company-policy.service";

export function PolicyContainer() {
  const [activeTab, setActiveTab] = useState("working-hours");
  const [policies, setPolicies] = useState<CompanyPolicy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPolicies() {
      try {
        const data = await getCompanyPolicies();
        setPolicies(data);
      } catch (err) {
        console.error("Failed to fetch policies", err);
      } finally {
        setLoading(false);
      }
    }

    fetchPolicies();
  }, []);

  const workingHoursPolicy = policies.find(
    (p) => p.type === "WORKING_HOURS"
  );

  const leavePolicy = policies.find(
    (p) => p.type === "LEAVE_POLICY"
  );

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          Loading policies...
        </div>
      );
    }

    switch (activeTab) {
      case "working-hours":
        return (
          <WorkingHours
            sections={workingHoursPolicy?.content.sections || []}
          />
        );

      case "leave-policy":
        return (
          <LeavePolicy
            sections={leavePolicy?.content.sections || []}
          />
        );

      default:
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center space-y-4 animate-in fade-in duration-500">
            <h3 className="text-xl font-semibold text-slate-900">
              Policy Content Coming Soon
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We are currently updating our internal guidelines for this
              section. Please check back later or contact HR for
              assistance.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <PolicyHeader />

      <div className="space-y-6">
        <PolicyTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
