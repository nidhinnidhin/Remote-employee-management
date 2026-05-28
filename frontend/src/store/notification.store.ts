import { create } from 'zustand';
import { Notification } from '@/shared/types/notification.type';
import { getUserNotificationsAction, markNotificationReadAction } from '@/actions/notification/notification.actions';
import { notificationSocketClient } from '@/lib/socket/notification.socket.client';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
  connectSocket: (token: string, userId: string) => void;
  disconnectSocket: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await getUserNotificationsAction();
      if (response.success && response.data) {
        set({
          notifications: response.data.notifications,
          unreadCount: response.data.unreadCount,
        });
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      const response = await markNotificationReadAction(id);
      if (response.success) {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
    }));
  },

  connectSocket: (token: string, userId: string) => {
    notificationSocketClient.connect(token, userId);
    
    // Set up listeners
    notificationSocketClient.on('new_notification', (notification: Notification) => {
      get().addNotification(notification);
    });
  },

  disconnectSocket: () => {
    notificationSocketClient.disconnect();
  },
}));
