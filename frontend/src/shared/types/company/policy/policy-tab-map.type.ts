export interface PolicyTabMap {
    "Working Hours": string;
    "Leave Policy": string;
    "Attendance Rules": string;
    "Remote Work": string;
    "General": string;
}


export type PolicyTabType = keyof PolicyTabMap;

export interface TabItem {
    id: PolicyTabType;
    label: string;
    icon: React.ElementType;
}