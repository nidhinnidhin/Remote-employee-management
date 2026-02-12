"use client";

import React, { useState } from "react";
import { PolicyHeader } from "./PolicyHeader";
import { PolicyTabs } from "./PolicyTabs";
import { WorkingHours } from "./tabs/WorkingHours";
import { LeavePolicy } from "./tabs/LeavePolicy";
import { motion, AnimatePresence } from "framer-motion";

export function PolicyContainer() {
  const [activeTab, setActiveTab] = useState("working-hours");

  const renderTabContent = () => {
    switch (activeTab) {
      case "working-hours":
        return <WorkingHours />;
      case "leave-policy":
        return <LeavePolicy />;
      default:
        return (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center space-y-4 animate-in fade-in duration-500">
            <h3 className="text-xl font-semibold text-slate-900">
              Policy Content Coming Soon
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We are currently updating our internal guidelines for this
              section. Please check back later or contact HR for immediate
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
        <PolicyTabs activeTab={activeTab} onTabChange={setActiveTab} />

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
