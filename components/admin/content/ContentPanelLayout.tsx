"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import ContentListSkeleton from "@/components/admin/content/ContentListSkeleton";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

type ContentPanelLayoutProps = {
  title: string;
  description: string;
  storeLocation: string;
  isEditing: boolean;
  itemCount: number;
  isLoading: boolean;
  emptyMessage: string;
  form: ReactNode;
  children: ReactNode;
};

export default function ContentPanelLayout({
  title,
  description,
  storeLocation,
  isEditing,
  itemCount,
  isLoading,
  emptyMessage,
  form,
  children,
}: ContentPanelLayoutProps) {
  const t = useTranslations("adminContent");

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-muted/30 p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              {description}
            </p>
          </div>
          <Badge variant="secondary">{t("itemsCount", { count: itemCount })}</Badge>
        </div>
        <div className="mt-3 flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>{storeLocation}</span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,22rem)_1fr]">
        <Card className="h-fit rounded-lg border-primary/20 xl:sticky xl:top-24">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base">
                {isEditing ? t("editFormTitle") : t("addFormTitle")}
              </CardTitle>
              {isEditing ? (
                <Badge>{t("editingBadge")}</Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{t("formHint")}</p>
          </CardHeader>
          <CardContent className="pt-5">{form}</CardContent>
        </Card>

        <div className="space-y-4">
          <div>
            <h3 className="text-base font-semibold">{t("publishedItems")}</h3>
            <p className="text-sm text-muted-foreground">{t("publishedHint")}</p>
          </div>
          <Separator />

          {isLoading ? (
            <ContentListSkeleton />
          ) : itemCount === 0 ? (
            <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </p>
          ) : (
            <div className={cn("space-y-3")}>{children}</div>
          )}
        </div>
      </div>
    </div>
  );
}
