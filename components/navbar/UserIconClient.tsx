"use client";

import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/userStore";
import Image from "next/image";
import { useEffect } from "react";
import { LuUser } from "react-icons/lu";

export default function UserIconClient({
  imageUrl: initialImageUrl,
}: {
  imageUrl: string | null;
}) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const profileImage = useUserStore(state => state.profile?.image);
  const fetchProfile = useUserStore(state => state.fetchProfile);

  useEffect(() => {
    if (!isAuthenticated) return;
    void fetchProfile();
  }, [fetchProfile, isAuthenticated]);

  const imageUrl = profileImage ?? initialImageUrl;

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

  return <LuUser className="h-6 w-6 rounded-full bg-primary text-white" />;
}
