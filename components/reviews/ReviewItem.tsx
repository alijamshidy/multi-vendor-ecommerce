"use client";

import ReviewCard from "@/components/reviews/ReviewCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useAuthStore from "@/store/authStore";
import useReviewStore, { type ReviewView } from "@/store/reviewStore";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

type ReviewItemProps = {
  review: ReviewView;
  productId: string;
  isReply?: boolean;
};

export default function ReviewItem({
  review,
  productId,
  isReply = false,
}: ReviewItemProps) {
  const t = useTranslations("reviews");
  const tCommon = useTranslations("common");
  const currentUserId = useAuthStore(state => state.user?.id ?? null);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const replyToReview = useReviewStore(state => state.replyToReview);
  const updateReview = useReviewStore(state => state.updateReview);
  const deleteReview = useReviewStore(state => state.deleteReview);

  const isOwner = Boolean(currentUserId && review.userId === currentUserId);

  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editText, setEditText] = useState(review.comment);
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;

    setIsSubmitting(true);
    try {
      await replyToReview({
        productId,
        parentId: review.id,
        text: replyText.trim(),
      });
      toast.success(t("replySuccess"));
      setReplyText("");
      setIsReplying(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("replyFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;

    setIsSubmitting(true);
    try {
      await updateReview({
        productId,
        commentId: review.id,
        text: editText.trim(),
      });
      toast.success(t("updateSuccess"));
      setIsEditing(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("updateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deleteReview({ productId, commentId: review.id });
      toast.success(t("deleteSuccess"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("deleteFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyClick = () => {
    if (!isAuthenticated) {
      toast.error(t("loginToReply"));
      return;
    }
    setIsReplying(prev => !prev);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setEditText(review.comment);
    setIsEditing(true);
    setIsReplying(false);
  };

  const handleCancelEdit = () => {
    setEditText(review.comment);
    setIsEditing(false);
  };

  return (
    <div className={isReply ? "border-s ps-4" : undefined}>
      <ReviewCard
        reviewInfo={{
          comment: review.comment,
          rating: review.rating,
          image: review.authorImageUrl || null,
          name: review.authorName || "Anonymous",
        }}
        headerActions={
          isOwner ? (
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                disabled={isSubmitting}
                onClick={handleEditClick}>
                {t("edit")}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                    disabled={isSubmitting}>
                    {t("delete")}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t("deleteConfirmTitle")}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("deleteConfirmDescription")}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                    <AlertDialogAction
                      variant="destructive"
                      disabled={isSubmitting}
                      onClick={handleDelete}>
                      {t("delete")}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null
        }>
        {isEditing ? (
          <div className="space-y-3">
            <Textarea
              value={editText}
              onChange={event => setEditText(event.target.value)}
              rows={4}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                disabled={isSubmitting || !editText.trim()}
                onClick={handleUpdate}>
                {isSubmitting ? t("saving") : t("save")}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleCancelEdit}>
                {t("cancel")}
              </Button>
            </div>
          </div>
        ) : null}
      </ReviewCard>

      {!isEditing ? (
        <div className="mt-2 flex flex-wrap gap-2 ps-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-auto px-0 text-muted-foreground cursor-pointer"
            onClick={handleReplyClick}>
            {isReplying ? t("cancelReply") : t("reply")}
          </Button>
        </div>
      ) : null}

      {isReplying ? (
        <div className="mt-3 space-y-3 ps-1">
          <Textarea
            value={replyText}
            onChange={event => setReplyText(event.target.value)}
            placeholder={t("replyPlaceholder")}
            rows={3}
            className="resize-none"
          />
          <Button
            type="button"
            size="sm"
            disabled={isSubmitting || !replyText.trim()}
            onClick={handleReply}>
            {isSubmitting ? tCommon("pleaseWait") : t("submitReply")}
          </Button>
        </div>
      ) : null}

      {review.replies.length > 0 ? (
        <div className="mt-4 space-y-4">
          {review.replies.map(reply => (
            <ReviewItem
              key={reply.id}
              review={reply}
              productId={productId}
              isReply
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
