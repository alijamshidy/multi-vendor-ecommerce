"use client";

import {
  createChatSocket,
  emitSocketChatMessage,
  registerChatSocketUser,
  subscribeChatSocket,
} from "@/lib/chat-socket";
import {
  ADMIN_CHAT_PEER_ID,
  resolveChatConversationKind,
  type AdminChatChannel,
} from "@/lib/chat-constants";
import type { AuthRole } from "@/lib/api-types";
import useAuthStore from "@/store/authStore";
import useChatStore from "@/store/chatStore";
import { useEffect, useRef } from "react";
import type { Socket } from "socket.io-client";

type UseChatSocketOptions = {
  role: AuthRole;
  activeContactId: string | null;
  adminChannel?: AdminChatChannel;
  showAdminInbox?: boolean;
  receiverId?: string | null;
};

export function useChatSocket({
  role,
  activeContactId,
  adminChannel = "sellers",
  showAdminInbox = false,
  receiverId = null,
}: UseChatSocketOptions) {
  const user = useAuthStore(state => state.user);
  const appendIncomingMessage = useChatStore(state => state.appendIncomingMessage);
  const socketRef = useRef<Socket | null>(null);

  const conversation = resolveChatConversationKind(role, {
    adminChannel,
    showAdminInbox,
  });

  useEffect(() => {
    if (!user?.id && role !== "admin") return;

    const socket = createChatSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      registerChatSocketUser(socket, role, {
        id: user?.id ?? ADMIN_CHAT_PEER_ID,
        name: user?.name ?? user?.email ?? "Admin",
        email: user?.email,
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
    const resolvedReceiver =
      receiverId ??
      (showAdminInbox ? ADMIN_CHAT_PEER_ID : activeContactId);

    let senderId = user?.id ?? "";
    if (role === "admin") {
      senderId = ADMIN_CHAT_PEER_ID;
    }

    if (
      !socket ||
      (role !== "admin" && !senderId) ||
      resolvedReceiver === null ||
      !message.trim()
    ) {
      return;
    }

    emitSocketChatMessage(socket, role, conversation, {
      senderId,
      receiverId: resolvedReceiver,
      message: message.trim(),
      senderName: user?.name ?? user?.email ?? "User",
    });
  };

  return { emitLiveMessage };
}
