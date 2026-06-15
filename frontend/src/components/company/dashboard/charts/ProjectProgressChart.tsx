"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ProjectProgressChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

export const ProjectProgressChart: React.FC<ProjectProgressChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "#94a3b8", fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
          />
          <YAxis 
            tick={{ fill: "#94a3b8", fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip 
            cursor={{ fill: "rgba(255,255,255,0.02)" }}
            contentStyle={{ backgroundColor: "#1e1e2d", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
