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

export const SkillsForm: React.FC = () => {
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
      <div className="portal-card p-7">
        <SectionHeader
          icon={Cpu}
          title="Skills & Biography"
          subtitle="Your expertise and professional summary"
        />

        {/* Skills label */}
        <label className="text-xs font-medium text-secondary uppercase tracking-wide mb-2 block">
          Skills
        </label>

        {/* Skills tags + input row */}
        <div className="flex flex-wrap items-center gap-2 min-h-[42px] field-input transition">
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
            className="flex-1 min-w-[120px] bg-transparent text-sm text-primary outline-none placeholder:text-muted"
          />
        </div>

       
      </div>

      {/* Save bar */}
      <div className="portal-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          {error && <p className="text-sm text-danger">{error}</p>}
          {successMsg && (
            <p className="text-sm text-success">{successMsg}</p>
          )}
          {!error && !successMsg && (
            <p className="text-xs text-muted">
              All changes are saved securely to your profile.
            </p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="btn-primary px-6 py-2.5 disabled:opacity-50 transition text-sm font-semibold rounded-lg shadow-sm whitespace-nowrap"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};