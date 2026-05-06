"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Activity,
  TrendingUp,
  Target,
  CheckCircle2,
  Loader2,
  Calendar,
  BarChart3,
  Trophy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";
import { Sprint } from "@/shared/types/company/projects/sprint.type";
import { getSprintsByProjectAction } from "@/actions/company/projects/sprint.actions";
import { getStoriesByProjectAction } from "@/actions/company/projects/story.actions";
import { getTasksByProjectAction } from "@/actions/company/projects/task.actions";
import { UserStory } from "@/shared/types/company/projects/user-story.type";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { toast } from "sonner";

interface PerformanceViewProps {
  projectId: string;
}

const PerformanceView: React.FC<PerformanceViewProps> = ({ projectId }) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [stories, setStories] = useState<UserStory[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sprintsResult, storiesResult, tasksResult] = await Promise.all([
        getSprintsByProjectAction(projectId),
        getStoriesByProjectAction(projectId),
        getTasksByProjectAction(projectId),
      ]);

      if (sprintsResult.success && sprintsResult.data) {
        setSprints(sprintsResult.data);
      }
      if (storiesResult.success && storiesResult.data) {
        setStories(storiesResult.data);
      }
      if (tasksResult.success && tasksResult.data) {
        setTasks(tasksResult.data);
      }
    } catch (error) {
      toast.error("An unexpected error occurred while loading analytics");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const completedSprints = useMemo(() => 
    sprints.filter(s => s.status === 'COMPLETED')
      .sort((a, b) => new Date(a.endDate || a.createdAt).getTime() - new Date(b.endDate || b.createdAt).getTime()),
    [sprints]
  );

  const metrics = useMemo(() => {
    if (completedSprints.length === 0) return null;

    let totalEstimated = 0;
    let totalWorked = 0;
    let completedPoints = 0;
    let plannedPoints = 0;

    completedSprints.forEach(sprint => {
      const sprintStories = stories.filter(s => 
        sprint.issueIds.some(id => id.toString() === s.id.toString())
      );
      const sprintTasks = tasks.filter(t => {
        const tStoryId = t.storyId?.toString();
        return sprintStories.some(s => s.id.toString() === tStoryId);
      });
      
      totalEstimated += sprintTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
      totalWorked += sprintTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
      
      completedPoints += sprint.completedPoints || 0;
      plannedPoints += sprint.plannedPoints || 0;
    });

    const avgVelocity = completedPoints / completedSprints.length;
    const successRate = plannedPoints > 0 ? (completedPoints / plannedPoints) * 100 : 0;
    const efficiency = totalEstimated > 0 ? (totalEstimated / totalWorked) * 100 : 0;

    return {
      totalCompletedPoints: completedPoints,
      avgVelocity: Math.round(avgVelocity * 10) / 10,
      successRate: Math.round(successRate),
      efficiency: Math.round(efficiency),
      totalEstimated,
      totalWorked,
      completedCount: completedSprints.length
    };
  }, [completedSprints, stories, tasks]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <Loader2 className="animate-spin text-accent" size={48} strokeWidth={1.5} />
          <div className="absolute inset-0 blur-2xl bg-accent/20 animate-pulse" />
        </div>
        <p className="text-slate-500 font-black tracking-[0.3em] text-[9px] uppercase">
          Synthesizing Analytics...
        </p>
      </div>
    );
  }

  if (completedSprints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white/[0.01] rounded-[3rem] border border-dashed border-white/[0.05]">
        <div className="w-20 h-20 rounded-[2.5rem] bg-accent/5 flex items-center justify-center text-accent/20 border border-accent/10 mb-8">
          <Activity size={32} />
        </div>
        <h3 className="text-xl font-black text-white mb-3 tracking-tighter">
          Analytics Restricted
        </h3>
        <p className="text-slate-500 text-sm max-w-[320px] leading-relaxed mb-6 font-medium">
          Performance data is calculated after the completion of your first sprint cycle. 
          Finish an active sprint to unlock team velocity metrics.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          icon={<TrendingUp size={18} />}
          label="Average Velocity"
          value={metrics?.avgVelocity || 0}
          unit="pts / cycle"
          color="text-accent"
          bg="bg-accent/10"
        />
        <MetricCard 
          icon={<Trophy size={18} />}
          label="Total Accomplished"
          value={metrics?.totalCompletedPoints || 0}
          unit="points earned"
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <MetricCard 
          icon={<Target size={18} />}
          label="Success Rate"
          value={metrics?.successRate || 0}
          unit="%"
          color="text-blue-400"
          bg="bg-blue-500/10"
        />
        <MetricCard 
          icon={<Activity size={18} />}
          label="Work Efficiency"
          value={metrics?.efficiency || 0}
          unit="%"
          color="text-orange-500"
          bg="bg-orange-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
            <BarChart3 size={120} />
          </div>
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Velocity Chart</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Planned vs. Completed Story Points</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="text-slate-500">Planned</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
                <span className="text-white">Done</span>
              </div>
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completedSprints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                  dy={15}
                />
                <YAxis 
                  stroke="#475569" 
                  fontSize={10} 
                  fontWeight="bold"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar 
                  dataKey="plannedPoints" 
                  fill="#ffffff10" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                  animationDuration={1500}
                />
                <Bar 
                  dataKey="completedPoints" 
                  fill="url(#accentGradient)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                  animationDuration={2000}
                >
                  <Cell fill="url(#accentGradient)" />
                </Bar>
                <defs>
                  <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10 rounded-3xl p-8">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">Execution Summary</h4>
            <div className="space-y-6">
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Total Planned Effort</span>
                  <span className="text-sm font-black text-white">{metrics?.totalEstimated || 0} hrs</span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Total Actual Effort</span>
                  <span className="text-sm font-black text-white">{metrics?.totalWorked || 0} hrs</span>
               </div>
               <div className="h-px bg-white/5" />
               <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Resource Variance</span>
                  <span className={cn(
                    "text-sm font-black",
                    (metrics?.totalEstimated || 0) >= (metrics?.totalWorked || 0) ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {(metrics?.totalEstimated || 0) - (metrics?.totalWorked || 0) > 0 ? "+" : ""}{(metrics?.totalEstimated || 0) - (metrics?.totalWorked || 0)} hrs
                  </span>
               </div>
               <p className="text-[10px] text-slate-600 font-medium leading-relaxed mt-4 italic">
                 Analysis based on {tasks.filter(t => t.status === TaskStatus.DONE).length} completed tasks across {completedSprints.length} sprints.
               </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-accent/20 to-transparent border border-accent/10 rounded-3xl p-6 relative overflow-hidden group">
             <div className="flex flex-col gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-accent text-[#08090a] flex items-center justify-center shadow-lg shadow-accent/20">
                  <TrendingUp size={24} />
                </div>
                <h3 className="text-lg font-black text-white tracking-tight leading-tight">Next Goal Prediction</h3>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Based on your last {completedSprints.length} cycles, the team is likely to deliver <span className="text-white font-bold">{metrics?.avgVelocity || 0} points</span> in the upcoming sprint.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, unit, color, bg }: any) => (
  <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 group hover:bg-white/[0.04] transition-all">
    <div className="flex items-center gap-3 mb-4">
      <div className={cn("p-2 rounded-xl border border-white/5 shadow-inner", bg, color)}>
        {icon}
      </div>
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pt-0.5">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">{unit}</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1115] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 border-b border-white/5 pb-2">
          {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-6">
            <span className="text-[11px] font-bold text-slate-400">Planned:</span>
            <span className="text-[11px] font-black text-white">{payload[0].value} pts</span>
          </div>
          <div className="flex items-center justify-between gap-6">
            <span className="text-[11px] font-bold text-slate-400">Completed:</span>
            <span className="text-[11px] font-black text-accent">{payload[1].value} pts</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default PerformanceView;
