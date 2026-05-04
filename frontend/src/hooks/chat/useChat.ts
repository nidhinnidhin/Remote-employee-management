// src/hooks/chat/useChat.ts
import { useEffect, useCallback } from 'react';
import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';
import { socketClient } from '@/lib/socket/socket.client';
import { SocketEvents, Message } from '@/shared/types/chat/chat.types';

export function useChat() {
  const { accessToken } = useAuthStore();
  const { 
    addMessage, 
    incrementUnread, 
    updateConversationLastMessage,
    setConnected,
    activeConversationId 
  } = useChatStore();

  // Initialize socket
  useEffect(() => {
    if (accessToken) {
      console.log('[Chat] Connecting to socket...');
      socketClient.connect(accessToken);
      setConnected(true);

      const handleReceiveMessage = (message: Message) => {
        console.log('[Chat] Received message:', message);
        addMessage(message.conversationId, message);
        updateConversationLastMessage(
          message.conversationId, 
          message.content, 
          message.createdAt
        );
        
        // Only increment unread if it's not the current conversation
        if (activeConversationId !== message.conversationId) {
          incrementUnread(message.conversationId);
        }
      };

      socketClient.on(SocketEvents.RECEIVE_MESSAGE, handleReceiveMessage);

      return () => {
        socketClient.off(SocketEvents.RECEIVE_MESSAGE, handleReceiveMessage);
      };
    }
  }, [accessToken, addMessage, incrementUnread, updateConversationLastMessage, setConnected, activeConversationId]);

  const joinConversation = useCallback((conversationId: string) => {
    socketClient.emit(SocketEvents.JOIN_CONVERSATION, conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketClient.emit(SocketEvents.LEAVE_CONVERSATION, conversationId);
  }, []);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    socketClient.emit(SocketEvents.SEND_MESSAGE, { conversationId, content });
  }, []);

  const sendTyping = useCallback((conversationId: string) => {
    socketClient.emit(SocketEvents.TYPING, conversationId);
  }, []);

  const stopTyping = useCallback((conversationId: string) => {
    socketClient.emit(SocketEvents.STOP_TYPING, conversationId);
  }, []);

  return {
    joinConversation,
    leaveConversation,
    sendMessage,
    sendTyping,
    stopTyping,
  };
}
