"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import ProfileHeader from "@/components/employees/profile/Profileheader";
import ProfileTabs, {
  ProfileTab,
} from "@/components/employees/profile/ProfileTabs";
import PersonalInfoForm from "@/components/employees/profile/PersonalInfoForm";
import EmptyTab from "@/components/employees/profile/EmptyTab";

const Profile = () => {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal-info");

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal-info":
        return <PersonalInfoForm />;
      case "skills-bio":
        return <EmptyTab title="Skills & Bio" />;
      case "documents":
        return <EmptyTab title="Documents" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <ProfileHeader />
        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
