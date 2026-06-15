import React from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardStats from "./DashboardStats";
import { getDashboardAnalyticsAction } from "@/actions/company/dashboard/dashboard.actions";
import { EmployeeStatusChart } from "./charts/EmployeeStatusChart";
import { ProjectProgressChart } from "./charts/ProjectProgressChart";
import { Activity, Clock } from "lucide-react";

const DashboardOverview = async () => {
    const analyticsRes = await getDashboardAnalyticsAction();
    const analytics = analyticsRes.data || {
        stats: { totalEmployees: 0, totalDepartments: 0, activeProjects: 0, pendingLeaves: 0 },
        charts: { employeeStatus: [], projectStatus: [] },
        recentActivity: []
    };
    return (
        <div>
            <DashboardHeader />
            <DashboardStats stats={analytics.stats} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="portal-card p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Employee Distribution</h3>
                    {analytics.charts.employeeStatus.length > 0 ? (
                        <EmployeeStatusChart data={analytics.charts.employeeStatus} />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted">No Data Available</div>
                    )}
                </div>
                <div className="portal-card p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Project Progress</h3>
                    {analytics.charts.projectStatus.length > 0 ? (
                        <ProjectProgressChart data={analytics.charts.projectStatus} />
                    ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted">No Data Available</div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="portal-card p-6 lg:col-span-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-accent" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {analytics.recentActivity.length > 0 ? (
                            analytics.recentActivity.map((activity, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                        {activity.type === "leave" ? <Clock size={14} className="text-amber-400" /> : <Activity size={14} className="text-blue-400" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{activity.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{activity.subtitle}</p>
                                    </div>
                                    <div className="ml-auto text-xs text-slate-500">
                                        {new Date(activity.date).toLocaleDateString()}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-secondary text-sm">No recent activity to show.</p>
                        )}
                    </div>
                </div>
                <div className="portal-card p-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Quick Links</h3>
                    <div className="flex flex-col gap-3">
                        <a href="/admin/employees" className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-accent/50 hover:bg-white/[0.04] transition-all text-sm text-white font-medium flex items-center justify-between group">
                            Manage Employees <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                        <a href="/admin/departments" className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-accent/50 hover:bg-white/[0.04] transition-all text-sm text-white font-medium flex items-center justify-between group">
                            Manage Departments <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                        <a href="/admin/projects" className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-accent/50 hover:bg-white/[0.04] transition-all text-sm text-white font-medium flex items-center justify-between group">
                            Active Projects <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                        <a href="/admin/company-policy" className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-accent/50 hover:bg-white/[0.04] transition-all text-sm text-white font-medium flex items-center justify-between group">
                            Review Policies <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
