"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import ProfileTabs, { ProfileTab } from "@/components/employees/profile/ProfileTabs";
import PersonalInfoForm from "@/components/employees/profile/PersonalInfoForm";
import EmptyTab from "@/components/employees/profile/EmptyTab";
import { UserProfile } from "@/app/employees/profile/page";
import { ProfileHeader } from "./ProfileHeader";

export default function ProfileClient({ user }: { user: UserProfile }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal-info");

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal-info":
        return <PersonalInfoForm user={user} />;
      case "skills-bio":
        return <EmptyTab title="Skills & Bio" />;
      case "documents":
        return <EmptyTab title="Documents" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <ProfileHeader
          name={`${user.firstName} ${user.lastName}`.trim()}
          department={user.department}
          email={user.email}
          phone={user.phone}
          joinedDate={new Date(user.createdAt).toISOString().split("T")[0]}
        />
        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
}