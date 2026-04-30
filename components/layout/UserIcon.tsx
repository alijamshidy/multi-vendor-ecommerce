"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LuUser } from "react-icons/lu";

export default function UserIcon() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // دریافت تصویر کاربر از API یا سرور
    const fetchUser = async () => {
      // const res = await fetch('/api/user-image');
      // const data = await res.json();
      const mockImageUrl = ""; // یا آدرس واقعی
      setImageUrl(mockImageUrl);
    };
    fetchUser();
  }, []);

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
