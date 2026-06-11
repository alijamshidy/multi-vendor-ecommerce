"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type ContentMetaRow = {
  label: string;
  value: string;
};

type ContentListItemProps = {
  title: string;
  subtitle?: string;
  meta?: ContentMetaRow[];
  imageUrl?: string | null;
  imageAlt?: string;
  isActive?: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

export default function ContentListItem({
  title,
  subtitle,
  meta = [],
  imageUrl,
  imageAlt,
  isActive = false,
  onEdit,
  onDelete,
}: ContentListItemProps) {
  const t = useTranslations("adminContent");

  return (
    <Card
      className={cn(
        "rounded-lg transition-shadow",
        isActive && "border-primary ring-1 ring-primary/30",
      )}>
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
        {imageUrl ? (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-md border sm:size-24">
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              className="object-cover"
              sizes="96px"
            />
          </div>
        ) : null}

        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="font-medium leading-snug">{title}</p>
            {subtitle ? (
              <p className="mt-1 line-clamp-3 text-sm text-muted-foreground">
                {subtitle}
              </p>
            ) : null}
          </div>

          {meta.length > 0 ? (
            <dl className="grid gap-2 sm:grid-cols-2">
              {meta.map(row => (
                <div
                  key={`${row.label}-${row.value}`}
                  className="rounded-md bg-muted/50 px-3 py-2">
                  <dt className="text-xs font-medium text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="mt-0.5 truncate text-sm">{row.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        <div className="flex shrink-0 gap-2 sm:flex-col">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={onEdit}>
            <Pencil className="size-3.5" />
            {t("edit")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="flex-1 sm:flex-none"
            onClick={onDelete}>
            <Trash2 className="size-3.5" />
            {t("delete")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
