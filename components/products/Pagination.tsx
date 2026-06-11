"use client";

import { useQueryParams } from "@/hooks/use-query-params";
import {
  getCurrentPage,
  getItemsPerPage,
  getPaginationRange,
  getTotalPages,
  PAGE_PARAM,
} from "@/lib/product-query";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type ProductsPaginationProps = {
  totalCount: number;
  className?: string;
};

export default function ProductsPagination({
  totalCount,
  className,
}: ProductsPaginationProps) {
  const { searchParams, setQueryParam } = useQueryParams();
  const currentPage = getCurrentPage(searchParams);
  const itemsPerPage = getItemsPerPage(searchParams);
  const totalPages = getTotalPages(totalCount, itemsPerPage);

  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPaginationRange(currentPage, totalPages);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;

    setQueryParam(PAGE_PARAM, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination className={cn("mt-8", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            aria-disabled={currentPage <= 1}
            className={cn(
              currentPage <= 1 && "pointer-events-none opacity-50",
              "cursor-pointer",
            )}
            onClick={event => {
              event.preventDefault();
              goToPage(currentPage - 1);
            }}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) =>
          page === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                isActive={page === currentPage}
                onClick={event => {
                  event.preventDefault();
                  goToPage(page);
                }}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            aria-disabled={currentPage >= totalPages}
            className={cn(
              currentPage >= totalPages && "pointer-events-none opacity-50",
              "cursor-pointer",
            )}
            onClick={event => {
              event.preventDefault();
              goToPage(currentPage + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
