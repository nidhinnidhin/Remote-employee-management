"use client";

import { Filter, UserPlus, Users, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import EmployeeStats from "./EmployeeStats";
import Button from "../../ui/Button";
import InviteEmployeeModal from "../modals/InviteEmployeeModal";
import { InviteEmployeePayload } from "@/shared/types/company/employees/auth/invite-employee-payload.type";
import { toast } from "sonner";
import { clientApi } from "@/lib/axios/axiosClient";

interface HeaderProps {
  onInviteSuccess?: () => void;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onInviteSuccess, onSearch }) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchValue);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchValue, onSearch]);

  const handleInvite = async (data: InviteEmployeePayload) => {
    try {
      setLoading(true);

      await clientApi.post("/company/employees/invite", data);

      setIsInviteOpen(false);
      toast.success("Invitation sent successfully");

      if (onInviteSuccess) {
        onInviteSuccess();
      }

      console.log("Invitation sent successfully");
    } catch (error: any) {
      console.error("Invite failed", error);
      const errorMessage =
        error.response?.data?.message || "Failed to send invitation";
      toast.error(errorMessage); // ❌ optional: toast error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-accent mb-1">Employees</h1>
          <p className="text-muted">Manage your team members</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full bg-[rgb(var(--color-nav-bg))] border border-[rgb(var(--color-border-subtle))] rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-accent))] transition-all placeholder:text-muted/50"
            />
          </div>

          <Button
            variant="primary"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => setIsInviteOpen(true)}
            disabled={loading}
          >
            <UserPlus size={18} />
            <span>{loading ? "Sending..." : "Add Employee"}</span>
          </Button>
        </div>
      </div>

      <EmployeeStats />

      <InviteEmployeeModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  );
};

export default Header;
