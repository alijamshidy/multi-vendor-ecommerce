"use client";

import useReviewStore from "@/store/reviewStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";
import TextAreaInput from "../form/TextAreaInput";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import RatingInput from "./RatingInput";

export default function SubmitReview({ productId }: { productId: string }) {
  const t = useTranslations("reviews");
  const tCommon = useTranslations("common");
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const createReview = useReviewStore(state => state.createReview);
  const isLoading = useReviewStore(state => state.loading.createReview);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const formData = new FormData(event.currentTarget);
    const comment = String(formData.get("comment") ?? "");
    const rating = Number(formData.get("rating") ?? 5);

    if (!comment.trim()) return;

    try {
      await createReview({ productId, comment, rating });
      toast.success(t("submitSuccess"));
      setIsReviewFormVisible(false);
      event.currentTarget.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("submitFailed"));
    }
  };

  return (
    <div>
      <Button
        size="lg"
        className="capitalize cursor-pointer"
        onClick={() => setIsReviewFormVisible(prev => !prev)}>
        {isReviewFormVisible ? t("leaveReview") : t("addReview")}
      </Button>
      {isReviewFormVisible ? (
        <Card className="mt-8 p-8">
          <form
            className="space-y-4"
            onSubmit={handleSubmit}>
            <RatingInput
              name="rating"
              labelText=""
            />
            <TextAreaInput
              name="comment"
              labelText={t("feedback")}
              defaultValue=""
            />
            <Button
              type="submit"
              className="mt-4 capitalize"
              size="lg"
              disabled={isLoading}>
              {isLoading ? t("submitting") : tCommon("submit")}
            </Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
