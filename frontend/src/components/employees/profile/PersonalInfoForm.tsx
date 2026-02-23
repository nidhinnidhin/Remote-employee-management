"use client";

import React, { useState } from "react";
import { clientApi } from "@/lib/axios/axiosClient";
import { UserProfile } from "@/app/employees/profile/page";
import {
  Mail,
  Pencil,
  User,
  Phone,
  MapPin,
  Globe,
  Heart,
  Linkedin,
  Link,
  FileText,
  Shield,
  ChevronDown,
} from "lucide-react";


interface PersonalInfoFormData {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  bloodGroup: string;
  timeZone: string;
  bio: string;
  // Address
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  // Online Presence
  linkedIn: string;
  personalWebsite: string;
}



const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];
const MARITAL_OPTIONS = [
  "Single",
  "Married",
  "Divorced",
  "Widowed",
  "Prefer not to say",
];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const TIMEZONE_OPTIONS = [
  "Asia/Kolkata",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Australia/Sydney",
  "Pacific/Auckland",
];
const RELATION_OPTIONS = [
  "Spouse",
  "Parent",
  "Sibling",
  "Friend",
  "Child",
  "Other",
];


const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
      <Icon className="w-4 h-4 text-indigo-600" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
  required,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  icon?: React.ElementType;
  required?: boolean;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-350" />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border border-gray-200 rounded-lg py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition placeholder:text-gray-300 ${
          Icon ? "pl-9 pr-3" : "px-3"
        }`}
      />
    </div>
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition pr-9 cursor-pointer"
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  </div>
);


const PersonalInfoForm: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    bloodGroup: "",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    bio: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    linkedIn: "",
    personalWebsite: "",
  });

  const [newEmail, setNewEmail] = useState("");
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [emailSuccessMsg, setEmailSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      await clientApi.patch("/auth/me", formData);
      setSuccessMsg("Profile updated successfully.");
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEmailUpdate = async () => {
    if (!newEmail) return;
    setSavingEmail(true);
    setEmailError("");
    setEmailSuccessMsg("");
    try {
      await clientApi.patch("/auth/me/email", { email: newEmail });
      setEmailSuccessMsg(
        "Email update requested. Check your inbox to confirm.",
      );
      setEmailEditMode(false);
      setNewEmail("");
    } catch {
      setEmailError("Failed to update email. Please try again.");
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <SectionHeader
          icon={User}
          title="Basic Information"
          subtitle="Your personal details"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-5">
          <InputField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <InputField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <InputField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            type="tel"
            icon={Phone}
            placeholder="+1 (555) 000-0000"
          />
          <InputField
            label="Date of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            type="date"
          />
          <SelectField
            label="Gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={GENDER_OPTIONS}
            placeholder="Select gender"
          />
          <SelectField
            label="Marital Status"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleChange}
            options={MARITAL_OPTIONS}
            placeholder="Select status"
          />
          <InputField
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            icon={Globe}
            placeholder="e.g. Indian"
          />
          <SelectField
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            options={BLOOD_GROUP_OPTIONS}
            placeholder="Select blood group"
          />
          <div className="md:col-span-2">
            <SelectField
              label="Time Zone"
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              options={TIMEZONE_OPTIONS}
            />
          </div>

          {/* Bio */}
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us a little about yourself..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition resize-none placeholder:text-gray-300"
            />
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <SectionHeader
          icon={MapPin}
          title="Address"
          subtitle="Where are you based?"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-5">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Main Street, Apt 4B"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition placeholder:text-gray-300"
            />
          </div>
          <InputField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g. Mumbai"
          />
          <InputField
            label="State / Province"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="e.g. Maharashtra"
          />
          <InputField
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            icon={Globe}
            placeholder="e.g. India"
          />
          <InputField
            label="ZIP / Postal Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            placeholder="e.g. 400001"
          />
        </div>
      </div>

     
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <SectionHeader
          icon={Shield}
          title="Emergency Contact"
          subtitle="Who should we contact in an emergency?"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-7 gap-y-5">
          <InputField
            label="Full Name"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            icon={User}
            placeholder="Jane Doe"
          />
          <InputField
            label="Phone Number"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            type="tel"
            icon={Phone}
            placeholder="+1 (555) 000-0000"
          />
          <SelectField
            label="Relationship"
            name="emergencyContactRelation"
            value={formData.emergencyContactRelation}
            onChange={handleChange}
            options={RELATION_OPTIONS}
            placeholder="Select relation"
          />
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <SectionHeader
          icon={Link}
          title="Online Presence"
          subtitle="Links to your profiles"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-5">
          <InputField
            label="LinkedIn URL"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleChange}
            icon={Linkedin}
            placeholder="https://linkedin.com/in/yourname"
          />
          <InputField
            label="Personal Website"
            name="personalWebsite"
            value={formData.personalWebsite}
            onChange={handleChange}
            icon={Globe}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

     
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <SectionHeader
          icon={Mail}
          title="Email Address"
          subtitle="Changing email requires confirmation"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-medium">
              {user.email}
            </div>
            <span className="text-xs text-gray-400">Current email</span>
          </div>
          {!emailEditMode && (
            <button
              onClick={() => setEmailEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition"
            >
              <Pencil className="w-3.5 h-3.5" />
              Change
            </button>
          )}
        </div>

        {emailEditMode && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-4 max-w-md">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                New Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition placeholder:text-gray-300"
                />
              </div>
              <p className="text-xs text-gray-400">
                A confirmation link will be sent to your new email.
              </p>
            </div>

            {emailError && <p className="text-sm text-red-500">{emailError}</p>}
            {emailSuccessMsg && (
              <p className="text-sm text-green-600">{emailSuccessMsg}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleEmailUpdate}
                disabled={savingEmail || !newEmail}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition text-white text-sm font-semibold rounded-lg"
              >
                {savingEmail ? "Sending..." : "Update Email"}
              </button>
              <button
                onClick={() => {
                  setEmailEditMode(false);
                  setNewEmail("");
                  setEmailError("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
        <div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
          {!error && !successMsg && (
            <p className="text-xs text-gray-400">
              All changes are saved securely to your profile.
            </p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition text-white text-sm font-semibold rounded-lg shadow-sm"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
