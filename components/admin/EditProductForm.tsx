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
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditProductForm({ productId }: { productId: string }) {
  const t = useTranslations("adminForms");
  const router = useRouter();
  const locale = GetLocale();
  const [categoryId, setCategoryId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const categories = useCategoryStore(state => state.categories);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const activeProduct = useManagementStore(state => state.activeProduct);
  const fetchProduct = useManagementStore(state => state.fetchProduct);
  const updateProduct = useManagementStore(state => state.updateProduct);
  const isLoadingProduct = useManagementStore(state => state.loading.fetchProduct);
  const isSubmitting = useManagementStore(state => state.loading.updateProduct);

  useStoreInit(() => {
    void fetchCategories();
    void fetchProduct(productId);
  }, [productId]);

  useEffect(() => {
    if (!activeProduct || activeProduct.id !== productId) return;
    setName(activeProduct.label);
    setPrice(String(activeProduct.originalPrice));
    setStock(activeProduct.stock != null ? String(activeProduct.stock) : "");
    setDescription(activeProduct.description);
  }, [activeProduct, productId]);

  useEffect(() => {
    if (!categoryId && categories.length > 0 && activeProduct?.category) {
      const match = categories.find(
        category => category.label === activeProduct.category,
      );
      if (match) setCategoryId(match.id);
    }
  }, [categories, activeProduct, categoryId]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!categoryId) {
      toast.error(t("selectCategory"));
      return;
    }

    try {
      await updateProduct(productId, {
        name: name.trim(),
        price: price.trim(),
        stuck: stock.trim(),
        categories: [categoryId],
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(images.length > 0 ? { images } : {}),
      });
      toast.success(t("productUpdated"));
      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("productUpdateFailed"),
      );
    }
  };

  if (isLoadingProduct && !activeProduct) {
    return (
      <p className="text-sm text-muted-foreground">{t("loadingProduct")}</p>
    );
  }

  return (
    <Card className="rounded-md">
      <CardContent className="p-5">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("productName")}</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">{t("price")}</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={event => setPrice(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stuck">{t("stock")}</Label>
            <Input
              id="stuck"
              name="stuck"
              type="number"
              min="0"
              value={stock}
              onChange={event => setStock(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">{t("selectCategoryPlaceholder")}</Label>
            <Select
              value={categoryId}
              onValueChange={setCategoryId}>
              <SelectTrigger
                id="category"
                className="w-full">
                <SelectValue placeholder={t("selectCategoryPlaceholder")} />
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
            label={t("productImages")}
            files={images}
            onChange={setImages}
            helperText={t("productImagesUpdateHelper")}
          />
          <Button
            type="submit"
            className="sm:col-span-2"
            disabled={isSubmitting || !name.trim() || !price.trim()}>
            {isSubmitting ? t("saving") : t("updateProduct")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
