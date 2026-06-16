"use client";

import React from "react";
import { X, Building2, Mail, Users, Globe, Calendar, Activity } from "lucide-react";
import { CompanyRow } from "@/shared/types/superadmin/companies/companiesColumns";

interface CompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyRow;
}

export default function CompanyDetailModal({ isOpen, onClose, company }: CompanyDetailModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[9999] p-4">
        <div className="bg-surface border border-border-subtle rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-raised">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">
                {company.logo}
              </div>
              <div>
                <h2 className="text-lg font-bold text-primary">{company.name}</h2>
                <p className="text-xs text-secondary">{company.email}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface-sunken transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DetailItem icon={<Building2 size={16} />} label="Industry" value={company.plan || "N/A"} />
              <DetailItem icon={<Users size={16} />} label="Employees" value={company.employees.toString()} />
              <DetailItem icon={<Activity size={16} />} label="Status" value={
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  company.status === "ACTIVE" 
                    ? "bg-success/10 text-success" 
                    : "bg-danger/10 text-danger"
                }`}>
                  {company.status}
                </span>
              } />
              <DetailItem icon={<Calendar size={16} />} label="Joined" value={company.created} />
              <DetailItem icon={<Globe size={16} />} label="Website" value={company.id ? "—" : "—"} />
              <DetailItem icon={<Mail size={16} />} label="Owner Email" value={company.email} />
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-6 py-4 border-t border-border-subtle bg-surface flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-surface-raised border border-border-subtle hover:opacity-80 transition-opacity"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 p-3 rounded-xl bg-surface-raised border border-border-subtle">
      <div className="flex items-center gap-2 text-xs font-medium text-secondary">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-sm font-semibold text-primary mt-1">
        {value}
      </div>
    </div>
  );
}
