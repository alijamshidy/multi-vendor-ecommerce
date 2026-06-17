"use client";

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
import { Textarea } from "@/components/ui/textarea";
import MultiImageInput from "@/components/form/MultiImageInput";
import { useStoreInit } from "@/hooks/use-store-init";
import useCategoryStore from "@/store/categoryStore";
import useManagementStore from "@/store/managementStore";
import { GetLocale } from "@/utils/GetUrlParams";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function CreateProductForm() {
  const t = useTranslations("adminForms");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const locale = GetLocale();
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const categories = useCategoryStore(state => state.categories);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const isLoadingCategories = useCategoryStore(
    state => state.loading.fetchCategories,
  );
  const categoryError = useCategoryStore(state => state.errorMessage);

  const createProduct = useManagementStore(state => state.createProduct);
  const isSubmitting = useManagementStore(state => state.loading.createProduct);

  useStoreInit(() => fetchCategories());

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId) {
      toast.error(t("selectCategory"));
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const price = String(formData.get("price") ?? "").trim();
    const stuck = String(formData.get("stuck") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    try {
      await createProduct({
        name,
        price,
        stuck,
        categories: [categoryId],
        ...(description ? { description } : {}),
        ...(images.length > 0 ? { images } : {}),
      });
      toast.success(t("productCreated"));
      router.push(`/${locale}/seller/products`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("productCreateFailed"),
      );
    }
  };

  return (
    <Card className="rounded-md">
      <CardContent className="p-5">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2">
          <Field
            name="name"
            label={t("productName")}
            required
          />
          <Field
            name="price"
            label={t("price")}
            type="number"
            min="0"
            step="0.01"
            required
          />
          <div className="space-y-2">
            <Label htmlFor="category">{tNav("categories")}</Label>
            <input
              type="hidden"
              name="category"
              value={categoryId}
              required
            />
            <Select
              value={categoryId}
              onValueChange={setCategoryId}
              disabled={isLoadingCategories || categories.length === 0}>
              <SelectTrigger
                id="category"
                className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingCategories
                      ? t("loadingCategories")
                      : categories.length === 0
                        ? t("noCategories")
                        : t("selectCategoryPlaceholder")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem
                    key={category.id}
                    value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryError ? (
              <p className="text-sm text-destructive">{categoryError}</p>
            ) : null}
          </div>
          <Field
            name="stuck"
            label={t("stock")}
            type="number"
            min="0"
            step="1"
            required
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              name="description"
              className="min-h-32 resize-none"
            />
          </div>
          <MultiImageInput
            className="sm:col-span-2"
            label={t("productImages")}
            files={images}
            onChange={setImages}
            maxFiles={10}
            helperText={t("productImagesHelper")}
          />
          <Button
            type="submit"
            className="sm:col-span-2"
            disabled={isSubmitting || isLoadingCategories}>
            {isSubmitting ? t("saving") : t("saveProduct")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function Field({
  name,
  label,
  type = "text",
  required,
  min,
  step,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: string;
  step?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        min={min}
        step={step}
      />
    </div>
  );
}
