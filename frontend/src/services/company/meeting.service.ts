import { API_ROUTES } from "@/constants/api.routes";
import { Meeting, ScheduleMeetingData, InstantMeetingData, AddParticipantsData } from "@/shared/types/company/meeting.type";
import { AxiosInstance } from "axios";

export const MeetingService = {
  getMeetings: async (api: AxiosInstance): Promise<Meeting[]> => {
    const response = await api.get(API_ROUTES.COMPANY.MEETINGS.BASE);
    return response.data;
  },

  getMeetingById: async (id: string, api: AxiosInstance): Promise<Meeting> => {
    const response = await api.get(API_ROUTES.COMPANY.MEETINGS.BY_ID(id));
    return response.data;
  },

  scheduleMeeting: async (data: ScheduleMeetingData, api: AxiosInstance): Promise<Meeting> => {
    const response = await api.post(API_ROUTES.COMPANY.MEETINGS.SCHEDULE, data);
    return response.data;
  },

  createInstantMeeting: async (data: InstantMeetingData, api: AxiosInstance): Promise<Meeting> => {
    const response = await api.post(API_ROUTES.COMPANY.MEETINGS.INSTANT, data);
    return response.data;
  },

  startMeeting: async (id: string, api: AxiosInstance): Promise<Meeting> => {
    const response = await api.put(API_ROUTES.COMPANY.MEETINGS.START(id));
    return response.data;
  },

  endMeeting: async (id: string, api: AxiosInstance): Promise<Meeting> => {
    const response = await api.put(API_ROUTES.COMPANY.MEETINGS.END(id));
    return response.data;
  },

  addParticipants: async (id: string, data: AddParticipantsData, api: AxiosInstance): Promise<Meeting> => {
    const response = await api.put(API_ROUTES.COMPANY.MEETINGS.ADD_PARTICIPANTS(id), data);
    return response.data;
  },

  removeParticipant: async (id: string, participantId: string, api: AxiosInstance): Promise<Meeting> => {
    const response = await api.delete(API_ROUTES.COMPANY.MEETINGS.REMOVE_PARTICIPANT(id, participantId));
    return response.data;
  },
};
