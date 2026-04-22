"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBar({
  className,
  placeholder = "Search...",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // نمایش دکمه X: وقتی متن هست و (موس روی input هست یا input فوکوس شده)
  const showClearButton = search && (isHovering || isFocused);

  // آپدیت URL با debounce
  const updateURL = useCallback(
    (query: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      updateURL(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, updateURL]);

  // پاک کردن
  const handleClear = () => {
    setSearch("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <form
      className={`relative w-full max-w-md ${className || ""}`}
      onSubmit={e => {
        e.preventDefault();
        updateURL(search);
      }}>
      {/* آیکون جستجو - سمت چپ */}
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />

      <Input
        type="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        placeholder={placeholder}
        className={`pl-10 pr-10 transition-all duration-200 ${
          isFocused ? "ring-2 ring-primary border-primary" : ""
        }`}
      />

      {/* دکمه X - فقط با hover یا focus نشون داده میشه */}
      {showClearButton && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-muted"
          aria-label="پاک کردن جستجو">
          <X className="w-4 h-4" />
        </Button>
      )}
    </form>
  );
}
