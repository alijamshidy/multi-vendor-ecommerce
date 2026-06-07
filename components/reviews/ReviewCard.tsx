import Image from "next/image";
import UserIconClient from "../navbar/UserIconClient";
import { Card, CardContent, CardHeader } from "../ui/card";
import Comment from "./Comment";
import Rating from "./Rating";

type ReviewCardProps = {
  reviewInfo: {
    comment: string;
    rating: number;
    name: string;
    image: string | null;
  };
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
};

export default function ReviewCard({
  reviewInfo,
  headerActions,
  children,
}: ReviewCardProps) {
  return (
    <Card className="relative py-4">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center">
            {reviewInfo.image ? (
              <Image
                src={reviewInfo.image}
                alt={reviewInfo.name}
                className="h-12 w-12 rounded-full object-cover"
                width={48}
                height={48}
              />
            ) : (
              <UserIconClient imageUrl={null} />
            )}
            <div className="ms-4">
              <h3 className="mb-1 text-sm font-bold capitalize">
                {reviewInfo.name}
              </h3>
              <Rating rating={reviewInfo.rating} />
            </div>
          </div>
          {headerActions}
        </div>
      </CardHeader>
      <CardContent>
        {children ?? <Comment comment={reviewInfo.comment} />}
      </CardContent>
    </Card>
  );
}
