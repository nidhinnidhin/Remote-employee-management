"use client";

import React, { useEffect, useState } from "react";
import { X, Cpu } from "lucide-react";
import { updateSkills } from "@/services/employee/profile/skills.service";

interface SkillsFormProps {
  initialSkills: string[];
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
  <div
    className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100"
    style={{ borderColor: "rgb(var(--color-border-subtle))" }}
  >
    <div className="section-icon-wrap">
      <Icon className="section-icon" />
    </div>
    <div>
      <h3 className="text-sm font-semibold text-primary">{title}</h3>
      {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

export const SkillsForm: React.FC<SkillsFormProps> = ({
  initialSkills,
}) => {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  // Sync when parent updates skills (e.g. after refresh)
  useEffect(() => {
    setSkills(initialSkills);
  }, [initialSkills]);

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || skills.includes(trimmed)) return;

    setSkills((prev) => [...prev, trimmed]);
    setSkillInput("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
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
      await updateSkills(skills);
      setSuccessMsg("Skills updated successfully.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to save changes. Please try again."
      );
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
          title="Skills"
          subtitle="Your expertise"
        />

        <label className="text-xs font-medium text-secondary uppercase tracking-wide mb-2 block">
          Skills
        </label>

        <div className="flex flex-wrap items-center gap-2 min-h-[42px] field-input transition">
          {skills.map((skill) => (
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
            placeholder={skills.length === 0 ? "Add a skill..." : ""}
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