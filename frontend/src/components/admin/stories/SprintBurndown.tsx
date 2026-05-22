"use client";

import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { Task, TaskStatus } from "@/shared/types/company/projects/task.type";
import { Sprint } from "@/shared/types/company/projects/sprint.type";
import { Activity, Clock, Target, TrendingDown } from "lucide-react";

interface SprintBurndownProps {
  sprint: Sprint;
  tasks: Task[];
}

const SprintBurndown: React.FC<SprintBurndownProps> = ({ sprint, tasks }) => {
  const chartData = useMemo(() => {
    if (!sprint.startDate || !sprint.endDate) return [];

    const start = new Date(sprint.startDate);
    const end = new Date(sprint.endDate);
    const today = new Date();
    
    // Normalize to midnight for comparison
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    
    const data = [];
    let remainingScope = totalEstimated;
    let accumulatedEffort = 0;

    for (let i = 0; i < durationDays; i++) {
      const currentDay = new Date(start);
      currentDay.setDate(start.getDate() + i);
      
      const dayLabel = currentDay.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      // Ideal burn: Linear decrease from total to 0
      const ideal = Math.max(0, totalEstimated - (totalEstimated / (durationDays - 1)) * i);
      
      // Actual burn: Subtract estimated hours of tasks completed on or before this day
      const completedOnDay = tasks
        .filter(t => t.status === TaskStatus.DONE && t.updatedAt)
        .filter(t => {
            const completionDate = new Date(t.updatedAt);
            completionDate.setHours(0, 0, 0, 0);
            return completionDate.getTime() === currentDay.getTime();
        })
        .reduce((sum, t) => sum + (t.estimatedHours || 0), 0);

      // Effort burn-up: Sum actual hours of all tasks reported up to this day
      // (Using current actual hours as an approximation of history)
      const effortUpToDay = currentDay <= today 
        ? tasks
            .filter(t => {
                if (!t.updatedAt) return false;
                const updateDate = new Date(t.updatedAt);
                updateDate.setHours(0, 0, 0, 0);
                return updateDate.getTime() <= currentDay.getTime();
            })
            .reduce((sum, t) => sum + (t.actualHours || 0), 0)
        : null;

      if (currentDay <= today) {
          remainingScope -= completedOnDay;
      }

      data.push({
        name: dayLabel,
        ideal: Number(ideal.toFixed(1)),
        actual: currentDay <= today ? Number(remainingScope.toFixed(1)) : null,
        effort: currentDay <= today ? Number((effortUpToDay || 0).toFixed(1)) : null,
      });
    }

    return data;
  }, [sprint, tasks]);

  const stats = useMemo(() => {
    const totalEstimated = tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalWorked = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
    const completedTasks = tasks.filter(t => t.status === TaskStatus.DONE).length;
    const progress = totalEstimated > 0 ? (tasks.filter(t => t.status === TaskStatus.DONE).reduce((sum, t) => sum + (t.estimatedHours || 0), 0) / totalEstimated) * 100 : 0;

    return { totalEstimated, totalWorked, completedTasks, progress };
  }, [tasks]);

  return (
    <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Metrics */}
        <div className="lg:w-1/3 flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Efficiency Metrics</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={10} className="text-orange-500/50" /> Planned
                </span>
                <p className="text-xl font-black text-white">{stats.totalEstimated}<span className="text-[10px] text-slate-500 ml-1">hrs</span></p>
             </div>
             <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] space-y-1">
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Target size={10} className="text-emerald-500/50" /> Consumed
                </span>
                <p className="text-xl font-black text-white">{stats.totalWorked}<span className="text-[10px] text-slate-500 ml-1">hrs</span></p>
             </div>
          </div>

          <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500/5 to-transparent border border-emerald-500/10 space-y-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Sprint Velocity</span>
                <span className="text-[14px] font-black text-white">{Math.round(stats.progress)}%</span>
             </div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)] transition-all duration-1000" 
                  style={{ width: `${stats.progress}%` }}
                />
             </div>
             <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                {stats.completedTasks} objectives reached out of {tasks.length} total tasks in this operational cycle.
             </p>
          </div>
        </div>

        {/* Right: Chart */}
        <div className="lg:w-2/3">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
               <TrendingDown size={16} className="text-slate-400" />
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Burn Down Progress</span>
            </div>
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-[2px] bg-white/20" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Ideal</span>
               </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-1 bg-orange-500 rounded-full" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Remaining Scope</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-[2px] bg-emerald-500" />
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Effort Consumed</span>
               </div>
            </div>
          </div>

          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 9, fontWeight: 800 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 9, fontWeight: 800 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '800'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#f97316" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorActual)"
                  dot={{ r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#08090a' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="effort" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#10b981' }}
                  activeDot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="ideal" 
                  stroke="rgba(255,255,255,0.15)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SprintBurndown;
