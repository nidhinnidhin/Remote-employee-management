// app/employees/profile/page.tsx (or pages equivalent)
import { getSession } from "@/lib/iron-session/getSession";
import { getServerApi } from "@/lib/axios/axiosSeriver";
import { redirect } from "next/navigation";
import ProfileClient from "@/components/employees/profile/ProfileClient";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone: string;
  profileImageUrl?: string;
  companyId: string;
  department: string;
  status: string;
  inviteStatus: string;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;

  // 🔥 ADD ALL PROFILE FIELDS
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  bloodGroup?: string;
  timeZone?: string;
  bio?: string;

  streetAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;

  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;

  linkedInUrl?: string;
  personalWebsite?: string;

  skills?: string[];
  documents?: {
    _id: string;
    name: string;
    category: string;
    fileUrl: string;
    publicId: string;
    uploadedAt: string;
  }[];
}

export default async function ProfilePage() {
  let user: UserProfile | null = null;

  try {
    const api = await getServerApi();
    const res = await api.get<UserProfile>("/auth/me");
    user = res.data;
  } catch (err: any) {
    console.error(
      "PROFILE PAGE SERVER ERROR:",
      err?.message,
      err?.response?.status,
    );
    redirect("/company/login");
  }

  return <ProfileClient user={user} />;
}
