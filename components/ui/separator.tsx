<<<<<<< HEAD
"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"
=======
"use client";

import * as SeparatorPrimitive from "@radix-ui/react-separator";
import * as React from "react";

import { cn } from "@/lib/utils";
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7

function Separator({
  className,
  orientation = "horizontal",
<<<<<<< HEAD
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
=======
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
        className
      )}
      {...props}
    />
<<<<<<< HEAD
  )
}

export { Separator }
=======
  );
}

export { Separator };
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
