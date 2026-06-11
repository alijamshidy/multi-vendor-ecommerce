"use client";

import ContentFormActions from "@/components/admin/content/ContentFormActions";
import ContentListItem from "@/components/admin/content/ContentListItem";
import ContentPanelLayout from "@/components/admin/content/ContentPanelLayout";
import MultiImageInput from "@/components/form/MultiImageInput";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [color, setColor] = useState("#ffffff");
  const [position, setPosition] = useState("5");
  const [relatedLink, setRelatedLink] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const resetForm = () => {
    setText("");
    setColor("#ffffff");
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

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(t("deleteConfirm", { name }))) return;

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
    <ContentPanelLayout
      title={t("sliderSectionTitle")}
      description={t("sliderSectionDesc")}
      storeLocation={t("sliderStoreLocation")}
      isEditing={Boolean(editingId)}
      itemCount={sliders.length}
      isLoading={isLoading}
      emptyMessage={t("noSliders")}
      form={
        <form
          onSubmit={handleSubmit}
          className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="slider-text">{t("slideText")}</Label>
            <Input
              id="slider-text"
              value={text}
              onChange={event => setText(event.target.value)}
              placeholder={t("slideTextPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slider-color">{t("textColor")}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={color.startsWith("#") ? color : "#ffffff"}
                onChange={event => setColor(event.target.value)}
                className="h-10 w-14 shrink-0 cursor-pointer p-1"
              />
              <Input
                id="slider-color"
                value={color}
                onChange={event => setColor(event.target.value)}
                dir="ltr"
              />
            </div>
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
          <div className="space-y-2">
            <Label htmlFor="slider-link">{t("relatedLink")}</Label>
            <Input
              id="slider-link"
              value={relatedLink}
              onChange={event => setRelatedLink(event.target.value)}
              placeholder="/products"
              dir="ltr"
            />
          </div>
          <MultiImageInput
            label={t("slideImages")}
            files={images}
            onChange={setImages}
            maxFiles={5}
            helperText={t("slideImagesHelper")}
          />
          <ContentFormActions
            isSaving={isSaving || isUploading}
            isEditing={Boolean(editingId)}
            createLabel={t("addSlider")}
            onCancel={resetForm}
          />
        </form>
      }>
      {sliders.map(slider => {
        const firstImage = slider.images?.[0];
        const extraImages = slider.images?.slice(1) ?? [];

        return (
          <div
            key={slider.id}
            className="space-y-2">
            <ContentListItem
              title={slider.text || t("untitled")}
              meta={[
                {
                  label: t("textPosition"),
                  value: slider.position_string ?? t("positionCenter"),
                },
                ...(slider.color
                  ? [{ label: t("textColor"), value: slider.color }]
                  : []),
                {
                  label: t("imageCount"),
                  value: String(slider.images?.length ?? 0),
                },
              ]}
              imageUrl={
                firstImage?.image
                  ? resolveMediaUrl(firstImage.image)
                  : null
              }
              imageAlt={slider.text ?? "Slide"}
              isActive={editingId === String(slider.id)}
              onEdit={() => {
                setEditingId(String(slider.id));
                setText(slider.text ?? "");
                setColor(slider.color ?? "#ffffff");
                setPosition(String(slider.position ?? 5));
                setRelatedLink("");
                setImages([]);
              }}
              onDelete={() =>
                void handleDelete(
                  String(slider.id),
                  slider.text ?? t("untitled"),
                )
              }
            />
            {extraImages.length > 0 ? (
              <div className="flex flex-wrap gap-2 ps-2">
                {extraImages.map(image => (
                  <div
                    key={image.id}
                    className="relative size-16 overflow-hidden rounded-md border">
                    <Image
                      src={resolveMediaUrl(image.image)}
                      alt={image.text ?? "Slide"}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </ContentPanelLayout>
  );
}
