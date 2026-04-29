"use client";

import { Plus, Trash2, Calendar } from "lucide-react";
import Button from "@/components/ui/Button";
import { useEffect, useState } from "react";

interface Props {
  onChange: (data: any) => void;
  initialData?: any;
  leaveDistribution?: Array<{ type: string; days: number }>;
}

const LeavePolicyConfiguration: React.FC<Props> = ({
  onChange,
  initialData,
  leaveDistribution: initialDistribution,
}) => {
  const [description, setDescription] = useState("");
  const [leaveTypes, setLeaveTypes] = useState("");
  const [approvalRules, setApprovalRules] = useState("");
  const [emergencyRules, setEmergencyRules] = useState("");
  const [distribution, setDistribution] = useState<Array<{ type: string; days: number }>>([]);

  useEffect(() => {
    if (!initialData) return;

    const sections = initialData.sections || [];

    const getSection = (title: string) =>
      sections.find((s: any) => s.title === title)?.points.join("\n") || "";

    setDescription(getSection("Description"));
    setLeaveTypes(getSection("Types of Leave"));
    setApprovalRules(getSection("Approval Workflow"));
    setEmergencyRules(getSection("Emergency Leave"));
    
    if (initialDistribution) {
      setDistribution(initialDistribution);
    }
  }, [initialData, initialDistribution]);

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
      leaveDistribution: distribution,
    });
  }, [description, leaveTypes, approvalRules, emergencyRules, distribution]);

  const addLeaveType = () => {
    setDistribution([...distribution, { type: "", days: 0 }]);
  };

  const removeLeaveType = (index: number) => {
    setDistribution(distribution.filter((_, i) => i !== index));
  };

  const updateDistribution = (index: number, field: string, value: any) => {
    const newDist = [...distribution];
    newDist[index] = { ...newDist[index], [field]: value };
    setDistribution(newDist);
  };

  return (
    <div className="portal-card p-8 space-y-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Leave Policy Configuration</h2>
      </div>

      <div className="space-y-8">
        {/* --- LEAVE DISTRIBUTION --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="field-label !mb-0">Leave Quota Distribution</label>
              <p className="text-[11px] text-secondary mt-1">Define specific leave types and their yearly allocations.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={addLeaveType}
              className="h-9 px-4 text-[10px] uppercase tracking-wider font-bold"
            >
              Add Leave Type
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {distribution.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] group hover:border-accent/30 transition-all"
              >
                <div className="flex-1 space-y-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Leave Type (e.g. Sick Leave)"
                      value={item.type}
                      onChange={(e) => updateDistribution(index, "type", e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-700 font-semibold"
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-slate-600" />
                    <input
                      type="number"
                      placeholder="Days"
                      value={item.days || ""}
                      onChange={(e) => updateDistribution(index, "days", parseInt(e.target.value) || 0)}
                      className="w-20 bg-transparent border-none outline-none text-xs text-accent font-black"
                    />
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">Days / Year</span>
                  </div>
                </div>
                <button
                  onClick={() => removeLeaveType(index)}
                  className="p-2.5 rounded-xl bg-red-500/5 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            {distribution.length === 0 && (
              <div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
                <p className="text-sm text-slate-600 font-medium italic">No leave quotas defined yet. Click "Add Leave Type" to begin.</p>
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-white/5" />

        {/* --- TEXT SECTIONS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="field-label">Policy Overview</label>
            <textarea
              placeholder="Provide a general overview of the leave policy..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="field-input min-h-[160px] text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="field-label">Types of Leave (Textual Details)</label>
            <textarea
              placeholder="Additional details about leave types..."
              value={leaveTypes}
              onChange={(e) => setLeaveTypes(e.target.value)}
              className="field-input min-h-[160px] text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="field-label">Approval Workflow</label>
            <textarea
              placeholder="e.g., Requests must be submitted 2 weeks in advance..."
              value={approvalRules}
              onChange={(e) => setApprovalRules(e.target.value)}
              className="field-input min-h-[160px] text-sm leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="field-label">Emergency Protocol</label>
            <textarea
              placeholder="e.g., Notify manager within 2 hours..."
              value={emergencyRules}
              onChange={(e) => setEmergencyRules(e.target.value)}
              className="field-input min-h-[160px] text-sm leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeavePolicyConfiguration;
