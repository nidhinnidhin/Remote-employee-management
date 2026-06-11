"use server";

import { getServerApi } from "@/lib/axios/axiosServer";
import { NotificationService } from "@/services/notification/notification.service";

export const getUserNotificationsAction = async () => {
  try {
    const api = await getServerApi();
    const data = await NotificationService.getUserNotifications(api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error fetching notifications:", err?.message);
    return { success: false, error: err?.message || "Failed to fetch notifications" };
  }
};

export const markNotificationReadAction = async (id: string) => {
  try {
    const api = await getServerApi();
    const data = await NotificationService.markAsRead(id, api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error marking notification read:", err?.message);
    return { success: false, error: err?.message || "Failed to mark notification read" };
  }
};

export const markAllNotificationsReadAction = async () => {
  try {
    const api = await getServerApi();
    const data = await NotificationService.markAllAsRead(api);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as { message?: string };
    console.error("Error batch mutating read flags:", err?.message);
    return { success: false, error: err?.message || "Failed to mark all notifications read" };
  }
};