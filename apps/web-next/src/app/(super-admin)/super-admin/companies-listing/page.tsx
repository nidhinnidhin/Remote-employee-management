"use client";

import Sidebar from "@/components/super-admin/companies/Sidebar";
import Header from "@/components/super-admin/companies/Header";
import StatsGrid from "@/components/super-admin/companies/StatsGrid";
import CompaniesTable from "@/components/super-admin/companies/CompaniesTable";

export default function CompaniesListingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            <Sidebar />

            <main className="flex-1 ml-64">
                <Header title="Companies" />

                <div className="p-8">
                    <StatsGrid />
                    <CompaniesTable /> 
                </div>
            </main>
        </div>
    );
}
