import type { ApiChatMessage, ApiChatContact } from "@/lib/api-types";
import { getApiErrorMessage } from "@/lib/api-utils";
import api from "@/lib/axios";
import { apiEndpoints } from "@/lib/endpoints";
import { ADMIN_CHAT_PEER_ID } from "@/lib/chat-constants";
import useAuthStore from "@/store/authStore";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { withStoreDevtools } from "./devtools";
import { createStoreLoadingState, setStoreLoading } from "./store-utils";

export type ChatContactView = {
  id: string;
  name: string;
  subtitle: string;
};

export type ChatMessageView = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt?: string;
};

type ChatAction =
  | "fetchContacts"
  | "fetchMessages"
  | "sendMessage"
  | "addFriend";

function mapContact(item: ApiChatContact): ChatContactView {
  const record = item as ApiChatContact & {
    shopInfo?: { shopName?: string };
  };
  const id = item.fdId?.trim() || item._id?.trim() || "";
  const shopName =
    item.shopName ?? record.shopInfo?.shopName ?? undefined;

  return {
    id,
    name: item.name ?? shopName ?? item.email ?? "Contact",
    subtitle: shopName ?? item.email ?? "",
  };
}

function mapMessage(item: ApiChatMessage, index = 0): ChatMessageView {
  const text = item.message ?? item.text ?? "";
  return {
    id:
      item._id ??
      `${item.senderId}-${item.receverId}-${item.createdAt ?? text}-${index}`,
    senderId: item.senderId,
    receiverId: item.receverId,
    message: text,
    createdAt: item.createdAt,
  };
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const unique: T[] = [];

  for (const item of items) {
    if (!item.id || seen.has(item.id)) continue;
    seen.add(item.id);
    unique.push(item);
  }

  return unique;
}

function mapContacts(items: ApiChatContact[]): ChatContactView[] {
  return dedupeById(items.map(mapContact).filter(contact => contact.id));
}

function mapMessages(items: ApiChatMessage[]): ChatMessageView[] {
  return dedupeById(
    items.map((item, index) => mapMessage(item, index)).filter(msg => msg.id),
  );
}

function unwrapContacts(data: unknown): ApiChatContact[] {
  if (Array.isArray(data)) return data as ApiChatContact[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  const candidates = [
    record.MyFriends,
    record.sellers,
    record.customers,
    record.friends,
    record.contacts,
    record.users,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as ApiChatContact[];
  }

  return [];
}

function unwrapMessages(data: unknown): ApiChatMessage[] {
  if (Array.isArray(data)) return data as ApiChatMessage[];
  if (!data || typeof data !== "object") return [];

  const record = data as Record<string, unknown>;
  const candidates = [record.messages, record.chat, record.chats];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as ApiChatMessage[];
  }

  return [];
}

function appendLocalMessage(
  set: (partial: Partial<ChatState> | ((state: ChatState) => Partial<ChatState>)) => void,
  payload: { senderId: string; receiverId: string; message: string },
) {
  const localMessage: ChatMessageView = {
    id: `local-${Date.now()}`,
    senderId: payload.senderId,
    receiverId: payload.receiverId,
    message: payload.message,
    createdAt: new Date().toISOString(),
  };

  set(state => ({
    messages: dedupeById([...state.messages, localMessage]),
  }));
}

function getSenderName(): string {
  const user = useAuthStore.getState().user;
  return user?.name ?? user?.email ?? "User";
}

