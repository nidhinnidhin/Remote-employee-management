"use client";

import React, { useState, useRef } from "react";
import {
  Pencil,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Camera,
  Briefcase,
} from "lucide-react";
import { clientApi } from "@/lib/axios/axiosClient";
import { API_ROUTES } from "@/constants/api.routes";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  name?: string;
  title?: string;
  department?: string;
  departments?: string[];
  email?: string;
  phone?: string;
  address?: string;
  joinedDate?: string;
  avatarUrl?: string;
  onEditProfile?: () => void;
  onAvatarUploaded?: (url: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name = "User Name",
  title = "Position",
  department = "",
  departments = [],
  email = "",
  phone = "",
  address = "",
  joinedDate = "",
  avatarUrl,
  onAvatarUploaded,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await clientApi.post(
        API_ROUTES.AUTH.PROFILE.UPLOAD_IMAGE,
        formData,
      );
      onAvatarUploaded?.(res.data.imageUrl);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative p-8 rounded-[2rem] bg-white/[0.01] border border-white/[0.06] overflow-hidden">
      {/* SaaS Decorative Glow */}
      <div className="absolute top-0 right-0 w-[400px] h-full bg-gradient-to-bl from-accent/5 to-transparent pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* --- Avatar Section --- */}
        <div className="relative group shrink-0">
          <div
            className="w-32 h-32 rounded-3xl overflow-hidden bg-[#08090a] border border-white/[0.1] shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:border-accent/50 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-accent/5 text-accent text-3xl font-black">
                {(name || "User")
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "U"}
              </div>
            )}

            {/* Hover Overlay */}
            <div
              className={cn(
                "absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-opacity duration-300",
                uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Camera size={20} className="text-white" />
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">
                    Update
                  </span>
                </>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </div>

        {/* --- Content Section --- */}
        <div className="flex-1 text-center md:text-left">
          <div className="mb-4">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-1">
              {name}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="flex items-center gap-2 text-sm font-bold text-accent">
                <Briefcase size={14} strokeWidth={2.5} />
                {title}
              </span>
              {(departments.length > 0 ? departments : [department])
                .filter(Boolean)
                .map((dept) => (
                  <span
                    key={dept}
                    className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06] text-[10px] font-black uppercase tracking-widest text-slate-500"
                  >
                    {dept}
                  </span>
                ))}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/[0.04]">
            {[
              { icon: Mail, label: "Email Address", value: email },
              {
                icon: Phone,
                label: "Phone Contact",
                value: phone || "Not Provided",
              },
              {
                icon: MapPin,
                label: "Office Location",
                value: address || "Remote",
              },
              { icon: Calendar, label: "Date Joined", value: joinedDate },
            ].map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <item.icon
                    size={12}
                    className="text-slate-600"
                    strokeWidth={2}
                  />
                  <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-600">
                    {item.label}
                  </p>
                </div>
                <p className="text-xs font-bold text-slate-300 truncate">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
