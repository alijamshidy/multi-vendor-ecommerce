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
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function CreateProductForm() {
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
      toast.error("Please select a category");
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
      toast.success("Product created");
      router.push(`/${locale}/admin/products`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create product",
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
            label="Product name"
            required
          />
          <Field
            name="price"
            label="Price"
            type="number"
            min="0"
            step="0.01"
            required
          />
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
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
                      ? "Loading categories..."
                      : categories.length === 0
                        ? "No categories available"
                        : "Select a category"
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
            label="Stock"
            type="number"
            min="0"
            step="1"
            required
          />
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="min-h-32 resize-none"
            />
          </div>
          <MultiImageInput
            className="sm:col-span-2"
            label="Product images"
            files={images}
            onChange={setImages}
            maxFiles={10}
            helperText="Select one or more images. The first image is used as the primary photo."
          />
          <Button
            type="submit"
            className="sm:col-span-2"
            disabled={isSubmitting || isLoadingCategories}>
            {isSubmitting ? "Saving..." : "Save product"}
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
