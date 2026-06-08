"use client";

import MultiImageInput from "@/components/form/MultiImageInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useStoreInit } from "@/hooks/use-store-init";
import { resolveMediaUrl } from "@/lib/api-utils";
import useContentManagementStore from "@/store/contentManagementStore";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function RecommendationPanel() {
  const t = useTranslations("adminContent");
  const recommendations = useContentManagementStore(
    state => state.recommendations,
  );
  const fetchRecommendations = useContentManagementStore(
    state => state.fetchRecommendations,
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
  const [color, setColor] = useState("");
  const [relatedLink, setRelatedLink] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useStoreInit(() => fetchRecommendations());

  const resetForm = () => {
    setText("");
    setColor("");
    setRelatedLink("");
    setImages([]);
    setEditingId(null);
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

  const handleEdit = (
    id: string,
    itemText?: string | null,
    itemColor?: string | null,
    itemLink?: string | null,
  ) => {
    setEditingId(id);
    setText(itemText ?? "");
    setColor(itemColor ?? "");
    setRelatedLink(itemLink ?? "");
    setImages([]);
  };

  const getImageUrl = (image: unknown) => {
    if (!image || typeof image !== "object") return null;
    const record = image as { image?: string | null };
    return record.image ? resolveMediaUrl(record.image) : null;
  };

  const handleDelete = async (id: string) => {
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
    <div className="space-y-6">
      <Card className="rounded-md">
        <CardContent className="grid gap-4 p-5">
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="rec-text">{t("promoText")}</Label>
              <Input
                id="rec-text"
                value={text}
                onChange={event => setText(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rec-color">{t("textColor")}</Label>
              <Input
                id="rec-color"
                value={color}
                onChange={event => setColor(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rec-link">{t("relatedLink")}</Label>
              <Input
                id="rec-link"
                value={relatedLink}
                onChange={event => setRelatedLink(event.target.value)}
                placeholder="/products"
              />
            </div>
            <MultiImageInput
              className="sm:col-span-2"
              label={t("cardImage")}
              files={images}
              onChange={setImages}
              maxFiles={1}
              helperText={t("cardImageHelper")}
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button
                type="submit"
                disabled={isSaving || isUploading}>
                {isSaving || isUploading
                  ? t("saving")
                  : editingId
                    ? t("updateItem")
                    : t("addRecommendation")}
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
      ) : recommendations.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noRecommendations")}</p>
      ) : (
        <div className="space-y-3">
          {recommendations.map(item => {
            const imageUrl = getImageUrl(item.image);
            return (
              <Card
                key={item.id}
                className="rounded-md">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    {imageUrl ? (
                      <div className="relative size-16 overflow-hidden rounded-md">
                        <Image
                          src={imageUrl}
                          alt={item.text ?? "Recommendation"}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>
                    ) : null}
                    <div>
                      <p className="font-medium">{item.text || t("untitled")}</p>
                      {item.related_link ? (
                        <p className="text-sm text-muted-foreground">
                          {item.related_link}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleEdit(
                          String(item.id),
                          item.text,
                          item.color,
                          item.related_link,
                        )
                      }>
                      {t("edit")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(String(item.id!))}>
                      {t("delete")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
