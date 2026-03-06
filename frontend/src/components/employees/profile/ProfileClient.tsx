"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/employees/dashboard/DashboardLayout";
import ProfileTabs, {
  ProfileTab,
} from "@/components/employees/profile/ProfileTabs";
import PersonalInfoForm from "@/components/employees/profile/PersonalInfoForm";
import EmptyTab from "@/components/employees/profile/EmptyTab";
import { UserProfile } from "@/app/employee/profile/page";
import { ProfileHeader } from "./ProfileHeader";
import { SkillsForm } from "./SkillsForm";
import DocumentVault from "./DocumentsForm";

export default function ProfileClient({ user }: { user: UserProfile }) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("personal-info");

  // ✅ IMPORTANT — Avatar state
  const [avatarUrl, setAvatarUrl] = useState(user.profileImageUrl ?? "");

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal-info":
        return <PersonalInfoForm user={user} />;
      case "skills-bio":
        return <SkillsForm initialSkills={user.skills ?? []} />;
      case "documents":
      case "documents":
        return <DocumentVault />;
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
          avatarUrl={avatarUrl} // ✅ USE STATE
          onAvatarUploaded={(url) => setAvatarUrl(url)} // ✅ UPDATE STATE
        />

        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
}
