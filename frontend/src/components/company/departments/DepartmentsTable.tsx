"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Department } from "@/shared/types/company/departments/department.type";
import { getDepartmentsAction } from "@/actions/company/departments/department.actions";
import { Column } from "@/shared/types/ui/table-props.type";
import { createPortal } from "react-dom";
import { Eye, Edit3, Trash2, MoreVertical, Plus } from "lucide-react";
import { DepartmentDetailsModal } from "./DepartmentDetailsModal";
import { DepartmentFormModal } from "./DepartmentFormModal";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { AssignEmployeeModal } from "./AssignEmployeeModal";
import { 
  deleteDepartmentAction, 
  removeEmployeeFromDepartmentAction 
} from "@/actions/company/departments/department.actions";
import { toast } from "sonner";

const DepartmentsTable = ({ refreshTrigger }: { refreshTrigger?: number }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  
  // Modal states
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [formMode, setFormMode] = useState<"CREATE" | "EDIT">("CREATE");

  // ✅ FIX: dynamic expansion
  const [expandedDepts, setExpandedDepts] = useState<Record<string, boolean>>(
    {}
  );

  const toggleDept = (id: string) => {
    setExpandedDepts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleMenu = (e: React.MouseEvent, dept: Department) => {
    e.stopPropagation(); // Prevent accordion toggle
    if (openMenuId === dept.id) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuAnchor({ x: rect.right, y: rect.bottom });
      setOpenMenuId(dept.id);
      setSelectedDept(dept);
    }
  };

  const handleAction = (action: string) => {
    setOpenMenuId(null);
    if (!selectedDept) return;

    switch (action) {
      case "DETAILS":
        setIsDetailsOpen(true);
        break;
      case "EDIT":
        setFormMode("EDIT");
        setIsFormOpen(true);
        break;
      case "DELETE":
        setIsDeleteOpen(true);
        break;
    }
  };

  const handleDelete = async () => {
    if (!selectedDept) return;
    try {
      await deleteDepartmentAction(selectedDept.id);
      toast.success("Department deleted successfully");
      fetchDepartments();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete department");
      throw error; // Rethrow for modal loading state
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedDept || !selectedMember) return;
    try {
      await removeEmployeeFromDepartmentAction(selectedDept.id, selectedMember.id);
      toast.success("Employee removed from department");
      fetchDepartments();
    } catch (error: any) {
      toast.error(error?.message || "Failed to remove employee");
      throw error;
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await getDepartmentsAction();
      setDepartments(data);

      // ✅ FIX: auto expand first department
      if (data.length > 0 && Object.keys(expandedDepts).length === 0) {
        setExpandedDepts({
          [data[0].id]: true,
        });
      }
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => setOpenMenuId(null);
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [refreshTrigger]);


  // ✅ LOADING STATE
  if (loading) {
    return (
      <div className="p-6 text-sm text-muted">
        Loading departments...
      </div>
    );
  }

  // ✅ EMPTY STATE
  if (!departments.length) {
    return (
      <div className="p-6 text-sm text-muted">
        No departments found.
      </div>
    );
  }

  return (
    <div className="portal-card overflow-hidden bg-[rgb(var(--color-bg-subtle))]/60 border border-[rgb(var(--color-border-subtle))] shadow-2xl backdrop-blur-md w-full">
      
      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_80px] px-6 py-4 bg-[rgb(var(--color-surface-raised))]/30 border-b border-[rgb(var(--color-border-subtle))]">
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest px-8">
          Department Name
        </span>
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest text-center">
          Employee Count
        </span>
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest text-right px-2">
          Actions
        </span>
      </div>

      <div className="divide-y divide-[rgb(var(--color-border-subtle))]/30">
        {departments.map((dept) => (
          <div key={dept.id} className="group transition-colors duration-200">
            
            {/* Department Row */}
            <div
              className="grid grid-cols-[1fr_100px_80px] items-center px-6 py-4 hover:bg-white/5 cursor-pointer relative transition-all"
              onClick={() => toggleDept(dept.id)}
            >
              <div className="flex items-center gap-3">
                <div className="text-muted/40">
                  {expandedDepts[dept.id] ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </div>
                <span className="text-[13px] font-bold text-primary">
                  {dept.name}
                </span>
              </div>

              <div className="text-center">
                <span className="text-xs font-semibold text-secondary">
                  {dept.employeeIds?.length || 0}
                </span>
              </div>

              <div className="flex justify-end px-1 relative">
                <button 
                  className="p-1.5 rounded-lg hover:bg-white/10 text-muted transition-all opacity-40 group-hover:opacity-100"
                  onClick={(e) => toggleMenu(e, dept)}
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            {/* Actions Dropdown Portal */}
            {openMenuId === dept.id && menuAnchor && createPortal(
              <div
                className="fixed glass-dropdown rounded-xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                style={{
                  top: `${menuAnchor.y + 8}px`,
                  right: `${window.innerWidth - menuAnchor.x}px`,
                  minWidth: '180px'
                }}
              >
                <div className="flex flex-col p-1.5">
                  <button
                    className="flex items-center gap-3 px-4 py-2 text-[13px] text-secondary hover:bg-white/10 hover:text-primary rounded-lg transition-all font-bold group"
                    onClick={() => handleAction("DETAILS")}
                  >
                    <Eye size={14} className="group-hover:scale-110 transition-transform" />
                    <span>View Details</span>
                  </button>
                  <button
                    className="flex items-center gap-3 px-4 py-2 text-[13px] text-secondary hover:bg-white/10 hover:text-primary rounded-lg transition-all font-bold group"
                    onClick={() => handleAction("EDIT")}
                  >
                    <Edit3 size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Edit Dept</span>
                  </button>
                  <div className="h-px bg-white/5 my-1 mx-2" />
                  <button
                    className="flex items-center gap-3 px-4 py-2 text-[13px] text-danger hover:bg-danger/10 rounded-lg transition-all font-bold group"
                    onClick={() => handleAction("DELETE")}
                  >
                    <Trash2 size={14} className="group-hover:scale-110 transition-transform" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>,
              document.body
            )}

            {/* Expanded Section - Employee List */}
            {expandedDepts[dept.id] && (
              <div className="bg-black/20 border-t border-white/5 p-4 animate-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-4 px-2">
                  <h4 className="text-[11px] font-black text-muted uppercase tracking-[0.2em]">
                    Department Members ({dept.employeeIds?.length || 0})
                  </h4>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDept(dept);
                      setIsAssignOpen(true);
                    }}
                    className="text-[10px] font-bold text-accent hover:text-accent/80 transition-colors uppercase tracking-widest flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    Assign Employee
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {dept.employeeIds && dept.employeeIds.length > 0 ? (
                    dept.employeeIds.map((employee: any) => (
                      <div 
                        key={employee.id}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-default group/emp"
                      >
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full overflow-hidden border border-white/10 ring-2 ring-black/20">
                            <Image
                              src={employee.avatar}
                              alt={employee.name}
                              width={40}
                              height={40}
                              className="object-cover group-hover/emp:scale-110 transition-transform duration-500"
                            />
                          </div>
                   {/* Status Dot */}
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-[rgb(var(--color-bg))] rounded-full shadow-lg shadow-green-500/20" />
                        </div>
                        
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-bold text-primary truncate leading-tight">
                            {employee.name}
                          </span>
                          <span className="text-[10px] text-muted truncate opacity-60 leading-none mt-1">
                            {employee.email}
                          </span>
                        </div>
                        
                        <div className="ml-auto relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDept(dept);
                              setSelectedMember(employee);
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMenuAnchor({ x: rect.right, y: rect.bottom });
                              setOpenMenuId(`member-${employee.id}`);
                            }}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-muted"
                          >
                            <MoreVertical size={14} />
                          </button>

                          {/* Member Specific Menu */}
                          {openMenuId === `member-${employee.id}` && menuAnchor && createPortal(
                            <div
                              className="fixed glass-dropdown rounded-xl z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                              style={{
                                top: `${menuAnchor.y + 8}px`,
                                right: `${window.innerWidth - menuAnchor.x}px`,
                                minWidth: '160px'
                              }}
                            >
                              <div className="flex flex-col p-1.5">
                                <button
                                  className="flex items-center gap-3 px-4 py-2 text-[13px] text-danger hover:bg-danger/10 rounded-lg transition-all font-bold group"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenMenuId(null);
                                    setIsRemoveMemberOpen(true);
                                  }}
                                >
                                  <Trash2 size={14} />
                                  <span>Remove Dept</span>
                                </button>
                              </div>
                            </div>,
                            document.body
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
                      <Users size={24} className="text-muted/20 mb-2" />
                      <p className="text-xs text-muted/40 font-medium italic">No employees assigned to this department</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <DepartmentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        department={selectedDept}
      />

      <DepartmentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedDept(null);
        }}
        department={formMode === "EDIT" ? selectedDept : null}
        onSuccess={fetchDepartments}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedDept(null);
        }}
        onConfirm={handleDelete}
        title="Delete Department"
        itemName={selectedDept?.name || ""}
      />

      <AssignEmployeeModal
        isOpen={isAssignOpen}
        onClose={() => {
          setIsAssignOpen(false);
          setSelectedDept(null);
        }}
        departmentId={selectedDept?.id || ""}
        departmentName={selectedDept?.name || ""}
        onSuccess={fetchDepartments}
        existingMemberIds={selectedDept?.employeeIds?.map((e: any) => e.id) || []}
      />

      <DeleteConfirmationModal
        isOpen={isRemoveMemberOpen}
        onClose={() => {
          setIsRemoveMemberOpen(false);
          setSelectedMember(null);
        }}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        itemName={selectedMember?.name || ""}
      />
    </div>
  );
};

export default DepartmentsTable;