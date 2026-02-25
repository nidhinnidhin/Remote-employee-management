"use client";

import React, { useState } from "react";
import { Pencil, Mail, MapPin, Phone, Calendar } from "lucide-react";
import { clientApi } from "@/lib/axios/axiosClient";
import { useRef } from "react";

interface ProfileHeaderProps {
  name?: string;
  title?: string;
  department?: string;
  email?: string;
  phone?: string;
  address?: string;
  joinedDate?: string;
  avatarUrl?: string;
  onEditProfile?: () => void;
  onAvatarUploaded?: (url: string) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name = "John Doe",
  title = "Senior Backend Developer",
  department = "Engineering",
  email = "john.doe@company.com",
  phone = "+1 (555) 123-4567",
  address = "123 Tech Street, San Francisco, CA 94105",
  joinedDate = "3/15/2020",
  avatarUrl,
  onEditProfile,
  onAvatarUploaded,
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-bl from-indigo-100 via-purple-50 to-transparent rounded-2xl pointer-events-none" />

      <div className="relative px-8 py-7 flex items-start justify-between gap-6">
        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div
            className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl font-semibold text-indigo-600">
                  {name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
            )}

            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-medium transition ${
                uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              {uploading ? "Uploading..." : "Change"}
            </div>

            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
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
                    "/auth/upload-profile-image",
                    formData,
                  );

                  // Save permanent Cloudinary URL
                  onAvatarUploaded?.(res.data.imageUrl);
                } catch (error) {
                  console.error(error);
                  alert("Upload failed");
                } finally {
                  setUploading(false);
                }
              }}
            />
          </div>

          {/* Name, title, badge */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {name}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">{title}</p>
            <span className="inline-block mt-2 px-3 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
              {department}
            </span>

            {/* Contact info grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>{address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span>Joined {joinedDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
