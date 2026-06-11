export interface WorkingHoursData {
  sections?: { title: string; points: string[] }[];
  workStartTime?: string;
  workEndTime?: string;
  morningBreakStart?: string;
  morningBreakEnd?: string;
  lunchBreakStart?: string;
  lunchBreakEnd?: string;
  eveningBreakStart?: string;
  eveningBreakEnd?: string;
  [key: string]: string | { title: string; points: string[] }[] | undefined;
}

export interface WorkingHoursProps {
  onChange: (data: WorkingHoursData) => void;
  initialData?: WorkingHoursData;
}