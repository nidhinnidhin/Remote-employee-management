import { AxiosInstance } from "axios";
import { GetNotificationsResponse, Notification } from "@/shared/types/notification.type";

export class NotificationService {
  static async getUserNotifications(api: AxiosInstance): Promise<GetNotificationsResponse> {
    const response = await api.get("/notifications");
    return response.data;
  }

  static async markAsRead(id: string, api: AxiosInstance): Promise<Notification> {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  }
}
