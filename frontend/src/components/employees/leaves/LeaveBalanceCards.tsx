import React from "react";
import { LeaveBalance } from "@/types/leave.types";
import { Plane, CalendarRange, Info } from "lucide-react";

interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
}

export const LeaveBalanceCards: React.FC<LeaveBalanceCardsProps> = ({
  balances,
}) => {
  if (!balances || balances.length === 0) {
    return <div></div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {balances.map((balance) => (
        <div
          key={balance.leaveType}
         className="p-6 rounded-2xl border border-slate-200/50 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Plane className="w-16 h-16 text-indigo-600" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <CalendarRange className="w-5z h-5" />
            </div>
            <h3 className="font-semibold text-slate-700 capitalize">
              {balance.leaveType.toLowerCase().replace("_", " ")}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Available
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {balance.available}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Allocated
              </p>
              <p className="text-lg font-semibold text-slate-600">
                {balance.allocated}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Consumed
              </p>
              <p className="text-sm font-medium text-slate-500">
                {balance.consumed}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                Pending
              </p>
              <p className="text-sm font-medium text-amber-500">
                {balance.pending}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
