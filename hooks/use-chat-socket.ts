"use client";

import {
  createChatSocket,
  emitSocketChatMessage,
  registerChatSocketUser,
  subscribeChatSocket,
} from "@/lib/chat-socket";
import type { AuthRole } from "@/lib/api-types";
import useAuthStore from "@/store/authStore";
import useChatStore from "@/store/chatStore";
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

type UseChatSocketOptions = {
  role: AuthRole;
  activeContactId: string | null;
  showAdminInbox?: boolean;
  receiverId?: string | null;
};

export function useChatSocket({
  role,
  activeContactId,
  showAdminInbox = false,
  receiverId = null,
}: UseChatSocketOptions) {
  const user = useAuthStore(state => state.user);
  const appendIncomingMessage = useChatStore(state => state.appendIncomingMessage);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const socket = createChatSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      registerChatSocketUser(socket, role, {
        id: user.id,
        name: user.name,
        email: user.email,
      });
    };

    socket.on("connect", handleConnect);
    if (socket.connected) handleConnect();

    const unsubscribe = subscribeChatSocket(socket, role, message => {
      appendIncomingMessage(message);
    });

    return () => {
      unsubscribe();
      socket.off("connect", handleConnect);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [role, user?.id, user?.name, user?.email, appendIncomingMessage]);

  const emitLiveMessage = (message: string) => {
    const socket = socketRef.current;
    const senderId = user?.id;
    const resolvedReceiver =
      receiverId ?? (showAdminInbox ? "" : activeContactId);
    if (!socket || !senderId || resolvedReceiver === null || !message.trim()) {
      return;
    }

    emitSocketChatMessage(socket, role, {
      senderId,
      receiverId: resolvedReceiver,
      message: message.trim(),
      senderName: user?.name ?? user?.email ?? "User",
      isAdminInbox: role === "seller" && showAdminInbox,
    });
  };

  return { emitLiveMessage };
}
