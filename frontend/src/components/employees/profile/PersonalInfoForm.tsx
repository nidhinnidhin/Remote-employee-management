"use client";

import React, { useState } from "react";

interface PersonalInfoFormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  timeZone: string;
  emergencyContact: string;
  address: string;
}

const PersonalInfoForm: React.FC = () => {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    timeZone: "",
    emergencyContact: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    console.log("Save:", formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Personal Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>

        {/* Time Zone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Time Zone</label>
          <input
            type="text"
            name="timeZone"
            value={formData.timeZone}
            onChange={handleChange}
            placeholder="e.g. America/Los_Angeles"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>

        {/* Emergency Contact */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
          />
        </div>

        {/* Address — full width */}
        <div className="flex flex-col gap-1.5 md:col-span-2">
          <label className="text-sm font-medium text-gray-600">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition resize-none"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 transition-colors text-white text-sm font-semibold rounded-lg shadow-sm"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;