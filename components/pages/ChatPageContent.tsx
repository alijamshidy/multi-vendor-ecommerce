"use client";

import BorderedListSkeleton from "@/components/commerce/BorderedListSkeleton";
import PageHeader from "@/components/commerce/PageHeader";
import PageShell from "@/components/commerce/PageShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatSocket } from "@/hooks/use-chat-socket";
import { useStoreInit } from "@/hooks/use-store-init";
import type { AuthRole } from "@/lib/api-types";
import {
  ADMIN_CHAT_PEER_ID,
  isOwnChatMessage,
  type AdminChatChannel,
} from "@/lib/chat-constants";
import { cn } from "@/lib/utils";
import useAuthStore from "@/store/authStore";
import useChatStore from "@/store/chatStore";
import { Headphones, MessageSquare, Send, Store, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import type { ChatMessageView } from "@/store/chatStore";

type ChatPageContentProps = {
  role: AuthRole;
};

function resolveReceiverId({
  role,
  adminChannel,
  activeContactId,
  sellerIdInput,
  showAdminInbox,
  messages,
  userId,
}: {
  role: AuthRole;
  adminChannel: AdminChatChannel;
  activeContactId: string | null;
  sellerIdInput: string;
  showAdminInbox: boolean;
  messages: ChatMessageView[];
  userId?: string;
}): string | null {
  if (role === "admin") {
    return activeContactId;
  }

  if (role === "seller" && showAdminInbox) {
    const peerMessage = messages.find(item => item.senderId !== userId);
    return (
      peerMessage?.senderId ??
      messages.find(item => item.receiverId !== userId)?.receiverId ??
      ADMIN_CHAT_PEER_ID
    );
  }

  if (role === "customer" && showAdminInbox) {
    return ADMIN_CHAT_PEER_ID;
  }

  if (role === "customer") {
    return activeContactId ?? (sellerIdInput.trim() || null);
  }

  return activeContactId;
}

export default function ChatPageContent({ role }: ChatPageContentProps) {
  const t = useTranslations("chat");
  const searchParams = useSearchParams();
  const sellerIdFromQuery = searchParams.get("sellerId") ?? "";
  const user = useAuthStore(state => state.user);

  const contacts = useChatStore(state => state.contacts);
  const messages = useChatStore(state => state.messages);
  const activeContactId = useChatStore(state => state.activeContactId);
  const errorMessage = useChatStore(state => state.errorMessage);
  const fetchAdminContacts = useChatStore(state => state.fetchAdminContacts);
  const fetchAdminCustomerContacts = useChatStore(
    state => state.fetchAdminCustomerContacts,
  );
  const fetchSellerCustomers = useChatStore(
    state => state.fetchSellerCustomers,
  );
  const fetchCustomerContacts = useChatStore(
    state => state.fetchCustomerContacts,
  );
  const fetchAdminMessages = useChatStore(state => state.fetchAdminMessages);
  const fetchAdminCustomerMessages = useChatStore(
    state => state.fetchAdminCustomerMessages,
  );
  const fetchSellerCustomerMessages = useChatStore(
    state => state.fetchSellerCustomerMessages,
  );
  const fetchSellerAdminMessages = useChatStore(
    state => state.fetchSellerAdminMessages,
  );
  const fetchCustomerAdminMessages = useChatStore(
    state => state.fetchCustomerAdminMessages,
  );
  const sendAdminMessage = useChatStore(state => state.sendAdminMessage);
  const sendAdminCustomerMessage = useChatStore(
    state => state.sendAdminCustomerMessage,
  );
  const sendSellerCustomerMessage = useChatStore(
    state => state.sendSellerCustomerMessage,
  );
  const sendSellerAdminMessage = useChatStore(
    state => state.sendSellerAdminMessage,
  );
  const addCustomerFriend = useChatStore(state => state.addCustomerFriend);
  const sendCustomerMessage = useChatStore(state => state.sendCustomerMessage);
  const sendCustomerAdminMessage = useChatStore(
    state => state.sendCustomerAdminMessage,
  );
  const setActiveContact = useChatStore(state => state.setActiveContact);
  const resetChat = useChatStore(state => state.resetChat);
  const isLoadingContacts = useChatStore(state => state.loading.fetchContacts);
  const isLoadingMessages = useChatStore(state => state.loading.fetchMessages);
  const isSending = useChatStore(state => state.loading.sendMessage);
  const isAddingFriend = useChatStore(state => state.loading.addFriend);

  const [draft, setDraft] = useState("");
  const [sellerIdInput, setSellerIdInput] = useState(sellerIdFromQuery);
  const [showAdminInbox, setShowAdminInbox] = useState(false);
  const [adminChannel, setAdminChannel] = useState<AdminChatChannel>("sellers");

  const receiverId = resolveReceiverId({
    role,
    adminChannel,
    activeContactId,
    sellerIdInput,
    showAdminInbox,
    messages,
    userId: user?.id,
  });

  const { emitLiveMessage } = useChatSocket({
    role,
    activeContactId,
    adminChannel,
    showAdminInbox,
    receiverId,
  });

  useStoreInit(() => {
    resetChat();
    setShowAdminInbox(false);
    setAdminChannel("sellers");

    if (role === "admin") {
      void fetchAdminContacts();
      return;
    }

    if (role === "seller") {
      void fetchSellerCustomers();
      return;
    }

    if (!user?.id) return;

    if (sellerIdFromQuery) {
      void addCustomerFriend({
        customerId: user.id,
        sellerId: sellerIdFromQuery,
      }).catch(() => undefined);
      return;
    }

    void fetchCustomerContacts();
  }, [role, sellerIdFromQuery, user?.id]);

  const handleAdminChannelChange = async (channel: AdminChatChannel) => {
    setAdminChannel(channel);
    setShowAdminInbox(false);
    setActiveContact(null);
    resetChat();

    if (channel === "sellers") {
      await fetchAdminContacts();
      return;
    }

    await fetchAdminCustomerContacts();
  };

  const handleSelectContact = async (contactId: string) => {
    setShowAdminInbox(false);
    setActiveContact(contactId);

    if (role === "admin") {
      if (adminChannel === "customers") {
        await fetchAdminCustomerMessages(contactId);
      } else {
        await fetchAdminMessages(contactId);
      }
      return;
    }

    if (role === "seller") {
      await fetchSellerCustomerMessages(contactId);
      return;
    }

    if (role === "customer" && user?.id) {
      setSellerIdInput(contactId);
      await addCustomerFriend({
        customerId: user.id,
        sellerId: contactId,
      });
    }
  };

  const handleOpenAdminInbox = async () => {
    setShowAdminInbox(true);
    setActiveContact(null);

    if (role === "seller") {
      await fetchSellerAdminMessages();
      return;
    }

    if (role === "customer") {
      await fetchCustomerAdminMessages();
    }
  };

  const handleAddSeller = async () => {
    if (!user?.id || !sellerIdInput.trim()) return;

    try {
      await addCustomerFriend({
        customerId: user.id,
        sellerId: sellerIdInput.trim(),
      });
      toast.success(t("sellerAdded"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("sellerAddFailed"),
      );
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) return;

    if (receiverId === null || receiverId === undefined) {
      toast.error(t("selectContactFirst"));
      return;
    }

    if (!user?.id && role !== "admin") {
      toast.error(t("messageSendFailed"));
      return;
    }

    try {
      if (role === "admin") {
        if (adminChannel === "customers") {
          await sendAdminCustomerMessage({ receiverId, message });
        } else {
          await sendAdminMessage({ receiverId, message });
        }
      } else if (role === "seller") {
        if (showAdminInbox) {
          await sendSellerAdminMessage({ receiverId, message });
        } else {
          await sendSellerCustomerMessage({ receiverId, message });
        }
      } else if (user?.id) {
        if (showAdminInbox) {
          await sendCustomerAdminMessage({ senderId: user.id, message });
        } else {
          await sendCustomerMessage({
            senderId: user.id,
            receiverId,
            message,
          });
        }
      }

      emitLiveMessage(message);
      setDraft("");
      toast.success(t("messageSent"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("messageSendFailed"),
      );
    }
  };

  const eyebrow =
    role === "admin"
      ? t("adminEyebrow")
      : role === "seller"
        ? t("sellerEyebrow")
        : t("customerEyebrow");

  const hasRecipient =
    role === "customer"
      ? showAdminInbox || Boolean(activeContactId ?? sellerIdInput.trim())
      : role === "admin"
        ? Boolean(activeContactId)
        : Boolean(activeContactId) || showAdminInbox;

  const canSend = Boolean(draft.trim()) && !isSending && hasRecipient;

  const threadTitle =
    showAdminInbox
      ? t("adminSupport")
      : role === "admin" && adminChannel === "customers"
        ? t("customerMessages")
        : role === "admin"
          ? t("sellerMessages")
          : t("messages");

  return (
    <PageShell>
      <PageHeader
        eyebrow={eyebrow}
        title={t("title")}
        description={t("description")}
      />

      {errorMessage ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : null}

      {role === "customer" ? (
        <Card className="rounded-md">
          <CardContent className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="sellerId">{t("sellerId")}</Label>
              <Input
                id="sellerId"
                value={sellerIdInput}
                onChange={event => setSellerIdInput(event.target.value)}
                placeholder={t("sellerIdPlaceholder")}
              />
            </div>
            <Button
              type="button"
              disabled={isAddingFriend || !sellerIdInput.trim()}
              onClick={() => void handleAddSeller()}>
              {t("addSeller")}
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,18rem)_1fr]">
        <Card className="rounded-md">
          <CardContent className="p-4">
            <p className="mb-3 text-sm font-medium">{t("contacts")}</p>

            {role === "admin" ? (
              <div className="mb-3 grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={adminChannel === "sellers" ? "default" : "outline"}
                  size="sm"
                  onClick={() => void handleAdminChannelChange("sellers")}>
                  <Store className="me-2 size-4" />
                  {t("sellers")}
                </Button>
                <Button
                  type="button"
                  variant={adminChannel === "customers" ? "default" : "outline"}
                  size="sm"
                  onClick={() => void handleAdminChannelChange("customers")}>
                  <Users className="me-2 size-4" />
                  {t("customers")}
                </Button>
              </div>
            ) : null}

            {role === "seller" || role === "customer" ? (
              <Button
                type="button"
                variant={showAdminInbox ? "default" : "outline"}
                size="sm"
                className="mb-3 w-full justify-start"
                onClick={() => void handleOpenAdminInbox()}>
                {role === "customer" ? (
                  <Headphones className="me-2 size-4" />
                ) : (
                  <MessageSquare className="me-2 size-4" />
                )}
                {t("adminSupport")}
              </Button>
            ) : null}

            {isLoadingContacts && contacts.length === 0 ? (
              <BorderedListSkeleton
                count={4}
                columns={2}
              />
            ) : contacts.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("noContacts")}</p>
            ) : (
              <div className="space-y-2">
                {contacts.map(contact => (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => void handleSelectContact(contact.id)}
                    className={cn(
                      "w-full rounded-md border p-3 text-start transition-colors hover:bg-muted/50",
                      activeContactId === contact.id &&
                        !showAdminInbox &&
                        "border-primary bg-primary/5",
                    )}>
                    <p className="font-medium">{contact.name}</p>
                    {contact.subtitle ? (
                      <p className="text-xs text-muted-foreground">
                        {contact.subtitle}
                      </p>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-md">
          <CardContent className="flex min-h-[28rem] flex-col p-4">
            <p className="mb-3 text-sm font-medium">{threadTitle}</p>

            <ScrollArea className="flex-1 rounded-md border p-3">
              {isLoadingMessages && messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("loading")}</p>
              ) : messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("noMessages")}
                </p>
              ) : (
                <div className="space-y-3">
                  {messages.map(item => {
                    const isMine = isOwnChatMessage(role, item, user?.id);
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          "max-w-[85%] rounded-md px-3 py-2 text-sm",
                          isMine
                            ? "ms-auto bg-primary text-primary-foreground"
                            : "bg-muted",
                        )}>
                        <p>{item.message}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </ScrollArea>

            <form
              onSubmit={handleSubmit}
              className="mt-4 flex gap-2">
              <Input
                value={draft}
                onChange={event => setDraft(event.target.value)}
                placeholder={
                  hasRecipient
                    ? t("messagePlaceholder")
                    : t("selectContactFirst")
                }
              />
              <Button
                type="submit"
                size="icon"
                disabled={!canSend}>
                <Send className="size-4" />
                <span className="sr-only">{t("send")}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
