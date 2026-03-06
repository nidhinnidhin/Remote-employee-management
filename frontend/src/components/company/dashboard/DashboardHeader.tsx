"use client";

import React from "react";

const DashboardHeader = () => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-accent mb-1">Dashboard</h1>
                <p className="text-muted">Welcome to your company overview</p>
            </div>
        </div>
    );
};

export default DashboardHeader;