type ChatState = {
  contacts: ChatContactView[];
  messages: ChatMessageView[];
  activeContactId: string | null;
  errorMessage: string;
  loading: Record<ChatAction, boolean>;
  fetchAdminContacts: () => Promise<void>;
  fetchAdminCustomerContacts: () => Promise<void>;
  fetchSellerCustomers: (sellerId?: string) => Promise<void>;
  fetchCustomerContacts: () => Promise<void>;
  fetchAdminMessages: (receiverId: string) => Promise<void>;
  fetchAdminCustomerMessages: (receiverId: string) => Promise<void>;
  fetchSellerCustomerMessages: (customerId: string) => Promise<void>;
  fetchSellerAdminMessages: () => Promise<void>;
  fetchCustomerAdminMessages: () => Promise<void>;
  sendAdminMessage: (payload: {
    receiverId: string;
    message: string;
    productId?: string;
  }) => Promise<void>;
  sendAdminCustomerMessage: (payload: {
    receiverId: string;
    message: string;
  }) => Promise<void>;
  sendSellerCustomerMessage: (payload: {
    receiverId: string;
    message: string;
    productId?: string;
  }) => Promise<void>;
  sendSellerAdminMessage: (payload: {
    receiverId: string;
    message: string;
    productId?: string;
  }) => Promise<void>;
  addCustomerFriend: (payload: {
    customerId: string;
    sellerId: string;
  }) => Promise<void>;
  sendCustomerMessage: (payload: {
    senderId: string;
    receiverId: string;
    message: string;
    productId?: string;
  }) => Promise<void>;
  sendCustomerAdminMessage: (payload: {
    senderId: string;
    message: string;
  }) => Promise<void>;
  appendIncomingMessage: (message: ChatMessageView) => void;
  setActiveContact: (contactId: string | null) => void;
  resetChat: () => void;
  clearError: () => void;
};

