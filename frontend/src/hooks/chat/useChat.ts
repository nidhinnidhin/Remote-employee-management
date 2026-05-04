// src/hooks/chat/useChat.ts
import { useEffect, useCallback } from 'react';
import { useChatStore } from '@/store/chat.store';
import { useAuthStore } from '@/store/auth.store';
import { socketClient } from '@/lib/socket/socket.client';
import { chatService } from '@/services/employee/chat/chat.service';
import { SocketEvents, Message } from '@/shared/types/chat/chat.types';

export function useChat() {
  const { accessToken } = useAuthStore();
  const { 
    addMessage, 
    addConversation,
    incrementUnread, 
    updateConversationLastMessage,
    setConnected,
    setConversations,
    activeConversationId,
    removeConversation,
    updateMessage,
    removeMessage
  } = useChatStore();

  // Initialize socket
  useEffect(() => {
    if (accessToken) {
      console.log('[Chat] Connecting to socket...');
      socketClient.connect(accessToken);
      setConnected(true);

      const handleReceiveMessage = async (message: Message) => {
        console.log('[Chat] Received message:', message);
        
        // Check if conversation exists in our list using latest state
        const currentConversations = useChatStore.getState().conversations;
        const conversationExists = currentConversations.some(c => c.id === message.conversationId);
        
        if (!conversationExists) {
          // If it's a new conversation, refresh the list
          try {
            const data = await chatService.getConversations();
            setConversations(data);
          } catch (error) {
            console.error("Failed to refresh conversations", error);
          }
        }

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

      const handleConversationUpdated = (conversation: any) => {
        console.log('[Chat] Conversation updated received:', conversation);
        addConversation(conversation); // This handles adding if new
        socketClient.emit(SocketEvents.JOIN_CONVERSATION, conversation.id);
      };

      const handleConversationDeleted = (conversationId: string) => {
        console.log('[Chat] Conversation deleted received:', conversationId);
        removeConversation(conversationId);
      };

      const handleMessageUpdated = (message: Message) => {
        console.log('[Chat] Message updated received:', message);
        updateMessage(message.conversationId, message);
      };

      const handleMessageDeleted = ({ conversationId, messageId, type }: { conversationId: string, messageId: string, type: 'me' | 'everyone' }) => {
        console.log('[Chat] Message deleted received:', messageId, type);
        removeMessage(conversationId, messageId, type);
      };

      socketClient.on(SocketEvents.RECEIVE_MESSAGE, handleReceiveMessage);
      socketClient.on(SocketEvents.CONVERSATION_UPDATED, handleConversationUpdated);
      socketClient.on(SocketEvents.CONVERSATION_DELETED, handleConversationDeleted);
      socketClient.on(SocketEvents.MESSAGE_UPDATED, handleMessageUpdated);
      socketClient.on(SocketEvents.MESSAGE_DELETED, handleMessageDeleted);

      return () => {
        socketClient.off(SocketEvents.RECEIVE_MESSAGE, handleReceiveMessage);
        socketClient.off(SocketEvents.CONVERSATION_UPDATED, handleConversationUpdated);
        socketClient.off(SocketEvents.CONVERSATION_DELETED, handleConversationDeleted);
        socketClient.off(SocketEvents.MESSAGE_UPDATED, handleMessageUpdated);
        socketClient.off(SocketEvents.MESSAGE_DELETED, handleMessageDeleted);
      };
    }
  }, [accessToken, addMessage, addConversation, incrementUnread, updateConversationLastMessage, setConnected, setConversations, activeConversationId, updateMessage, removeMessage]);

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
