"use server";

import { MeetingService } from "@/services/company/meeting.service";
import {
  ScheduleMeetingData,
  InstantMeetingData,
  AddParticipantsData,
} from "@/shared/types/company/meeting.type";
import { getServerApi } from "@/lib/axios/axiosServer";

export const scheduleMeetingAction = async (payload: ScheduleMeetingData) => {
  try {
    const api = await getServerApi();
    const data = await MeetingService.scheduleMeeting(payload, api);
    return { success: true, data };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to schedule meeting";
    console.error("Error scheduling meeting:", message);
    return { success: false, error: message };
  }
};

export const createInstantMeetingAction = async (
  payload: InstantMeetingData,
) => {
  try {
    const api = await getServerApi();
    const data = await MeetingService.createInstantMeeting(payload, api);
    return { success: true, data };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create instant meeting";
    console.error("Error creating instant meeting:", message);
    return { success: false, error: message };
  }
};

export const startMeetingAction = async (id: string) => {
  try {
    const api = await getServerApi();
    const data = await MeetingService.startMeeting(id, api);
    return { success: true, data };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to start meeting";
    console.error("Error starting meeting:", message);
    return { success: false, error: message };
  }
};

export const endMeetingAction = async (id: string) => {
  try {
    const api = await getServerApi();
    const data = await MeetingService.endMeeting(id, api);
    return { success: true, data };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Failed to end meeting";
    console.error("Error ending meeting:", message);
    return { success: false, error: message };
  }
};

export const addParticipantsAction = async (
  id: string,
  payload: AddParticipantsData,
) => {
  try {
    const api = await getServerApi();
    const data = await MeetingService.addParticipants(id, payload, api);
    return { success: true, data };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to add participants";
    console.error("Error adding participants:", message);
    return { success: false, error: message };
  }
};

export const removeParticipantAction = async (
  id: string,
  participantId: string,
) => {
  try {
    const api = await getServerApi();
    const data = await MeetingService.removeParticipant(id, participantId, api);
    return { success: true, data };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to remove participant";
    console.error("Error removing participant:", message);
    return { success: false, error: message };
  }
};

export const getMeetingsAction = async (
  page: number = 1,
  limit: number = 9,
) => {
  try {
    const api = await getServerApi();
    const data = await MeetingService.getMeetings(api, page, limit);
    return { success: true, data };
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch meetings";
    console.error("Error fetching meetings:", message);

    return {
      success: false,
      error: message,
      data: { meetings: [], meta: { total: 0, page: 1, limit, totalPages: 0 } },
    };
  }
};

export const getMeetingByIdAction = async (id: string) => {
  try {
    const api = await getServerApi();
    const data = await MeetingService.getMeetingById(id, api);
    return { success: true, data };
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || "Meeting not found";
    console.error("Error fetching meeting:", message);
    return { success: false, error: message };
  }
};
