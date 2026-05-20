export type AttendanceState = "OUT" | "WORKING" | "BREAK_TEA" | "BREAK_LUNCH" | "BREAK_EVENING" | "COMPLETED";

export interface BreakLimit {
  type: string;
  limitMinutes: number;
}

export interface TimelineEvent {
  id: string;
  type: "clock_in" | "clock_out" | "break_start" | "break_end";
  label: string;
  time: string;
  timestamp: number;
}