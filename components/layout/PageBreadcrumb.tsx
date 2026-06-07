"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export type BreadcrumbItemData = {
  label: string;
  href?: string;
};

type PageBreadcrumbProps = {
  items: BreadcrumbItemData[];
  className?: string;
};

export default function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  if (items.length <= 1) return null;

  return (
    <Breadcrumb className={cn("mb-2", className)}>
      <BreadcrumbList>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span
              key={`${item.label}-${index}`}
              className="contents">
              {index > 0 ? <BreadcrumbSeparator /> : null}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="capitalize">
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    asChild
                    className="capitalize">
                    <Link href={item.href}>{item.label}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
