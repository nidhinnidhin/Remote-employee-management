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
import { formatDate } from "@/lib/date/date-format";

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

  // ✅ Construct Address String
  const fullAddress = [
    user.streetAddress,
    user.city,
    user.state,
    user.country,
    user.zipCode
  ].filter(Boolean).join(", ");

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <ProfileHeader
          name={`${user.firstName} ${user.lastName}`.trim()}
          title={user.title || user.role || "Employee"}
          department={user.department}
          departments={user.departments || []}
          email={user.email}
          phone={user.phone}
          address={fullAddress}
          joinedDate={formatDate(user.createdAt)}
          avatarUrl={avatarUrl}
          onAvatarUploaded={(url) => setAvatarUrl(url)}
        />

        <ProfileTabs activeTab={activeTab} onChange={setActiveTab} />

        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
}
