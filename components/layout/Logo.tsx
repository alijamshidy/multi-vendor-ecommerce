"use client";
import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div className="w-[50px] h-[50px]">
      <Link
        href={"./"}
        className="w-full h-full relative">
        <Image
          src={"/images/hero1.jpg"}
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
