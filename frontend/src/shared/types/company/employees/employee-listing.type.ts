export interface Employee {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    department: string;
    team?: string;
    role: string;
    isActive: boolean;
    inviteStatus: string;
    joinDate?: string;
}
