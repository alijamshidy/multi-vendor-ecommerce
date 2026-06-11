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

export default function RecommendationPanel() {
  const t = useTranslations("adminContent");
  const recommendations = useContentManagementStore(
    state => state.recommendations,
  );
  const createRecommendation = useContentManagementStore(
    state => state.createRecommendation,
  );
  const updateRecommendation = useContentManagementStore(
    state => state.updateRecommendation,
  );
  const deleteRecommendation = useContentManagementStore(
    state => state.deleteRecommendation,
  );
  const uploadRecommendationImage = useContentManagementStore(
    state => state.uploadRecommendationImage,
  );
  const isLoading = useContentManagementStore(
    state => state.loading.fetchRecommendations,
  );
  const isSaving = useContentManagementStore(
    state => state.loading.saveRecommendation,
  );
  const isUploading = useContentManagementStore(
    state => state.loading.uploadRecommendationImage,
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

  const getImageUrl = (image: unknown) => {
    if (!image || typeof image !== "object") return null;
    const record = image as { image?: string | null };
    return record.image ? resolveMediaUrl(record.image) : null;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      let itemId = editingId;
      const payload = {
        text: text.trim() || undefined,
        color: color.trim() || undefined,
        related_link: relatedLink.trim() || undefined,
      };

      if (editingId) {
        await updateRecommendation(editingId, payload);
        toast.success(t("recommendationUpdated"));
      } else {
        itemId = await createRecommendation(payload);
        toast.success(t("recommendationCreated"));
      }

      if (itemId && images[0]) {
        await uploadRecommendationImage(itemId, { image: images[0] });
        toast.success(t("imageUploaded"));
      }

      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("recommendationSaveFailed"),
      );
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(t("deleteConfirm", { name }))) return;

    try {
      await deleteRecommendation(id);
      toast.success(t("recommendationDeleted"));
      if (editingId === id) resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("recommendationDeleteFailed"),
      );
    }
  };

  return (
    <ContentPanelLayout
      title={t("recommendationsSectionTitle")}
      description={t("recommendationsSectionDesc")}
      storeLocation={t("recommendationsStoreLocation")}
      isEditing={Boolean(editingId)}
      itemCount={recommendations.length}
      isLoading={isLoading}
      emptyMessage={t("noRecommendations")}
      form={
        <form
          onSubmit={handleSubmit}
          className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="rec-text">{t("promoText")}</Label>
            <Input
              id="rec-text"
              value={text}
              onChange={event => setText(event.target.value)}
              placeholder={t("promoTextPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rec-color">{t("textColor")}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={color.startsWith("#") ? color : "#ffffff"}
                onChange={event => setColor(event.target.value)}
                className="h-10 w-14 shrink-0 cursor-pointer p-1"
              />
              <Input
                id="rec-color"
                value={color}
                onChange={event => setColor(event.target.value)}
                dir="ltr"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="rec-link">{t("relatedLink")}</Label>
            <Input
              id="rec-link"
              value={relatedLink}
              onChange={event => setRelatedLink(event.target.value)}
              placeholder="/products"
              dir="ltr"
            />
          </div>
          <MultiImageInput
            label={t("cardImage")}
            files={images}
            onChange={setImages}
            maxFiles={1}
            helperText={t("cardImageHelper")}
          />
          <ContentFormActions
            isSaving={isSaving || isUploading}
            isEditing={Boolean(editingId)}
            createLabel={t("addRecommendation")}
            onCancel={resetForm}
          />
        </form>
      }>
      {recommendations.map(item => (
        <ContentListItem
          key={item.id}
          title={item.text || t("untitled")}
          imageUrl={getImageUrl(item.image)}
          imageAlt={item.text ?? "Recommendation"}
          meta={[
            ...(item.related_link
              ? [{ label: t("relatedLink"), value: item.related_link }]
              : []),
            ...(item.color
              ? [{ label: t("textColor"), value: item.color }]
              : []),
          ]}
          isActive={editingId === String(item.id)}
          onEdit={() => {
            setEditingId(String(item.id));
            setText(item.text ?? "");
            setColor(item.color ?? "#ffffff");
            setRelatedLink(item.related_link ?? "");
            setImages([]);
          }}
          onDelete={() =>
            void handleDelete(String(item.id!), item.text ?? t("untitled"))
          }
        />
      ))}
    </ContentPanelLayout>
  );
}
