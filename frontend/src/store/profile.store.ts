import { create } from "zustand";
import { clientApi as api } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";

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
  departments?: string[];
  title?: string;
  status: string;
  inviteStatus: string;
  hasPassword: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional fields
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
  isOnboarded?: boolean;
  provider?: string;
  skills?: string[];
}

interface ProfileState {
  userProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  setProfile: (profile: UserProfile | null) => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  userProfile: null,
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ userProfile: profile }),

  fetchProfile: async () => {
    // Only fetch if not already loaded or in error state
    if (get().userProfile && !get().error) return;

    set({ isLoading: true, error: null });
    try {
      const response = await api.get<UserProfile>(API_ROUTES.AUTH.PROFILE.ME);
      set({ userProfile: response.data, isLoading: false });
    } catch (err: any) {
      console.error("[profileStore] Fetch Error:", err);
      set({ 
        error: err.response?.data?.message || err.message || "Failed to fetch profile", 
        isLoading: false 
      });
    }
  },
}));
