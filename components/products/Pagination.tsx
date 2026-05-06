"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

export default function PaginationComponent() {
  const { replace } = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();
  const handleItems = useDebouncedCallback(value => {
    const params = new URLSearchParams(searchParams);

    params.set("page", value);
    replace(`${path}/?${params.toString()}`);
  }, 500);
  const [parPage, setParPage] = useState(1);
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        {[1, 2, 3, 4].map(number => {
          return (
            <PaginationItem key={number}>
              <PaginationLink
                href=""
                isActive>
                {number}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
