"use client";

import React from "react";
import BaseModal from "@/components/ui/BaseModal";
import { Employee } from "@/shared/types/company/employees/employee-listing.type";
import Image from "next/image";
import { Mail, Phone, Building2, ShieldCheck, Calendar, BadgeCheck } from "lucide-react";

interface EmployeeDetailsModalProps {
    employee: Employee | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EmployeeDetailsModal({ employee, isOpen, onClose }: EmployeeDetailsModalProps) {
    if (!employee) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Employee Details"
            maxWidth="max-w-xl"
            footer={
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="btn-secondary px-8 py-3"
                    >
                        Close Profile
                    </button>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/10">
                    <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center text-white text-3xl font-bold border-4 border-[rgb(var(--color-surface))] shadow-xl overflow-hidden">
                        {employee.avatar ? (
                            <Image
                                src={employee.avatar}
                                alt={employee.name}
                                width={80}
                                height={80}
                                className="object-cover"
                            />
                        ) : (
                            <span>{employee.name.split(' ').map(n => n[0]).join('')}</span>
                        )}
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-primary tracking-tight font-heading">{employee.name}</h3>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="chip-vibrant">
                                {employee.role}
                            </span>
                            <span className={employee.isActive ? "status-active" : "status-suspended"}>
                                {employee.isActive ? "Active" : "Suspended"}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Section: Employment Information */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] border-b border-accent/10 pb-2 font-heading">
                            Employment Details
                        </h4>
                        <div className="space-y-4">
                            <InfoItem
                                icon={<Building2 size={18} />}
                                label="Department"
                                value={employee.department || "General"}
                                valueClassName="text-primary font-bold"
                            />
                            <InfoItem
                                icon={<Calendar size={18} />}
                                label="Joining Date"
                                value={employee.joinDate || "N/A"}
                            />
                            <InfoItem
                                icon={<ShieldCheck size={18} />}
                                label="Verification"
                                value={employee.inviteStatus === 'USED' ? 'Verified Employee' : 'Pending Verification'}
                                valueClassName={employee.inviteStatus === 'USED' ? "text-success font-bold" : "text-warning font-bold"}
                            />
                        </div>
                    </div>

                    {/* Section: Contact & Access */}
                    <div className="space-y-5">
                        <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em] border-b border-accent/10 pb-2 font-heading">
                            Contact & Access
                        </h4>
                        <div className="space-y-4">
                            <InfoItem
                                icon={<Mail size={18} />}
                                label="Email Address"
                                value={employee.email}
                                valueClassName="text-accent underline decoration-accent/20 underline-offset-4 font-bold"
                            />
                            <InfoItem
                                icon={<Phone size={18} />}
                                label="Phone Number"
                                value={employee.joinDate || "Not provided"} // Temporary mapping
                            />
                            <InfoItem
                                icon={<BadgeCheck size={18} />}
                                label="System Role"
                                value={employee.role === 'COMPANY_ADMIN' ? 'Full Control' : 'Standard Access'}
                                valueClassName="text-secondary font-bold"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
}

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    valueClassName?: string;
}

function InfoItem({ icon, label, value, valueClassName = "text-primary font-medium" }: InfoItemProps) {
    return (
        <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors group">
            <div className="mt-1 p-2 rounded-lg bg-accent/5 text-accent group-hover:bg-accent/10 transition-colors">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted uppercase tracking-wider font-heading">{label}</p>
                <p className={`text-[13px] leading-none ${valueClassName}`}>{value}</p>
            </div>
        </div>
    );
}
