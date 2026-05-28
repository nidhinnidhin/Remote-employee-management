"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { NotificationService } from "@/services/notification/notification.service";

export const getUserNotificationsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await NotificationService.getUserNotifications(api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error fetching notifications:", error?.message);
    return { success: false, error: error?.message || "Failed to fetch notifications" };
  }
};

export const markNotificationReadAction = async (id: string) => {
  try {
    const api = await getServerApi();
    const data = await NotificationService.markAsRead(id, api);
    return { success: true, data };
  } catch (error: any) {
    console.error("Error marking notification read:", error?.message);
    return { success: false, error: error?.message || "Failed to mark notification read" };
  }
};
