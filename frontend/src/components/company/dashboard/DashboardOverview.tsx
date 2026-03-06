"use client";

import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";

const DashboardOverview = () => {
    return (
        <div>
            <DashboardHeader />
            <DashboardStats />

            {/* Placeholder for more dashboard content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="portal-card p-8">
                    <h3 className="text-lg font-bold text-primary mb-4">Recent Activity</h3>
                    <p className="text-secondary text-sm">No recent activity to show.</p>
                </div>
                <div className="portal-card p-8">
                    <h3 className="text-lg font-bold text-primary mb-4">Quick Links</h3>
                    <div className="flex flex-col gap-2">
                        <p className="text-secondary text-sm underline cursor-pointer">Invite New Employee</p>
                        <p className="text-secondary text-sm underline cursor-pointer">Review Policy</p>
                        <p className="text-secondary text-sm underline cursor-pointer">View All Departments</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
