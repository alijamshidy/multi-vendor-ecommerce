<<<<<<< HEAD
import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { ChevronRightIcon, MoreHorizontalIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
=======
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
<<<<<<< HEAD
      className={cn(className)}
      {...props}
    />
  )
=======
      {...props}
    />
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
<<<<<<< HEAD
        "flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground",
=======
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm wrap-break-words sm:gap-2.5",
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
        className
      )}
      {...props}
    />
<<<<<<< HEAD
  )
=======
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
<<<<<<< HEAD
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn("transition-colors hover:text-foreground", className),
      },
      props
    ),
    render,
    state: {
      slot: "breadcrumb-link",
    },
  })
=======
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
<<<<<<< HEAD
      className={cn("font-normal text-foreground", className)}
      {...props}
    />
  )
=======
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
<<<<<<< HEAD
      {...props}
    >
      {children ?? <ChevronRightIcon className="cn-rtl-flip" />}
    </li>
  )
=======
      {...props}>
      {children ?? <ChevronRight />}
    </li>
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
<<<<<<< HEAD
      className={cn(
        "flex size-5 items-center justify-center [&>svg]:size-4",
        className
      )}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">More</span>
    </span>
  )
=======
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}>
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

export {
  Breadcrumb,
<<<<<<< HEAD
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
=======
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
