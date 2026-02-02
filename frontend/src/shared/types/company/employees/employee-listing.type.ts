export interface Employee {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    department: string;
    team: string;
    role: string;
    status: "Active" | "Inactive";
    joinDate: string;
}
