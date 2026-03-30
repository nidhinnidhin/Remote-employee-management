import React, { useState, useEffect } from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Department } from "@/shared/types/company/departments/department.type";
import { createDepartmentAction, updateDepartmentAction } from "@/actions/company/departments/department.actions";
import { toast } from "sonner";
import { Loader2, Plus, Edit2 } from "lucide-react";

interface DepartmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  onSuccess: () => void;
}

export const DepartmentFormModal = ({
  isOpen,
  onClose,
  department,
  onSuccess,
}: DepartmentFormModalProps) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (department) {
      setName(department.name);
    } else {
      setName("");
    }
  }, [department, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Department name is required");
      return;
    }

    try {
      setLoading(true);
      if (department) {
        await updateDepartmentAction(department.id, name.trim());
        toast.success("Department updated successfully");
      } else {
        await createDepartmentAction(name.trim());
        toast.success("Department created successfully");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={department ? "Edit Department" : "Create Department"}
      description={
        department
          ? "Update the name of the department."
          : "Add a new department to your company."
      }
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-1">
            Department Name
          </label>
          <div className="relative group">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Engineering, Marketing..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-muted/30 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all group-hover:border-white/20"
              autoFocus
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-primary text-sm font-bold rounded-xl transition-all border border-white/10"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-2.5 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-white text-sm font-bold rounded-xl transition-all border border-white/10 shadow-lg shadow-accent/20 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : department ? (
              <>
                <Edit2 size={16} />
                Update
              </>
            ) : (
              <>
                <Plus size={16} />
                Create
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};
