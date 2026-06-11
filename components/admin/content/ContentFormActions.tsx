"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

type ContentFormActionsProps = {
  isSaving: boolean;
  isEditing: boolean;
  createLabel: string;
  onCancel?: () => void;
};

export default function ContentFormActions({
  isSaving,
  isEditing,
  createLabel,
  onCancel,
}: ContentFormActionsProps) {
  const t = useTranslations("adminContent");

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      <Button
        type="submit"
        className="min-w-28"
        disabled={isSaving}>
        {isSaving ? t("saving") : isEditing ? t("updateItem") : createLabel}
      </Button>
      {isEditing && onCancel ? (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}>
          {t("cancelEdit")}
        </Button>
      ) : null}
    </div>
  );
}
