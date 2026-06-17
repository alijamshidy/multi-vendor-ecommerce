import type { AuthRole } from "@/lib/api-types";
import type { ChatMessageView } from "@/store/chatStore";
import { io, type Socket } from "socket.io-client";

export type SocketChatPayload = {
  senderId?: string;
  receverId?: string;
  message?: string;
  text?: string;
  name?: string;
  senderName?: string;
};

function getSocketOrigin(): string {
  const raw =
    process.env.NEXT_PUBLIC_MARKETPLACE_API_URL ?? "http://localhost:5000";
  return raw.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

function mapSocketPayload(payload: SocketChatPayload): ChatMessageView | null {
  const senderId = payload.senderId ?? "";
  const receiverId = payload.receverId ?? "";
  const message = payload.message ?? payload.text ?? "";
  if (!message) return null;

  return {
    id: `${senderId}-${receiverId}-${message}-${Date.now()}`,
    senderId,
    receiverId,
    message,
  };
}

export function createChatSocket(): Socket {
  return io(getSocketOrigin(), {
    transports: ["websocket", "polling"],
    withCredentials: true,
  });
}

export function registerChatSocketUser(
  socket: Socket,
  role: AuthRole,
  user: { id: string; name?: string; email?: string },
): void {
  const userInfo = {
    id: user.id,
    name: user.name ?? user.email ?? "User",
  };

  if (role === "customer") {
    socket.emit("add_user", user.id, userInfo);
    return;
  }

  if (role === "seller") {
    socket.emit("add_seller", user.id, userInfo);
    return;
  }

  socket.emit("add_admin", {
    id: user.id,
    name: user.name ?? "Admin",
    email: user.email ?? "",
  });
}

export function emitSocketChatMessage(
  socket: Socket,
  role: AuthRole,
  payload: {
    senderId: string;
    receiverId: string;
    message: string;
    senderName?: string;
    isAdminInbox?: boolean;
  },
): void {
  const base = {
    senderId: payload.senderId,
    receverId: payload.receiverId,
    message: payload.message,
    text: payload.message,
    name: payload.senderName,
    senderName: payload.senderName,
  };

  if (role === "customer") {
    socket.emit("send_customer_message", base);
    return;
  }

  if (role === "seller") {
    if (payload.isAdminInbox) {
      socket.emit("send_message_seller_to_admin", base);
      return;
    }
    socket.emit("send_seller_message", base);
    return;
  }

  socket.emit("send_message_admin_to_seller", base);
}

export function subscribeChatSocket(
  socket: Socket,
  role: AuthRole,
  onMessage: (message: ChatMessageView) => void,
): () => void {
  const handlers: Array<[string, (payload: SocketChatPayload) => void]> = [];

  const bind = (event: string) => {
    const handler = (payload: SocketChatPayload) => {
      const mapped = mapSocketPayload(payload);
      if (mapped) onMessage(mapped);
    };
    socket.on(event, handler);
    handlers.push([event, handler]);
  };

  if (role === "customer") {
    bind("seller_message");
  } else if (role === "seller") {
    bind("customer_message");
    bind("receved_admin_message");
  } else {
    bind("receved_seller_message");
  }

  return () => {
    for (const [event, handler] of handlers) {
      socket.off(event, handler);
    }
  };
}
