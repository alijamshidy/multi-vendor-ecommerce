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
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function CreateCategoryForm() {
  const router = useRouter();
  const locale = GetLocale();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [parentId, setParentId] = useState("none");
  const [images, setImages] = useState<File[]>([]);

  const categories = useCategoryStore(state => state.categories);
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const createCategory = useCategoryStore(state => state.createCategory);
  const clearMessages = useCategoryStore(state => state.clearMessages);
  const isLoadingCategories = useCategoryStore(
    state => state.loading.fetchCategories,
  );
  const isSubmitting = useCategoryStore(state => state.loading.createCategory);
  const [submitError, setSubmitError] = useState("");

  useStoreInit(() => fetchCategories());

  useEffect(() => {
    clearMessages();
    setSubmitError("");
  }, [clearMessages]);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const description = String(formData.get("description") ?? "").trim();

    try {
      setSubmitError("");
      await createCategory({
        name: name.trim(),
        slug: slug.trim(),
        ...(description ? { description } : {}),
        ...(parentId !== "none" ? { parent: parentId } : {}),
        ...(images[0] ? { image: images[0] } : {}),
      });
      toast.success("Category created");
      router.push(`/${locale}/admin/dashboard`);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create category";
      setSubmitError(message);
      toast.error(message);
    }
  };

  return (
    <Card className="rounded-md">
      <CardContent className="p-5">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Category name</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={event => handleNameChange(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              name="slug"
              value={slug}
              onChange={event => {
                setSlugEdited(true);
                setSlug(event.target.value);
              }}
              required
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="parent">Parent category</Label>
            <Select
              value={parentId}
              onValueChange={setParentId}
              disabled={isLoadingCategories}>
              <SelectTrigger
                id="parent"
                className="w-full">
                <SelectValue
                  placeholder={
                    isLoadingCategories
                      ? "Loading categories..."
                      : "Select parent (optional)"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No parent</SelectItem>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              className="min-h-32 resize-none"
            />
          </div>
          <MultiImageInput
            className="sm:col-span-2"
            label="Category image"
            files={images}
            onChange={setImages}
            maxFiles={1}
            helperText="Optional. One image is used as the category thumbnail."
          />
          {submitError ? (
            <p
              className="text-sm text-destructive sm:col-span-2"
              role="alert">
              {submitError}
            </p>
          ) : null}
          <Button
            type="submit"
            className="sm:col-span-2"
            disabled={isSubmitting || !name.trim() || !slug.trim()}>
            {isSubmitting ? "Saving..." : "Save category"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
