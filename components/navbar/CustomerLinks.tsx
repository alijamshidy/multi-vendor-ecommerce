"use client";
import { links } from "@/utils/links";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "../global/Container";

export default function CustomerLinks() {
  const path = usePathname();
  console.log(path);
  return (
    <Container className="flex gap-x-6">
      {links.map(link => {
        const { href, label } = link;
        return (
          <Link
            className={`font-semibold ${
              path === href ? "text-[#059473]" : "text-slate-600"
            }`}
            href={href}
            key={label}>
            {label.toUpperCase()}
          </Link>
        );
      })}
    </Container>
  );
}
