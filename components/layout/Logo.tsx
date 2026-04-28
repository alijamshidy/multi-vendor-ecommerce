"use client";
import { useUserInfoStore } from "@/store/home";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Logo() {
  const { userInfo, addName } = useUserInfoStore();
  useEffect(() => {
    addName("ali");
  }, []);

  return (
    <div className="w-[50px] h-[50px]">
      <Link
        href={"./"}
        className="w-full h-full relative">
        <Image
          src={"./images/hero1.jpg"}
          alt=""
          width={50}
          height={50}
          className="h-full rounded-full"
          loading={"eager"}
        />
      </Link>
    </div>
  );
}
