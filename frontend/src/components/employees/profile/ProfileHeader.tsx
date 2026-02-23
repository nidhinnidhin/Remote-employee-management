"use client";

import React from "react";
import { Pencil, Mail, MapPin, Phone, Calendar } from "lucide-react";

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
}) => {
  return (
    <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-bl from-indigo-100 via-purple-50 to-transparent rounded-2xl pointer-events-none" />

      <div className="relative px-8 py-7 flex items-start justify-between gap-6">
        {/* Left: Avatar + Info */}
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white shadow">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-semibold text-indigo-600">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            )}
          </div>

          {/* Name, title, badge */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{name}</h1>
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

        {/* Right: Edit Profile button */}
        <div className="flex-shrink-0">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-medium rounded-lg shadow-sm"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};
