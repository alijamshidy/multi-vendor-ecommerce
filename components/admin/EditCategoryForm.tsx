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
import { GetLocale } from "@/utils/GetUrlParams";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditCategoryForm({ slug }: { slug: string }) {
  const t = useTranslations("adminForms");
  const router = useRouter();
  const locale = GetLocale();
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState("none");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const categories = useCategoryStore(state => state.categories);
  const activeCategory = useCategoryStore(state => state.activeCategory);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const fetchCategoryBySlug = useCategoryStore(
    state => state.fetchCategoryBySlug,
  );
  const updateCategory = useCategoryStore(state => state.updateCategory);
  const isLoadingCategory = useCategoryStore(state => state.loading.fetchCategory);
  const isSubmitting = useCategoryStore(state => state.loading.updateCategory);

  useStoreInit(() => {
    void fetchCategories();
    void fetchCategoryBySlug(slug);
  }, [slug]);

  useEffect(() => {
    if (!activeCategory || activeCategory.href !== slug) return;
    setName(activeCategory.label);
    setParentId(activeCategory.parent ?? "none");
  }, [activeCategory, slug]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await updateCategory(slug, {
        name: name.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(parentId !== "none" ? { parent: parentId } : {}),
        ...(images[0] ? { image: images[0] } : {}),
      });
      toast.success(t("categoryUpdated"));
      router.push(`/${locale}/admin/categories`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("categoryUpdateFailed"),
      );
    }
  };

  if (isLoadingCategory && !activeCategory) {
    return (
      <p className="text-sm text-muted-foreground">{t("loadingCategory")}</p>
    );
  }

  return (
    <Card className="rounded-md">
      <CardContent className="p-5">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="name">{t("categoryName")}</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="slug">{t("slug")}</Label>
            <Input
              id="slug"
              value={slug}
              disabled
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="parent">{t("parentCategory")}</Label>
            <Select
              value={parentId}
              onValueChange={setParentId}>
              <SelectTrigger
                id="parent"
                className="w-full">
                <SelectValue placeholder={t("selectParentOptional")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{t("noParent")}</SelectItem>
                {categories
                  .filter(category => category.href !== slug)
                  .map(category => (
                    <SelectItem
                      key={category.id}
                      value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={event => setDescription(event.target.value)}
              className="min-h-32 resize-none"
            />
          </div>
          <MultiImageInput
            className="sm:col-span-2"
            label={t("categoryImage")}
            files={images}
            onChange={setImages}
            maxFiles={1}
            helperText={t("categoryImageHelper")}
          />
          <Button
            type="submit"
            className="sm:col-span-2"
            disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? t("saving") : t("updateCategory")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
