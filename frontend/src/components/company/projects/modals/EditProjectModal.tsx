"use client";

import React, { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import FormInput from "@/components/ui/FormInput";
import FormDropdown from "@/components/ui/FormDropdown";
import Button from "@/components/ui/Button";
import { Project, UpdateProjectPayload } from "@/shared/types/company/projects/project.type";
import { updateProjectAction } from "@/actions/company/projects/project.actions";
import { toast } from "sonner";
import { PROJECT_MESSAGES } from "@/shared/constants/messages/project.messages";
import { Layout, FileText, Calendar, Info, RefreshCcw, Save, Search, Users, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getEmployees } from "@/services/company/employee-management.service";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  project: Project | null;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  project,
}) => {
  const [formData, setFormData] = useState<UpdateProjectPayload>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        description: project.description,
        startDate: project.startDate ? project.startDate.split('T')[0] : "",
        endDate: project.endDate ? project.endDate.split('T')[0] : "",
        status: project.status,
        members: project.members || [],
      });
      loadEmployees();
    }
  }, [project]);

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      // Only show active employees
      const activeEmployees = (data || []).filter(emp => emp.isActive);
      setEmployees(activeEmployees);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const toggleEmployee = (employeeId: string) => {
    setFormData((prev) => {
      const currentMembers = prev.members || [];
      const isSelected = currentMembers.includes(employeeId);
      const newMembers = isSelected
        ? currentMembers.filter((id) => id !== employeeId)
        : [...currentMembers, employeeId];
      return { ...prev, members: newMembers };
    });
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = "Project name is required";
    
    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !validate()) return;

    setLoading(true);
    const result = await updateProjectAction(project._id || project.id || "", formData);
    setLoading(false);

    if (result.success) {
      toast.success(PROJECT_MESSAGES.PROJECT_UPDATED);
      onSuccess();
      onClose();
    } else {
      toast.error(result.error || PROJECT_MESSAGES.PROJECT_UPDATE_FAILED);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      theme="theme-company"
      title="Edit Project Details"
      description="Modify existing parameters for this project node."
      maxWidth="max-w-4xl"
    >
      <div className="theme-company px-1">
        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-8">
              {/* --- SECTION: CORE IDENTITY --- */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Identity & Scope
                  </span>
                </div>

                <FormInput
                  label="Project Name"
                  name="name"
                  value={formData.name ?? ""}
                  onChange={handleChange}
                  error={errors.name}
                  icon={<Layout size={16} strokeWidth={1.5} />}
                  placeholder="Enter project name..."
                  required
                />

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                    Objectives & Description
                  </label>
                  <div className="relative group">
                    <FileText 
                      size={16} 
                      className="absolute left-3.5 top-3.5 text-slate-500 group-focus-within:text-accent transition-colors duration-300" 
                    />
                    <textarea
                      name="description"
                      value={formData.description ?? ""}
                      onChange={handleChange}
                      className={cn(
                        "field-input w-full pl-11 pr-4 py-3 text-sm transition-all duration-300",
                        "bg-white/[0.02] border border-white/10 rounded-xl min-h-[110px] outline-none text-white resize-none",
                        "placeholder:text-slate-700 focus:border-accent/40 focus:bg-accent/[0.01]"
                      )}
                      placeholder="Update description..."
                    />
                  </div>
                </div>
              </div>

              {/* --- SECTION: TIMELINE & STATUS --- */}
              <div className="space-y-4 pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-2 px-1 border-l-2 border-accent/30 pl-3 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                    Lifecycle State
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Start Date"
                    name="startDate"
                    type="date"
                    value={formData.startDate ?? ""}
                    onChange={handleChange}
                    icon={<Calendar size={16} strokeWidth={1.5} />}
                  />
                  <FormInput
                    label="End Date"
                    name="endDate"
                    type="date"
                    value={formData.endDate ?? ""}
                    onChange={handleChange}
                    error={errors.endDate}
                    icon={<Calendar size={16} strokeWidth={1.5} />}
                  />
                </div>

                <FormDropdown
                  label="Operational Status"
                  name="status"
                  value={formData.status ?? "Active"}
                  onChange={handleChange}
                  options={["Active", "On Hold", "Completed"]}
                />
              </div>
            </div>

            <div className="space-y-4 border-l border-white/[0.04] pl-10">
              <div className="flex items-center justify-between px-1 border-l-2 border-accent/30 pl-3 mb-2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Manage Team Members
                </span>
                <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                  {formData.members?.length || 0} Assigned
                </span>
              </div>

              <div className="relative group">
                <Search
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-accent transition-colors"
                />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="field-input w-full pl-10 pr-4 py-2 text-xs bg-white/[0.02] border border-white/10 rounded-xl outline-none text-white focus:border-accent/40 transition-all"
                />
              </div>

              <div className="h-[350px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => {
                  const employeeId = emp.id || (emp as any)._id;
                  const isSelected = formData.members?.includes(employeeId);
                  const initials = emp.name
                    ? emp.name.split(' ').map(n => n[0]).join('').substring(0, 2)
                    : '??';
                  return (
                    <button
                      key={employeeId}
                      type="button"
                      onClick={() => toggleEmployee(employeeId)}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 group",
                        isSelected 
                          ? "bg-accent/10 border border-accent/20" 
                          : "hover:bg-white/[0.03] border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase tracking-tighter transition-all",
                          isSelected ? "bg-accent text-[#08090a]" : "bg-white/5 text-slate-400 group-hover:bg-white/10"
                        )}>
                          {initials}
                        </div>
                        <div className="text-left">
                          <p className={cn(
                            "text-[11px] font-bold transition-colors",
                            isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                          )}>
                            {emp.name}
                          </p>
                          <p className="text-[9px] text-slate-500 font-medium uppercase tracking-tight">
                            {emp.role || "Employee"}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle2 size={14} className="text-accent" />
                      )}
                    </button>
                  );
                })
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                    <Users size={24} strokeWidth={1} className="mb-2 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No candidates found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* --- FOOTER ACTIONS --- */}
          <div className="flex items-center justify-between gap-4 pt-6 mt-2 border-t border-white/[0.06]">
            <div className="hidden sm:flex items-center gap-2 text-slate-600">
              <Info size={14} strokeWidth={2} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Updates tracked
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="ghost"
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white"
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className={cn(
                  "flex-1 sm:flex-none h-11 px-10 rounded-xl transition-all duration-300",
                  "bg-accent text-[#08090a] font-black text-[10px] uppercase tracking-[0.2em]",
                  "shadow-lg shadow-accent/10 hover:shadow-accent/30 flex items-center justify-center gap-2"
                )}
              >
                {loading ? (
                  <>
                    <RefreshCcw size={14} className="animate-spin" />
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} strokeWidth={3} />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  );
};

export default EditProjectModal;