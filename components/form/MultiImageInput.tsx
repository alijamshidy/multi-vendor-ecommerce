"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImagePlusIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

type MultiImageInputProps = {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  required?: boolean;
  helperText?: string;
  className?: string;
};

function validateImageFile(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `"${file.name}" is not a supported image type.`;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `"${file.name}" exceeds the 10 MB size limit.`;
  }
  return null;
}

export default function MultiImageInput({
  label,
  files,
  onChange,
  maxFiles = 10,
  required = false,
  helperText,
  className,
}: MultiImageInputProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacingIndexRef = useRef<number | null>(null);
  const [error, setError] = useState("");
  const previewUrls = useMemo(
    () => files.map(file => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const addFiles = (incoming: FileList | null) => {
    if (!incoming?.length) return;

    const next = [...files];
    const errors: string[] = [];

    for (const file of Array.from(incoming)) {
      if (next.length >= maxFiles) {
        errors.push(`You can select up to ${maxFiles} image${maxFiles === 1 ? "" : "s"}.`);
        break;
      }

      const validationError = validateImageFile(file);
      if (validationError) {
        errors.push(validationError);
        continue;
      }

      const isDuplicate = next.some(
        existing =>
          existing.name === file.name &&
          existing.size === file.size &&
          existing.lastModified === file.lastModified,
      );
      if (!isDuplicate) {
        next.push(file);
      }
    }

    setError(errors[0] ?? "");
    onChange(next);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
    setError("");
  };

  const openReplacePicker = (index: number) => {
    replacingIndexRef.current = index;
    replaceInputRef.current?.click();
  };

  const replaceFile = (incoming: FileList | null) => {
    const index = replacingIndexRef.current;
    if (index === null || !incoming?.length) return;

    const file = incoming[0];
    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      replacingIndexRef.current = null;
      if (replaceInputRef.current) {
        replaceInputRef.current.value = "";
      }
      return;
    }

    const next = [...files];
    next[index] = file;
    onChange(next);
    setError("");
    replacingIndexRef.current = null;
    if (replaceInputRef.current) {
      replaceInputRef.current.value = "";
    }
  };

  const atLimit = files.length >= maxFiles;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label htmlFor={inputId}>{label}</Label>
        {maxFiles > 1 ? (
          <span className="text-xs text-muted-foreground">
            {files.length}/{maxFiles} selected
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "rounded-md border border-dashed p-4 transition-colors",
          atLimit ? "opacity-60" : "hover:border-primary/50",
        )}>
        <Input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple={maxFiles > 1}
          required={required && files.length === 0}
          disabled={atLimit}
          className="sr-only"
          onChange={event => addFiles(event.target.files)}
        />
        <Input
          ref={replaceInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={event => replaceFile(event.target.files)}
        />

        <label
          htmlFor={inputId}
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 text-center",
            atLimit && "pointer-events-none",
          )}>
          <span className="flex size-10 items-center justify-center rounded-full bg-muted">
            <ImagePlusIcon className="size-5 text-muted-foreground" />
          </span>
          <span className="text-sm font-medium">
            {atLimit ? "Maximum images selected" : "Click to upload images"}
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WebP, or GIF — up to 10 MB each
          </span>
        </label>
      </div>

      {helperText ? (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      ) : null}

      {error ? (
        <p
          className="text-sm text-destructive"
          role="alert">
          {error}
        </p>
      ) : null}

      {previewUrls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previewUrls.map((url, index) => (
            <li
              key={`${files[index]?.name}-${files[index]?.lastModified}-${index}`}
              className="group relative aspect-square overflow-hidden rounded-md border bg-muted">
              <button
                type="button"
                className="relative size-full cursor-pointer"
                onClick={() => openReplacePicker(index)}
                aria-label={`Change ${files[index]?.name ?? `image ${index + 1}`}`}>
                <Image
                  src={url}
                  alt={files[index]?.name ?? `Selected image ${index + 1}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/45 group-hover:opacity-100 group-focus-within:bg-black/45 group-focus-within:opacity-100">
                  <span className="rounded bg-background/90 px-2 py-1 text-xs font-medium">
                    Change image
                  </span>
                </span>
              </button>
              {index === 0 && maxFiles > 1 ? (
                <span className="pointer-events-none absolute start-2 top-2 rounded bg-background/90 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                  Primary
                </span>
              ) : null}
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute end-2 top-2 z-10 size-7 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                onClick={event => {
                  event.stopPropagation();
                  removeFile(index);
                }}
                aria-label={`Remove ${files[index]?.name ?? "image"}`}>
                <XIcon className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