const useChatStore = create<ChatState>()(
  devtools(
    (set, get) => ({
      contacts: [],
      messages: [],
      activeContactId: null,
      errorMessage: "",
      loading: createStoreLoadingState([
        "fetchContacts",
        "fetchMessages",
        "sendMessage",
        "addFriend",
      ] as const),

      clearError: () => set({ errorMessage: "" }),

      resetChat: () =>
        set({
          contacts: [],
          messages: [],
          activeContactId: null,
          errorMessage: "",
        }),

      setActiveContact: contactId => set({ activeContactId: contactId }),

      appendIncomingMessage: message =>
        set(state => ({
          messages: dedupeById([...state.messages, message]),
        })),

      fetchAdminContacts: async () => {
        setStoreLoading(set, "fetchContacts", true, { errorMessage: "" });

        try {
          const { data } = await api.get(apiEndpoints.chat.adminSellers);
          const contacts = mapContacts(unwrapContacts(data));
          set({ contacts, errorMessage: "" });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load sellers"),
            contacts: [],
          });
        } finally {
          setStoreLoading(set, "fetchContacts", false);
        }
      },

      fetchAdminCustomerContacts: async () => {
        setStoreLoading(set, "fetchContacts", true, { errorMessage: "" });

        try {
          const { data } = await api.get(apiEndpoints.chat.adminCustomers);
          const contacts = mapContacts(unwrapContacts(data));
          set({ contacts, errorMessage: "" });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load customers"),
            contacts: [],
          });
        } finally {
          setStoreLoading(set, "fetchContacts", false);
        }
      },

      fetchSellerCustomers: async sellerId => {
        setStoreLoading(set, "fetchContacts", true, { errorMessage: "" });

        const resolvedSellerId =
          sellerId ?? useAuthStore.getState().user?.id ?? null;
        if (!resolvedSellerId) {
          set({ contacts: [] });
          setStoreLoading(set, "fetchContacts", false);
          return;
        }

        try {
          const { data } = await api.get(
            apiEndpoints.chat.sellerCustomers(resolvedSellerId),
          );
          const contacts = mapContacts(unwrapContacts(data));
          set({ contacts, errorMessage: "" });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load customers"),
            contacts: [],
          });
        } finally {
          setStoreLoading(set, "fetchContacts", false);
        }
      },

      fetchCustomerContacts: async () => {
        setStoreLoading(set, "fetchContacts", true, { errorMessage: "" });

        const customerId = useAuthStore.getState().user?.id;
        if (!customerId) {
          set({ contacts: [] });
          setStoreLoading(set, "fetchContacts", false);
          return;
        }

        try {
          const { data } = await api.post(apiEndpoints.chat.customerAddFriend, {
            sellerId: "",
            userId: customerId,
          });
          const record = data as { MyFriends?: ApiChatContact[] | null };
          const rawContacts = Array.isArray(record.MyFriends)
            ? record.MyFriends
            : unwrapContacts(data);
          const contacts = mapContacts(rawContacts);
          set({ contacts, errorMessage: "" });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load contacts"),
            contacts: [],
          });
        } finally {
          setStoreLoading(set, "fetchContacts", false);
        }
      },

      fetchAdminMessages: async receiverId => {
        setStoreLoading(set, "fetchMessages", true, { errorMessage: "" });

        try {
          const { data } = await api.get(
            apiEndpoints.chat.adminMessages(receiverId),
          );
          set({
            messages: mapMessages(unwrapMessages(data)),
            activeContactId: receiverId,
            errorMessage: "",
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load messages"),
            messages: [],
          });
        } finally {
          setStoreLoading(set, "fetchMessages", false);
        }
      },

      fetchAdminCustomerMessages: async receiverId => {
        setStoreLoading(set, "fetchMessages", true, { errorMessage: "" });

        try {
          const { data } = await api.get(
            apiEndpoints.chat.adminCustomerMessages(receiverId),
          );
          set({
            messages: mapMessages(unwrapMessages(data)),
            activeContactId: receiverId,
            errorMessage: "",
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load messages"),
            messages: [],
          });
        } finally {
          setStoreLoading(set, "fetchMessages", false);
        }
      },

      fetchSellerCustomerMessages: async customerId => {
        setStoreLoading(set, "fetchMessages", true, { errorMessage: "" });

        try {
          const { data } = await api.get(
            apiEndpoints.chat.sellerMessages(customerId),
          );
          set({
            messages: mapMessages(unwrapMessages(data)),
            activeContactId: customerId,
            errorMessage: "",
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load messages"),
            messages: [],
          });
        } finally {
          setStoreLoading(set, "fetchMessages", false);
        }
      },

      fetchSellerAdminMessages: async () => {
        setStoreLoading(set, "fetchMessages", true, { errorMessage: "" });

        try {
          const { data } = await api.get(apiEndpoints.chat.sellerAdminInbox);
          set({
            messages: mapMessages(unwrapMessages(data)),
            errorMessage: "",
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load messages"),
            messages: [],
          });
        } finally {
          setStoreLoading(set, "fetchMessages", false);
        }
      },

      fetchCustomerAdminMessages: async () => {
        setStoreLoading(set, "fetchMessages", true, { errorMessage: "" });

        try {
          const { data } = await api.get(apiEndpoints.chat.customerAdminInbox);
          set({
            messages: mapMessages(unwrapMessages(data)),
            errorMessage: "",
          });
        } catch (error) {
          set({
            errorMessage: getApiErrorMessage(error, "Failed to load messages"),
            messages: [],
          });
        } finally {
          setStoreLoading(set, "fetchMessages", false);
        }
      },

      sendAdminMessage: async payload => {
        setStoreLoading(set, "sendMessage", true, { errorMessage: "" });

        try {
          await api.post(apiEndpoints.chat.sellerAdminMessage, {
            senderId: ADMIN_CHAT_PEER_ID,
            receverId: payload.receiverId,
            message: payload.message,
            senderName: getSenderName(),
          });
          appendLocalMessage(set, {
            senderId: ADMIN_CHAT_PEER_ID,
            receiverId: payload.receiverId,
            message: payload.message,
          });
          void get()
            .fetchAdminMessages(payload.receiverId)
            .catch(() => undefined);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to send message");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "sendMessage", false);
        }
      },

      sendAdminCustomerMessage: async payload => {
        setStoreLoading(set, "sendMessage", true, { errorMessage: "" });

        try {
          await api.post(apiEndpoints.chat.adminCustomerMessage, {
            senderId: ADMIN_CHAT_PEER_ID,
            receverId: payload.receiverId,
            message: payload.message,
            senderName: getSenderName(),
          });
          appendLocalMessage(set, {
            senderId: ADMIN_CHAT_PEER_ID,
            receiverId: payload.receiverId,
            message: payload.message,
          });
          void get()
            .fetchAdminCustomerMessages(payload.receiverId)
            .catch(() => undefined);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to send message");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "sendMessage", false);
        }
      },

      sendSellerCustomerMessage: async payload => {
        setStoreLoading(set, "sendMessage", true, { errorMessage: "" });

        const senderId = useAuthStore.getState().user?.id;
        if (!senderId) {
          setStoreLoading(set, "sendMessage", false);
          throw new Error("Not signed in");
        }

        try {
          await api.post(apiEndpoints.chat.sellerSendMessage, {
            senderId,
            receverId: payload.receiverId,
            text: payload.message,
            name: getSenderName(),
          });
          appendLocalMessage(set, {
            senderId,
            receiverId: payload.receiverId,
            message: payload.message,
          });
          void get()
            .fetchSellerCustomerMessages(payload.receiverId)
            .catch(() => undefined);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to send message");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "sendMessage", false);
        }
      },

      sendSellerAdminMessage: async payload => {
        setStoreLoading(set, "sendMessage", true, { errorMessage: "" });

        const senderId = useAuthStore.getState().user?.id;
        if (!senderId) {
          setStoreLoading(set, "sendMessage", false);
          throw new Error("Not signed in");
        }

        try {
          await api.post(apiEndpoints.chat.sellerAdminMessage, {
            senderId,
            receverId: ADMIN_CHAT_PEER_ID,
            message: payload.message,
            senderName: getSenderName(),
          });
          appendLocalMessage(set, {
            senderId,
            receiverId: ADMIN_CHAT_PEER_ID,
            message: payload.message,
          });
          void get().fetchSellerAdminMessages().catch(() => undefined);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to send message");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "sendMessage", false);
        }
      },

      addCustomerFriend: async payload => {
        setStoreLoading(set, "addFriend", true, { errorMessage: "" });

        try {
          const { data } = await api.post(apiEndpoints.chat.customerAddFriend, {
            sellerId: payload.sellerId,
            userId: payload.customerId,
          });
          const contacts = mapContacts(unwrapContacts(data));
          const messages = mapMessages(unwrapMessages(data));
          set({
            contacts:
              contacts.length > 0
                ? contacts
                : [
                    {
                      id: payload.sellerId,
                      name: payload.sellerId,
                      subtitle: "",
                    },
                  ],
            messages,
            activeContactId: payload.sellerId,
            errorMessage: "",
          });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to add seller");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "addFriend", false);
        }
      },

      sendCustomerMessage: async payload => {
        setStoreLoading(set, "sendMessage", true, { errorMessage: "" });

        try {
          await api.post(apiEndpoints.chat.customerSendMessage, {
            userId: payload.senderId,
            sellerId: payload.receiverId,
            text: payload.message,
            name: getSenderName(),
          });

          const { data } = await api.post(apiEndpoints.chat.customerAddFriend, {
            sellerId: payload.receiverId,
            userId: payload.senderId,
          });
          const contacts = mapContacts(unwrapContacts(data));
          const messages = mapMessages(unwrapMessages(data));

          set({
            contacts:
              contacts.length > 0
                ? contacts
                : get().contacts,
            messages,
            activeContactId: payload.receiverId,
            errorMessage: "",
          });
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to send message");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "sendMessage", false);
        }
      },

      sendCustomerAdminMessage: async payload => {
        setStoreLoading(set, "sendMessage", true, { errorMessage: "" });

        try {
          await api.post(apiEndpoints.chat.adminCustomerMessage, {
            senderId: payload.senderId,
            receverId: ADMIN_CHAT_PEER_ID,
            message: payload.message,
            senderName: getSenderName(),
          });
          appendLocalMessage(set, {
            senderId: payload.senderId,
            receiverId: ADMIN_CHAT_PEER_ID,
            message: payload.message,
          });
          void get().fetchCustomerAdminMessages().catch(() => undefined);
        } catch (error) {
          const message = getApiErrorMessage(error, "Failed to send message");
          set({ errorMessage: message });
          throw new Error(message);
        } finally {
          setStoreLoading(set, "sendMessage", false);
        }
      },
    }),
    withStoreDevtools("chat"),
  ),
);

export default useChatStore;
