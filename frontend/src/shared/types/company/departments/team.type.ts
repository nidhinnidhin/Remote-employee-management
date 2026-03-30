export interface TeamLead {
  name: string;
  email: string;
  avatar?: string;
}

export interface Team {
  id: string;
  name: string;
  lead: TeamLead;
  teamSize: number;
}
