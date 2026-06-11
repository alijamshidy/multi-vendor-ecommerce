"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MultiImageInput from "@/components/form/MultiImageInput";
import { useStoreInit } from "@/hooks/use-store-init";
import useCollectionStore from "@/store/collectionStore";
import useManagementStore from "@/store/managementStore";
import { GetLocale } from "@/utils/GetUrlParams";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type CollectionFormProps = {
  mode: "create" | "edit";
  slug?: string;
};

export default function CollectionForm({ mode, slug }: CollectionFormProps) {
  const t = useTranslations("adminForms");
  const router = useRouter();
  const locale = GetLocale();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const products = useManagementStore(state => state.products);
  const fetchProducts = useManagementStore(state => state.fetchProducts);
  const activeCollection = useCollectionStore(state => state.activeCollection);
  const collectionProducts = useCollectionStore(
    state => state.collectionProducts,
  );
  const fetchCollectionBySlug = useCollectionStore(
    state => state.fetchCollectionBySlug,
  );
  const createCollection = useCollectionStore(state => state.createCollection);
  const updateCollection = useCollectionStore(state => state.updateCollection);
  const isLoadingCollection = useCollectionStore(
    state => state.loading.fetchCollection,
  );
  const isCreating = useCollectionStore(state => state.loading.createCollection);
  const isUpdating = useCollectionStore(state => state.loading.updateCollection);
  const isSubmitting = isCreating || isUpdating;

  useStoreInit(() => {
    void fetchProducts();
    if (mode === "edit" && slug) {
      void fetchCollectionBySlug(slug);
    }
  }, [mode, slug]);

  useEffect(() => {
    if (mode !== "edit" || !activeCollection || activeCollection.href !== slug) {
      return;
    }
    setName(activeCollection.label);
    setDescription(activeCollection.description ?? "");
    setSelectedProducts(collectionProducts.map(product => product.id));
  }, [mode, activeCollection, slug, collectionProducts]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts(current =>
      current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId],
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload = {
      name: name.trim(),
      ...(description.trim() ? { description: description.trim() } : {}),
      ...(images[0] ? { image: images[0] } : {}),
      ...(selectedProducts.length > 0 ? { product: selectedProducts } : {}),
    };

    try {
      if (mode === "create") {
        await createCollection(payload);
        toast.success(t("collectionCreated"));
      } else if (slug) {
        await updateCollection(slug, payload);
        toast.success(t("collectionUpdated"));
      }
      router.push(`/${locale}/admin/collections`);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : mode === "create"
            ? t("collectionCreateFailed")
            : t("collectionUpdateFailed"),
      );
    }
  };

  if (mode === "edit" && isLoadingCollection && !activeCollection) {
    return (
      <p className="text-sm text-muted-foreground">{t("loadingCollection")}</p>
    );
  }

  return (
    <Card className="rounded-md">
      <CardContent className="p-5">
        <form
          onSubmit={handleSubmit}
          className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("collectionName")}</Label>
            <Input
              id="name"
              name="name"
              value={name}
              onChange={event => setName(event.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              id="description"
              name="description"
              value={description}
              onChange={event => setDescription(event.target.value)}
              className="min-h-28 resize-none"
            />
          </div>
          <MultiImageInput
            label={t("collectionImage")}
            files={images}
            onChange={setImages}
            maxFiles={1}
            helperText={t("collectionImageHelper")}
          />
          <div className="space-y-2">
            <Label>{t("collectionProducts")}</Label>
            <div className="max-h-56 space-y-2 overflow-y-auto rounded-md border p-3">
              {products.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("noProductsForCollection")}
                </p>
              ) : (
                products.map(product => (
                  <label
                    key={product.id}
                    className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                    />
                    <span className="capitalize">{product.label}</span>
                  </label>
                ))
              )}
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting || !name.trim()}>
            {isSubmitting
              ? t("saving")
              : mode === "create"
                ? t("saveCollection")
                : t("updateCollection")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
