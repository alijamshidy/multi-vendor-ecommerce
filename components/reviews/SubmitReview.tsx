"use client";

import { useState } from "react";
import TextAreaInput from "../form/TextAreaInput";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import RatingInput from "./RatingInput";
import useReviewStore from "@/store/reviewStore";
import { toast } from "sonner";

export default function SubmitReview({ productId }: { productId: string }) {
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
      toast.success("Review submitted");
      setIsReviewFormVisible(false);
      event.currentTarget.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review",
      );
    }
  };

  return (
    <div>
      <Button
        size="lg"
        className="capitalize"
        onClick={() => setIsReviewFormVisible(prev => !prev)}>
        leave review
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
              labelText="feedback"
              defaultValue=""
            />
            <Button
              type="submit"
              className="mt-4 capitalize"
              size="lg"
              disabled={isLoading}>
              {isLoading ? "Submitting..." : "submit"}
            </Button>
          </form>
        </Card>
      ) : null}
    </div>
  );
}
