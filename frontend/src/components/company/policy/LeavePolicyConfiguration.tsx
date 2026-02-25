"use client";

import React, { useState, useEffect } from "react";

interface Props {
  onChange: (data: any) => void;
  initialData?: any;
}

const LeavePolicyConfiguration: React.FC<Props> = ({
  onChange,
  initialData,
}) => {
  const [description, setDescription] = useState("");
  const [leaveTypes, setLeaveTypes] = useState("");
  const [approvalRules, setApprovalRules] = useState("");
  const [emergencyRules, setEmergencyRules] = useState("");

  useEffect(() => {
    if (!initialData) return;

    const sections = initialData.sections || [];

    const getSection = (title: string) =>
      sections.find((s: any) => s.title === title)?.points.join("\n") || "";

    setDescription(getSection("Description"));
    setLeaveTypes(getSection("Types of Leave"));
    setApprovalRules(getSection("Approval Workflow"));
    setEmergencyRules(getSection("Emergency Leave"));
  }, [initialData]);

  useEffect(() => {
    onChange({
      sections: [
        {
          title: "Description",
          points: description.split("\n").filter(Boolean),
        },
        {
          title: "Types of Leave",
          points: leaveTypes.split("\n").filter(Boolean),
        },
        {
          title: "Approval Workflow",
          points: approvalRules.split("\n").filter(Boolean),
        },
        {
          title: "Emergency Leave",
          points: emergencyRules.split("\n").filter(Boolean),
        },
      ],
    });
  }, [description, leaveTypes, approvalRules, emergencyRules]);

  return (
    <div className="portal-card p-8">
      <h2 className="text-xl font-bold text-primary mb-8">Leave Policy</h2>

      <div className="space-y-6">
        <div>
          <label className="field-label">
            Policy Description
          </label>
          <textarea
            placeholder="Provide a general overview of the leave policy..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="field-input h-32"
          />
          <p className="field-hint">A brief summary of what this leave policy covers.</p>
        </div>

        <div>
          <label className="field-label">
            Types of Leave
          </label>
          <textarea
            placeholder="e.g., Annual Leave: 20 days per year (one per line)"
            value={leaveTypes}
            onChange={(e) => setLeaveTypes(e.target.value)}
            className="field-input h-32"
          />
          <p className="field-hint">List all available leave types and their respective quotas.</p>
        </div>

        <div>
          <label className="field-label">
            Approval Workflow
          </label>
          <textarea
            placeholder="e.g., Requests must be submitted 2 weeks in advance (one per line)"
            value={approvalRules}
            onChange={(e) => setApprovalRules(e.target.value)}
            className="field-input h-32"
          />
          <p className="field-hint">Specify the process and rules for leave approval.</p>
        </div>

        <div>
          <label className="field-label">
            Emergency Leave Procedures
          </label>
          <textarea
            placeholder="e.g., Notify manager within 2 hours of shift start (one per line)"
            value={emergencyRules}
            onChange={(e) => setEmergencyRules(e.target.value)}
            className="field-input h-32"
          />
          <p className="field-hint">State the protocol for unplanned or emergency absences.</p>
        </div>
      </div>
    </div>
  );
};

export default LeavePolicyConfiguration;
