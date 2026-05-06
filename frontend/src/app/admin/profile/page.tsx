"use client";

import React, { useState, useEffect } from "react";
import AdminLayoutWrapper from "@/components/company/layout/AdminLayoutWrapper";
import { useProfileStore } from "@/store/profile.store";
import { AdminProfileDetails } from "@/components/company/profile/AdminProfileDetails";
import { SubscriptionManagement } from "@/components/company/profile/SubscriptionManagement";
import { User, CreditCard } from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<"general" | "subscription">("general");
  const { userProfile, fetchProfile } = useProfileStore();

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AdminLayoutWrapper>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
            <p className="text-slate-400 mt-1">Manage your account and subscription preferences.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5">
          <button
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === "general"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <User size={16} />
            General
          </button>
          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
              activeTab === "subscription"
                ? "bg-accent text-white shadow-lg shadow-accent/20"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <CreditCard size={16} />
            Subscription
          </button>
        </div>

        <div className="min-h-[400px]">
          {activeTab === "general" ? (
            <AdminProfileDetails />
          ) : (
            userProfile?.companyId && (
              <SubscriptionManagement 
                companyId={userProfile.companyId} 
                userId={userProfile.id} 
              />
            )
          )}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
};

export default ProfilePage;
