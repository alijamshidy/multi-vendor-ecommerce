"use client";
import { useQueryParams } from "@/hooks/use-query-params";
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
  const { setQueryParam } = useQueryParams();
  const handleItems = useDebouncedCallback(value => {
    setQueryParam("page", value);
  }, 500);
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
                href="#"
                onClick={event => {
                  event.preventDefault();
                  handleItems(number);
                }}
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
