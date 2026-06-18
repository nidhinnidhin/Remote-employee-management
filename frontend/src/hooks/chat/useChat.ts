import { useEffect, useCallback } from "react";
import { useChatStore } from "@/store/chat.store";
import { useAuthStore } from "@/store/auth.store";
import { socketClient } from "@/lib/socket/socket.client";
import { chatService } from "@/services/employee/chat/chat.service";
import { SocketEvents, Message, Conversation } from "@/shared/types/chat/chat.types";

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
    removeMessage,
  } = useChatStore();

  useEffect(() => {
    if (accessToken) {
      console.log("[Chat] Connecting to socket...");
      socketClient.connect(accessToken);
      setConnected(true);

      const handleReceiveMessage = async (message: Message) => {
        console.log("[Chat] Received message:", message);

        const currentConversations = useChatStore.getState().conversations;
        const conversationExists = currentConversations.some(
          (c) => c.id === message.conversationId,
        );

        if (!conversationExists) {
          try {
            const data = await chatService.getConversations();
            setConversations(data);
          } catch (error) {
            console.error("Failed to refresh conversations", error);
          }
        }

        addMessage(message.conversationId, message);
        // Safely extract the optional type parameter from message objectdsfg
        const msgType = (message as Message & { type?: string }).type || "TEXT";

        const lastMessageText =
          msgType === "TEXT"
            ? message.content
            : `📎 [${msgType}] Attachment`;

        updateConversationLastMessage(
          message.conversationId,
          lastMessageText,
          message.createdAt,
        );

        if (activeConversationId !== message.conversationId) {
          incrementUnread(message.conversationId);
        }
      };

      const handleConversationUpdated = (conversation: Conversation) => {
        console.log("[Chat] Conversation updated received:", conversation);
        addConversation(conversation);
        socketClient.emit(SocketEvents.JOIN_CONVERSATION, conversation.id);
      };

      const handleConversationDeleted = (conversationId: string) => {
        console.log("[Chat] Conversation deleted received:", conversationId);
        removeConversation(conversationId);
      };

      const handleMessageUpdated = (message: Message) => {
        console.log("[Chat] Message updated received:", message);
        updateMessage(message.conversationId, message);
      };

      const handleMessageDeleted = ({
        conversationId,
        messageId,
        type,
      }: {
        conversationId: string;
        messageId: string;
        type: "me" | "everyone";
      }) => {
        console.log("[Chat] Message deleted received:", messageId, type);
        removeMessage(conversationId, messageId, type);
      };

      socketClient.on(SocketEvents.RECEIVE_MESSAGE, handleReceiveMessage);
      socketClient.on(
        SocketEvents.CONVERSATION_UPDATED,
        handleConversationUpdated,
      );
      socketClient.on(
        SocketEvents.CONVERSATION_DELETED,
        handleConversationDeleted,
      );
      socketClient.on(SocketEvents.MESSAGE_UPDATED, handleMessageUpdated);
      socketClient.on(SocketEvents.MESSAGE_DELETED, handleMessageDeleted);

      return () => {
        socketClient.off(SocketEvents.RECEIVE_MESSAGE, handleReceiveMessage);
        socketClient.off(
          SocketEvents.CONVERSATION_UPDATED,
          handleConversationUpdated,
        );
        socketClient.off(
          SocketEvents.CONVERSATION_DELETED,
          handleConversationDeleted,
        );
        socketClient.off(SocketEvents.MESSAGE_UPDATED, handleMessageUpdated);
        socketClient.off(SocketEvents.MESSAGE_DELETED, handleMessageDeleted);
      };
    }
  }, [
    accessToken,
    addMessage,
    addConversation,
    incrementUnread,
    updateConversationLastMessage,
    setConnected,
    setConversations,
    activeConversationId,
    updateMessage,
    removeMessage,
  ]);

  const joinConversation = useCallback((conversationId: string) => {
    socketClient.emit(SocketEvents.JOIN_CONVERSATION, conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketClient.emit(SocketEvents.LEAVE_CONVERSATION, conversationId);
  }, []);

  // 🔹 SIGNATURE EXTENDED TO FORWARD TYPE AND ATTACHMENTS PLUGINS
  const sendMessage = useCallback(
    (
      conversationId: string,
      content: string,
      type: string = "TEXT",
      attachments: string[] = [],
    ) => {
      socketClient.emit(SocketEvents.SEND_MESSAGE, {
        conversationId,
        content,
        type,
        attachments,
      });
    },
    [],
  );

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