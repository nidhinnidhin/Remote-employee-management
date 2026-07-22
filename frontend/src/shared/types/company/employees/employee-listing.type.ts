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
    skills?: string[];
    documents?: Array<{
        name: string;
        category: string;
        fileUrl: string;
        publicId: string;
        resourceType: string;
        uploadedAt: string;
    }>;
    bio?: string;
    bloodGroup?: string;
    gender?: string;
    nationality?: string;
    maritalStatus?: string;
    linkedInUrl?: string;
    personalWebsite?: string;
    timeZone?: string;
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    emergencyContactRelation?: string;
}
