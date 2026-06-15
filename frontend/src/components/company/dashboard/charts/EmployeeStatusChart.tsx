"use client";

import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface EmployeeStatusChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#8b5cf6", "#10b981", "#ef4444", "#f59e0b", "#64748b"];

export const EmployeeStatusChart: React.FC<EmployeeStatusChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e1e2d", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", color: "#fff" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
