"use client";

import React, { useState, useEffect } from "react";

interface Props {
  onChange: (data: any) => void;
}

const LeavePolicyConfiguration: React.FC<Props> = ({ onChange }) => {
  const [annualLeaveDays, setAnnualLeaveDays] = useState("");
  const [sickLeaveDays, setSickLeaveDays] = useState("");
  const [casualLeaveDays, setCasualLeaveDays] = useState("");
  const [maternityLeaveDays, setMaternityLeaveDays] = useState("");
  const [minimumNoticePeriodDays, setMinimumNoticePeriodDays] = useState("");
  const [requireApproval, setRequireApproval] = useState(true);

  useEffect(() => {
    onChange({
      configuration: {
        annualLeaveDays: Number(annualLeaveDays),
        sickLeaveDays: Number(sickLeaveDays),
        casualLeaveDays: Number(casualLeaveDays),
        maternityLeaveDays: Number(maternityLeaveDays),
        carryoverPolicy: { type: "PARTIAL", percentage: 50 },
        requireManagerApproval: requireApproval,
        minimumNoticePeriodDays: Number(minimumNoticePeriodDays),
      },
    });
  }, [
    annualLeaveDays,
    sickLeaveDays,
    casualLeaveDays,
    maternityLeaveDays,
    requireApproval,
    minimumNoticePeriodDays,
  ]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-pink-50/50">
      <h2 className="text-xl font-bold text-gray-900 mb-8">
        Leave Policy Configuration
      </h2>

      <div className="space-y-6">
        <input
          placeholder="Annual Leave Days"
          value={annualLeaveDays}
          onChange={(e) => setAnnualLeaveDays(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
        />

        <input
          placeholder="Sick Leave Days"
          value={sickLeaveDays}
          onChange={(e) => setSickLeaveDays(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
        />

        <input
          placeholder="Casual Leave Days"
          value={casualLeaveDays}
          onChange={(e) => setCasualLeaveDays(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
        />

        <input
          placeholder="Maternity Leave Days"
          value={maternityLeaveDays}
          onChange={(e) => setMaternityLeaveDays(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
        />

        <input
          placeholder="Minimum Notice Period"
          value={minimumNoticePeriodDays}
          onChange={(e) => setMinimumNoticePeriodDays(e.target.value)}
          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={requireApproval}
            onChange={() => setRequireApproval(!requireApproval)}
          />
          Require Manager Approval
        </label>
      </div>
    </div>
  );
};

export default LeavePolicyConfiguration;
