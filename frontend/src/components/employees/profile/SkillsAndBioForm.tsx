"use client";

import React, { useState } from "react";
import { Plus, X, FileText, Cpu } from "lucide-react";

interface SkillsBioFormData {
  skills: string[];
  biography: string;
}

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

export const SkillsAndBioForm: React.FC = () => {
  const [formData, setFormData] = useState<SkillsBioFormData>({
    skills: [
      "Node.js",
      "TypeScript",
      "React",
      "MongoDB",
      "AWS",
      "Docker",
      "GraphQL",
      "PostgreSQL",
    ],
    biography: "",
  });

  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || formData.skills.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    setSuccessMsg("");
    try {
      // Replace with your actual API call
      // await clientApi.patch("/auth/profile", { skills: formData.skills, bio: formData.biography });
      await new Promise((res) => setTimeout(res, 800)); // mock delay
      setSuccessMsg("Profile updated successfully.");
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Skills Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7">
        <SectionHeader
          icon={Cpu}
          title="Skills & Biography"
          subtitle="Your expertise and professional summary"
        />

        {/* Skills label */}
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
          Skills
        </label>

        {/* Skills tags + input row */}
        <div className="flex flex-wrap items-center gap-2 min-h-[42px] border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-indigo-200 focus-within:border-indigo-400 focus-within:bg-white transition">
          {formData.skills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500 text-white"
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                className="hover:opacity-75 transition leading-none"
                aria-label={`Remove ${skill}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={formData.skills.length === 0 ? "Add a skill..." : ""}
            className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-300"
          />
        </div>

        {/* Biography */}
        <div className="flex flex-col gap-1.5 mt-6">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Biography
          </label>
          <textarea
            name="biography"
            value={formData.biography}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, biography: e.target.value }))
            }
            rows={5}
            placeholder="Write a short professional biography..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 focus:bg-white transition resize-none placeholder:text-gray-300"
          />
        </div>
      </div>

      {/* Save bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {successMsg && (
            <p className="text-sm text-green-600">{successMsg}</p>
          )}
          {!error && !successMsg && (
            <p className="text-xs text-gray-400">
              All changes are saved securely to your profile.
            </p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition text-white text-sm font-semibold rounded-lg shadow-sm whitespace-nowrap"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};