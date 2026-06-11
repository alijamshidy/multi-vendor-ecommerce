"use client";

import ContentFormActions from "@/components/admin/content/ContentFormActions";
import ContentListItem from "@/components/admin/content/ContentListItem";
import ContentPanelLayout from "@/components/admin/content/ContentPanelLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useContentManagementStore from "@/store/contentManagementStore";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ContactPanel() {
  const t = useTranslations("adminContent");
  const contacts = useContentManagementStore(state => state.contacts);
  const createContact = useContentManagementStore(state => state.createContact);
  const updateContact = useContentManagementStore(state => state.updateContact);
  const deleteContact = useContentManagementStore(state => state.deleteContact);
  const isLoading = useContentManagementStore(
    state => state.loading.fetchContacts,
  );
  const isSaving = useContentManagementStore(state => state.loading.saveContact);

  const [instagram, setInstagram] = useState("");
  const [telegram, setTelegram] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setInstagram("");
    setTelegram("");
    setPhone1("");
    setPhone2("");
    setEditingId(null);
  };

  const buildMeta = (item: (typeof contacts)[number]) =>
    [
      item.contact_number
        ? { label: t("phonePrimary"), value: item.contact_number }
        : null,
      item.contact_number_2
        ? { label: t("phoneSecondary"), value: item.contact_number_2 }
        : null,
      item.instagram_channel
        ? { label: t("instagram"), value: item.instagram_channel }
        : null,
      item.telegram_channel
        ? { label: t("telegram"), value: item.telegram_channel }
        : null,
    ].filter(Boolean) as Array<{ label: string; value: string }>;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const payload = {
      instagram_channel: instagram.trim() || null,
      telegram_channel: telegram.trim() || null,
      contact_number: phone1.trim() || null,
      contact_number_2: phone2.trim() || null,
    };

    try {
      if (editingId) {
        await updateContact(editingId, payload);
        toast.success(t("contactUpdated"));
      } else {
        await createContact(payload);
        toast.success(t("contactCreated"));
      }
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("contactSaveFailed"),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("deleteContactConfirm"))) return;

    try {
      await deleteContact(id);
      toast.success(t("contactDeleted"));
      if (editingId === id) resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("contactDeleteFailed"),
      );
    }
  };

  return (
    <ContentPanelLayout
      title={t("contactSectionTitle")}
      description={t("contactSectionDesc")}
      storeLocation={t("contactStoreLocation")}
      isEditing={Boolean(editingId)}
      itemCount={contacts.length}
      isLoading={isLoading}
      emptyMessage={t("noContacts")}
      form={
        <form
          onSubmit={handleSubmit}
          className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact-phone1">{t("phonePrimary")}</Label>
            <Input
              id="contact-phone1"
              value={phone1}
              onChange={event => setPhone1(event.target.value)}
              dir="ltr"
              placeholder="09181234567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone2">{t("phoneSecondary")}</Label>
            <Input
              id="contact-phone2"
              value={phone2}
              onChange={event => setPhone2(event.target.value)}
              dir="ltr"
              placeholder="02112345678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-instagram">{t("instagram")}</Label>
            <Input
              id="contact-instagram"
              value={instagram}
              onChange={event => setInstagram(event.target.value)}
              dir="ltr"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-telegram">{t("telegram")}</Label>
            <Input
              id="contact-telegram"
              value={telegram}
              onChange={event => setTelegram(event.target.value)}
              dir="ltr"
              placeholder="https://t.me/..."
            />
          </div>
          <p className="text-xs text-muted-foreground">{t("phoneFormatHint")}</p>
          <ContentFormActions
            isSaving={isSaving}
            isEditing={Boolean(editingId)}
            createLabel={t("addContact")}
            onCancel={resetForm}
          />
        </form>
      }>
      {contacts.map((contact, index) => (
        <ContentListItem
          key={contact.id}
          title={t("contactEntryTitle", { number: index + 1 })}
          meta={buildMeta(contact)}
          isActive={editingId === String(contact.id)}
          onEdit={() => {
            setEditingId(String(contact.id));
            setInstagram(contact.instagram_channel ?? "");
            setTelegram(contact.telegram_channel ?? "");
            setPhone1(contact.contact_number ?? "");
            setPhone2(contact.contact_number_2 ?? "");
          }}
          onDelete={() => void handleDelete(String(contact.id!))}
        />
      ))}
    </ContentPanelLayout>
  );
}
