"use client";

import React, { useState, useEffect } from "react";
import { useProfileStore } from "@/store/profile.store";
import FormInput from "@/components/ui/FormInput";
import Button from "@/components/ui/Button";
import { clientApi as api } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { toast } from "sonner";
import { User, Mail } from "lucide-react";

export const AdminProfileDetails: React.FC = () => {
  const { userProfile, fetchProfile } = useProfileStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || "");
      setLastName(userProfile.lastName || "");
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await api.patch(API_ROUTES.AUTH.PROFILE.UPDATE, {
        firstName,
        lastName,
      });
      toast.success("Profile updated successfully");
      await fetchProfile(true);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (!userProfile) return (
    <div className="flex items-center justify-center p-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
    </div>
  );

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-white mb-2">Personal Information</h2>
        <p className="text-slate-400 text-sm">Update your account details and manage how you appear on the platform.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="e.g. John"
            icon={<User size={18} />}
          />
          <FormInput
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="e.g. Doe"
            icon={<User size={18} />}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Email Address"
            name="email"
            value={userProfile.email}
            disabled
            readOnly
            onChange={() => {}}
            placeholder="john.doe@company.com"
            icon={<Mail size={18} />}
          />
          <div className="flex flex-col justify-end">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-1">
               Note: Email cannot be changed.
             </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex justify-end">
          <Button 
            type="submit" 
            isLoading={isUpdating}
            className="px-8 h-12 rounded-2xl bg-accent hover:bg-accent/90 text-white font-bold transition-all shadow-lg shadow-accent/20"
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};
