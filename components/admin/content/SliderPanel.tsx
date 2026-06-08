"use client";

import MultiImageInput from "@/components/form/MultiImageInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStoreInit } from "@/hooks/use-store-init";
import { resolveMediaUrl } from "@/lib/api-utils";
import useContentManagementStore from "@/store/contentManagementStore";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const POSITIONS = [
  { value: "1", labelKey: "positionTop" },
  { value: "2", labelKey: "positionBottom" },
  { value: "3", labelKey: "positionLeft" },
  { value: "4", labelKey: "positionRight" },
  { value: "5", labelKey: "positionCenter" },
] as const;

export default function SliderPanel() {
  const t = useTranslations("adminContent");
  const sliders = useContentManagementStore(state => state.sliders);
  const fetchSliders = useContentManagementStore(state => state.fetchSliders);
  const createSlider = useContentManagementStore(state => state.createSlider);
  const updateSlider = useContentManagementStore(state => state.updateSlider);
  const deleteSlider = useContentManagementStore(state => state.deleteSlider);
  const uploadSliderImage = useContentManagementStore(
    state => state.uploadSliderImage,
  );
  const isLoading = useContentManagementStore(
    state => state.loading.fetchSliders,
  );
  const isSaving = useContentManagementStore(state => state.loading.saveSlider);
  const isUploading = useContentManagementStore(
    state => state.loading.uploadSliderImage,
  );

  const [text, setText] = useState("");
  const [color, setColor] = useState("");
  const [position, setPosition] = useState("5");
  const [relatedLink, setRelatedLink] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useStoreInit(() => fetchSliders());

  const resetForm = () => {
    setText("");
    setColor("");
    setPosition("5");
    setRelatedLink("");
    setImages([]);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      let sliderId = editingId;
      const payload = {
        text: text.trim() || undefined,
        color: color.trim() || undefined,
        position: Number(position),
      };

      if (editingId) {
        await updateSlider(editingId, payload);
        toast.success(t("sliderUpdated"));
      } else {
        sliderId = await createSlider(payload);
        toast.success(t("sliderCreated"));
      }

      if (sliderId && images.length > 0) {
        for (const file of images) {
          await uploadSliderImage(sliderId, {
            image: file,
            related_link: relatedLink.trim() || undefined,
          });
        }
        toast.success(t("imageUploaded"));
      }

      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("sliderSaveFailed"),
      );
    }
  };

  const handleEdit = (
    id: string,
    itemText?: string | null,
    itemColor?: string | null,
    itemPosition?: number | string,
  ) => {
    setEditingId(id);
    setText(itemText ?? "");
    setColor(itemColor ?? "");
    setPosition(String(itemPosition ?? 5));
    setRelatedLink("");
    setImages([]);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSlider(id);
      toast.success(t("sliderDeleted"));
      if (editingId === id) resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("sliderDeleteFailed"),
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
              <Label htmlFor="slider-text">{t("slideText")}</Label>
              <Input
                id="slider-text"
                value={text}
                onChange={event => setText(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slider-color">{t("textColor")}</Label>
              <Input
                id="slider-color"
                value={color}
                onChange={event => setColor(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slider-position">{t("textPosition")}</Label>
              <Select
                value={position}
                onValueChange={setPosition}>
                <SelectTrigger id="slider-position">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map(item => (
                    <SelectItem
                      key={item.value}
                      value={item.value}>
                      {t(item.labelKey)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="slider-link">{t("relatedLink")}</Label>
              <Input
                id="slider-link"
                value={relatedLink}
                onChange={event => setRelatedLink(event.target.value)}
                placeholder="/products"
              />
            </div>
            <MultiImageInput
              className="sm:col-span-2"
              label={t("slideImages")}
              files={images}
              onChange={setImages}
              maxFiles={5}
              helperText={t("slideImagesHelper")}
            />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button
                type="submit"
                disabled={isSaving || isUploading}>
                {isSaving || isUploading
                  ? t("saving")
                  : editingId
                    ? t("updateItem")
                    : t("addSlider")}
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
      ) : sliders.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("noSliders")}</p>
      ) : (
        <div className="space-y-3">
          {sliders.map(slider => (
            <Card
              key={slider.id}
              className="rounded-md">
              <CardContent className="space-y-3 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="font-medium">{slider.text || t("untitled")}</p>
                    <p className="text-sm text-muted-foreground">
                      {slider.position_string ?? t("positionCenter")}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleEdit(
                          String(slider.id),
                          slider.text,
                          slider.color,
                          slider.position,
                        )
                      }>
                      {t("edit")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(String(slider.id))}>
                      {t("delete")}
                    </Button>
                  </div>
                </div>
                {slider.images?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {slider.images.map(image => (
                      <div
                        key={image.id}
                        className="relative size-20 overflow-hidden rounded-md">
                        <Image
                          src={resolveMediaUrl(image.image)}
                          alt={image.text ?? "Slide"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
