"use client";

import { createReviewAction } from "@/utils/actions";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import SubmitButton from "../form/Buttons";
import FormContainer from "../form/FormContainer";
import TextAreaInput from "../form/TextAreaInput";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import RatingInput from "./RatingInput";

export default function SubmitReview({ productId }: { productId: string }) {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);
  const { user } = useUser();
  return (
    <div>
      <Button
        size={"lg"}
        className="capitalize"
        onClick={() => setIsReviewFormVisible(prev => !prev)}>
        leave review
      </Button>
      {isReviewFormVisible && (
        <Card className="p-8 mt-8">
          <FormContainer action={createReviewAction}>
            <input
              type="hidden"
              name="productId"
              value={productId}
            />
            <input
              type="hidden"
              name="authorName"
              value={user?.firstName || "user"}
            />
            <input
              type="hidden"
              name="authorImageUrl"
              value={user?.imageUrl}
            />
            <RatingInput
              name="rating"
              labelText=""
            />
            <TextAreaInput
              name="comment"
              labelText="feedback"
              defaultValue="OutStanding product !!!"
            />
            <SubmitButton className="mt-4" />
          </FormContainer>
        </Card>
      )}
    </div>
  );
}
