"use client";

import Image from "next/image";
import { LuUser } from "react-icons/lu";

export default function UserIconClient({
  imageUrl,
}: {
  imageUrl: string | null;
}) {
  if (imageUrl) {
    return (
      <Image
        src={imageUrl}
        alt="User profile image"
        width={24}
        height={24}
        priority
        className="rounded-full object-cover"
      />
    );
  }

  return <LuUser className="w-6 h-6 bg-primary rounded-full text-white" />;
}
