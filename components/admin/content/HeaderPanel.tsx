"use client";

import ContentFormActions from "@/components/admin/content/ContentFormActions";
import ContentListItem from "@/components/admin/content/ContentListItem";
import ContentPanelLayout from "@/components/admin/content/ContentPanelLayout";
import MultiImageInput from "@/components/form/MultiImageInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resolveMediaUrl } from "@/lib/api-utils";
import useContentManagementStore from "@/store/contentManagementStore";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function HeaderPanel() {
  const t = useTranslations("adminContent");
  const headers = useContentManagementStore(state => state.headers);
  const createHeader = useContentManagementStore(state => state.createHeader);
  const updateHeader = useContentManagementStore(state => state.updateHeader);
  const deleteHeader = useContentManagementStore(state => state.deleteHeader);
  const uploadHeaderImage = useContentManagementStore(
    state => state.uploadHeaderImage,
  );
  const isLoading = useContentManagementStore(
    state => state.loading.fetchHeaders,
  );
  const isSaving = useContentManagementStore(state => state.loading.saveHeader);
  const isUploading = useContentManagementStore(
    state => state.loading.uploadHeaderImage,
  );

  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [relatedLink, setRelatedLink] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setText("");
    setColor("#ffffff");
    setRelatedLink("");
    setImages([]);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      let headerId = editingId;

      if (editingId) {
        await updateHeader(editingId, {
          text: text.trim() || undefined,
          color: color.trim() || undefined,
        });
        toast.success(t("headerUpdated"));
      } else {
        headerId = await createHeader({
          text: text.trim() || undefined,
          color: color.trim() || undefined,
        });
        toast.success(t("headerCreated"));
      }

      if (headerId && images[0]) {
        await uploadHeaderImage(headerId, {
          image: images[0],
          related_link: relatedLink.trim() || undefined,
        });
        toast.success(t("imageUploaded"));
      }

      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("headerSaveFailed"),
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(t("deleteConfirm", { name }))) return;

    try {
      await deleteHeader(id);
      toast.success(t("headerDeleted"));
      if (editingId === id) resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("headerDeleteFailed"),
      );
    }
  };

  return (
    <ContentPanelLayout
      title={t("headerSectionTitle")}
      description={t("headerSectionDesc")}
      storeLocation={t("headerStoreLocation")}
      isEditing={Boolean(editingId)}
      itemCount={headers.length}
      isLoading={isLoading}
      emptyMessage={t("noHeaders")}
      form={
        <form
          onSubmit={handleSubmit}
          className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="header-text">{t("promoText")}</Label>
            <Input
              id="header-text"
              value={text}
              onChange={event => setText(event.target.value)}
              placeholder={t("promoTextPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="header-color">{t("textColor")}</Label>
            <div className="flex gap-2">
              <Input
                id="header-color-picker"
                type="color"
                value={color.startsWith("#") ? color : "#ffffff"}
                onChange={event => setColor(event.target.value)}
                className="h-10 w-14 shrink-0 cursor-pointer p-1"
              />
              <Input
                id="header-color"
                value={color}
                onChange={event => setColor(event.target.value)}
                placeholder="#ffffff"
                dir="ltr"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="header-link">{t("relatedLink")}</Label>
            <Input
              id="header-link"
              value={relatedLink}
              onChange={event => setRelatedLink(event.target.value)}
              placeholder="/products"
              dir="ltr"
            />
          </div>
          <MultiImageInput
            label={t("promoImage")}
            files={images}
            onChange={setImages}
            maxFiles={1}
            helperText={t("promoImageHelper")}
          />
          <ContentFormActions
            isSaving={isSaving || isUploading}
            isEditing={Boolean(editingId)}
            createLabel={t("addHeader")}
            onCancel={resetForm}
          />
        </form>
      }>
      {headers.map(header => (
        <ContentListItem
          key={header.id}
          title={header.text || t("untitled")}
          imageUrl={
            header.image?.image
              ? resolveMediaUrl(header.image.image)
              : null
          }
          imageAlt={header.text ?? "Header promo"}
          meta={[
            ...(header.color
              ? [{ label: t("textColor"), value: header.color }]
              : []),
            ...(header.image?.related_link
              ? [
                  {
                    label: t("relatedLink"),
                    value: header.image.related_link,
                  },
                ]
              : []),
          ]}
          isActive={editingId === String(header.id)}
          onEdit={() => {
            setEditingId(String(header.id));
            setText(header.text ?? "");
            setColor(header.color ?? "#ffffff");
            setRelatedLink(header.image?.related_link ?? "");
            setImages([]);
          }}
          onDelete={() =>
            void handleDelete(String(header.id), header.text ?? t("untitled"))
          }
        />
      ))}
    </ContentPanelLayout>
  );
}
