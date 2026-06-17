/** Backend represents the admin participant with an empty id in seller↔admin chat. */
export const ADMIN_CHAT_PEER_ID = "";

export type AdminChatChannel = "sellers" | "customers";

export type ChatConversationKind =
  | "seller-customer"
  | "admin-seller"
  | "admin-customer";

export function resolveChatConversationKind(
  role: "admin" | "seller" | "customer",
  options: {
    adminChannel?: AdminChatChannel;
    showAdminInbox?: boolean;
  } = {},
): ChatConversationKind {
  if (role === "admin") {
    return options.adminChannel === "customers" ? "admin-customer" : "admin-seller";
  }
  if (role === "seller") {
    return options.showAdminInbox ? "admin-seller" : "seller-customer";
  }
  return options.showAdminInbox ? "admin-customer" : "seller-customer";
}

export function isAdminChatSender(senderId: string | undefined | null): boolean {
  return senderId === ADMIN_CHAT_PEER_ID;
}

export function isOwnChatMessage(
  role: "admin" | "seller" | "customer",
  message: { senderId: string },
  userId?: string,
): boolean {
  if (role === "admin") {
    return isAdminChatSender(message.senderId) || message.senderId === userId;
  }

  return message.senderId === userId;
}
