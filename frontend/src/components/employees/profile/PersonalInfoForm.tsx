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
import BaseModal from "@/components/ui/BaseModal";
import Button from "@/components/ui/Button";
import OtpInput from "@/components/ui/OtpInput";

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
  <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100" style={{ borderColor: "rgb(var(--color-border-subtle))" }}>
    <div className="section-icon-wrap">
      <Icon className="section-icon" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
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
    <label className="text-xs font-medium text-secondary uppercase tracking-wide">
      {label} {required && <span className="text-danger">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`field-input transition placeholder:text-muted ${Icon ? "pl-9" : ""
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
    <label className="text-xs font-medium text-secondary uppercase tracking-wide">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="field-input transition pr-9 cursor-pointer appearance-none"
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
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
    </div>
  </div>
);

const PersonalInfoForm: React.FC<{ user: UserProfile }> = ({ user }) => {
  const [formData, setFormData] = useState<PersonalInfoFormData>({
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    phone: user.phone ?? "",
    dateOfBirth: user.dateOfBirth?.split("T")[0] ?? "",
    gender: user.gender ?? "",
    nationality: user.nationality ?? "",
    maritalStatus: user.maritalStatus ?? "",
    bloodGroup: user.bloodGroup ?? "",
    timeZone: user.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    bio: user.bio ?? "",

    street: user.streetAddress ?? "",
    city: user.city ?? "",
    state: user.state ?? "",
    country: user.country ?? "",
    zipCode: user.zipCode ?? "",

    emergencyContactName: user.emergencyContactName ?? "",
    emergencyContactPhone: user.emergencyContactPhone ?? "",
    emergencyContactRelation: user.emergencyContactRelation ?? "",

    linkedIn: user.linkedInUrl ?? "",
    personalWebsite: user.personalWebsite ?? "",
  });

  const [newEmail, setNewEmail] = useState("");
  const [emailEditMode, setEmailEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [emailSuccessMsg, setEmailSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

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
      await clientApi.patch("/auth/profile", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        gender: formData.gender,
        maritalStatus: formData.maritalStatus,
        nationality: formData.nationality,
        bloodGroup: formData.bloodGroup,
        timeZone: formData.timeZone,
        bio: formData.bio,

        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,

        streetAddress: formData.street, // 🔥 FIXED
        linkedInUrl: formData.linkedIn, // 🔥 FIXED
        personalWebsite: formData.personalWebsite,

        emergencyContactName: formData.emergencyContactName,
        emergencyContactPhone: formData.emergencyContactPhone,
        emergencyContactRelation: formData.emergencyContactRelation,

        // Only send date if not empty
        ...(formData.dateOfBirth && {
          dateOfBirth: formData.dateOfBirth,
        }),
      });
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
      await clientApi.post("/auth/request-email-change", {
        newEmail,
      });

      setOtpModalOpen(true);
      setEmailSuccessMsg("OTP sent to your registered email. Please verify.");
    } catch (err: any) {
      setEmailError(
        err.response?.data?.message || "Failed to request email change.",
      );
    } finally {
      setSavingEmail(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter complete OTP.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");

    try {
      await clientApi.post("/auth/verify-email-change", {
        otp,
      });

      setOtpModalOpen(false);
      setEmailEditMode(false);
      setNewEmail("");
      setOtp("");
      window.location.reload(); // refresh profile
    } catch (err: any) {
      setOtpError(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="portal-card p-7">
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
            <label className="text-xs font-medium text-secondary uppercase tracking-wide">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us a little about yourself..."
              className="field-input transition resize-none placeholder:text-muted"
            />
          </div>
        </div>
      </div>

      <div className="portal-card p-7">
        <SectionHeader
          icon={MapPin}
          title="Address"
          subtitle="Where are you based?"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-5">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-xs font-medium text-secondary uppercase tracking-wide">
              Street Address
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="123 Main Street, Apt 4B"
              className="field-input transition placeholder:text-muted"
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

      <div className="portal-card p-7">
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

      <div className="portal-card p-7">
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

      <div className="portal-card p-7">
        <SectionHeader
          icon={Mail}
          title="Email Address"
          subtitle="Changing email requires confirmation"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="portal-badge-inner px-4 py-2 text-sm font-medium">
              {user.email}
            </div>
            <span className="text-xs text-muted">Current email</span>
          </div>
          {!emailEditMode && (
            <button
              onClick={() => setEmailEditMode(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-accent border border-accent/20 rounded-lg hover:bg-accent/5 transition"
            >
              <Pencil className="w-3.5 h-3.5" />
              Change
            </button>
          )}
        </div>

        {emailEditMode && (
          <div className="mt-5 pt-5 border-t border-gray-100 flex flex-col gap-4 max-w-md" style={{ borderColor: "rgb(var(--color-border-subtle))" }}>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-secondary uppercase tracking-wide">
                New Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="field-input pl-9"
                />
              </div>
              <p className="text-xs text-muted">
                A confirmation link will be sent to your new email.
              </p>
            </div>

            {emailError && <p className="text-sm text-danger">{emailError}</p>}
            {emailSuccessMsg && (
              <p className="text-sm text-success">{emailSuccessMsg}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleEmailUpdate}
                disabled={savingEmail || !newEmail}
                className="btn-primary px-4 py-2 disabled:opacity-50 transition text-sm font-semibold rounded-lg"
              >
                {savingEmail ? "Sending..." : "Update Email"}
              </button>
              <button
                onClick={() => {
                  setEmailEditMode(false);
                  setNewEmail("");
                  setEmailError("");
                }}
                className="px-4 py-2 text-sm font-medium text-secondary border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                style={{ borderColor: "rgb(var(--color-border))" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="portal-card p-5 flex items-center justify-between">
        <div>
          {error && <p className="text-sm text-danger">{error}</p>}
          {successMsg && <p className="text-sm text-success">{successMsg}</p>}
          {!error && !successMsg && (
            <p className="text-xs text-muted">
              All changes are saved securely to your profile.
            </p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary px-6 py-2.5 disabled:opacity-50 transition text-sm font-semibold rounded-lg shadow-sm"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <BaseModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        title="Verify Email Change"
        description="Enter the 6-digit OTP sent to your registered email."
        footer={
          <div className="flex justify-center">
            <Button onClick={handleVerifyOtp} disabled={verifyingOtp}>
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        }
      >
        <OtpInput value={otp} onChange={setOtp} error={otpError} />
      </BaseModal>
    </div>
  );
};

export default PersonalInfoForm;
