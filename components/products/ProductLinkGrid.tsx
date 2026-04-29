"use client";
import { GetLocale } from "@/utils/GetUrlParams";
import Link from "next/link";
import { FaEye } from "react-icons/fa";
import { Button } from "../ui/button";

export default function ProductLinkGrid({ id }: { id: string }) {
  const locale = GetLocale();
  return (
    <Button
      variant="default"
      size="icon">
      <Link href={`/${locale}/products/${id}`}>
        <FaEye />
      </Link>
    </Button>
  );
}
