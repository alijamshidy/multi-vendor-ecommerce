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

export default function HeaderPanel() {
  const t = useTranslations("adminContent");
  const headers = useContentManagementStore(state => state.headers);
  const fetchHeaders = useContentManagementStore(state => state.fetchHeaders);
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
  const [color, setColor] = useState("");
  const [relatedLink, setRelatedLink] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useStoreInit(() => fetchHeaders());

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

  const handleEdit = (id: string, itemText?: string | null, itemColor?: string | null) => {
    setEditingId(id);
    setText(itemText ?? "");
    setColor(itemColor ?? "");
    setRelatedLink("");
    setImages([]);
  };

  const handleDelete = async (id: string) => {
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
    <div className="space-y-6">
      <Card className="rounded-md">
        <CardContent className="grid gap-4 p-5">
          <form
            onSubmit={handleSubmit}
            className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="header-text">{t("promoText")}</Label>
              <Input
                id="header-text"
                value={text}
                onChange={event => setText(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="header-color">{t("textColor")}</Label>
              <Input
                id="header-color"
                value={color}
                onChange={event => setColor(event.target.value)}
                placeholder="#ffffff"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="header-link">{t("relatedLink")}</Label>
              <Input
                id="header-link"
                value={relatedLink}
                onChange={event => setRelatedLink(event.target.value)}
                placeholder="/products"
              />
            </div>
            <MultiImageInput
              className="sm:col-span-2"
              label={t("promoImage")}
              files={images}
              onChange={setImages}
              maxFiles={1}
              helperText={t("promoImageHelper")}
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button
                type="submit"
                disabled={isSaving || isUploading}>
                {isSaving || isUploading
                  ? t("saving")
                  : editingId
                    ? t("updateItem")
                    : t("addHeader")}
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
      ) : headers.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noHeaders")}</p>
      ) : (
        <div className="space-y-3">
          {headers.map(header => (
            <Card
              key={header.id}
              className="rounded-md">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  {header.image?.image ? (
                    <div className="relative size-16 overflow-hidden rounded-md">
                      <Image
                        src={resolveMediaUrl(header.image.image)}
                        alt={header.text ?? "Header"}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : null}
                  <div>
                    <p className="font-medium">{header.text || t("untitled")}</p>
                    {header.color ? (
                      <p className="text-sm text-muted-foreground">
                        {t("textColor")}: {header.color}
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
                      handleEdit(String(header.id), header.text, header.color)
                    }>
                    {t("edit")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(String(header.id))}>
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
