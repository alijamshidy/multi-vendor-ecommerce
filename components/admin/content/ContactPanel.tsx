"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStoreInit } from "@/hooks/use-store-init";
import useContentManagementStore from "@/store/contentManagementStore";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ContactPanel() {
  const t = useTranslations("adminContent");
  const contacts = useContentManagementStore(state => state.contacts);
  const fetchContacts = useContentManagementStore(state => state.fetchContacts);
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

  useStoreInit(() => fetchContacts());

  const resetForm = () => {
    setInstagram("");
    setTelegram("");
    setPhone1("");
    setPhone2("");
    setEditingId(null);
  };

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

  const handleEdit = (id: string, item: (typeof contacts)[number]) => {
    setEditingId(id);
    setInstagram(item.instagram_channel ?? "");
    setTelegram(item.telegram_channel ?? "");
    setPhone1(item.contact_number ?? "");
    setPhone2(item.contact_number_2 ?? "");
  };

  const handleDelete = async (id: string) => {
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
    <div className="space-y-6">
      <Card className="rounded-md">
        <CardContent className="grid gap-4 p-5">
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-2">
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
            <p className="text-xs text-muted-foreground sm:col-span-2">
              {t("phoneFormatHint")}
            </p>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button
                type="submit"
                disabled={isSaving}>
                {isSaving
                  ? t("saving")
                  : editingId
                    ? t("updateItem")
                    : t("addContact")}
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}>
                  {t("cancelEdit")}
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : contacts.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noContacts")}</p>
      ) : (
        <div className="space-y-3">
          {contacts.map(contact => (
            <Card
              key={contact.id}
              className="rounded-md">
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1 text-sm">
                  {contact.contact_number ? (
                    <p dir="ltr">{contact.contact_number}</p>
                  ) : null}
                  {contact.contact_number_2 ? (
                    <p dir="ltr">{contact.contact_number_2}</p>
                  ) : null}
                  {contact.instagram_channel ? (
                    <p className="truncate">{contact.instagram_channel}</p>
                  ) : null}
                  {contact.telegram_channel ? (
                    <p className="truncate">{contact.telegram_channel}</p>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(String(contact.id), contact)}>
                    {t("edit")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(String(contact.id!))}>
                    {t("delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
