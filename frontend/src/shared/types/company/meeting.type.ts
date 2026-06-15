export enum MeetingType {
  INSTANT = 'INSTANT',
  SCHEDULED = 'SCHEDULED',
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  ONGOING = 'ONGOING',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export interface ParticipantDetails {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Meeting {
  id: string;
  companyId: string;
  creatorId: string;
  type: MeetingType;
  status: MeetingStatus;
  participants: string[]; 
  participantDetails?: ParticipantDetails[];
  scheduledAt?: string;
  endedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleMeetingData {
  participants: string[];
  scheduledAt: string;
}

export interface InstantMeetingData {
  participants: string[];
}

export interface AddParticipantsData {
  participants: string[];
}
