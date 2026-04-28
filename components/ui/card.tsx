<<<<<<< HEAD
import * as React from "react"

import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
=======
import * as React from "react";

import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm",
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

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
<<<<<<< HEAD
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
=======
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
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

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
<<<<<<< HEAD
      className={cn(
        "cn-font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
=======
      className={cn("leading-none font-semibold", className)}
      {...props}
    />
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
<<<<<<< HEAD
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
=======
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
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

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
<<<<<<< HEAD
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
=======
      className={cn("px-6", className)}
      {...props}
    />
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
<<<<<<< HEAD
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
=======
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

export {
  Card,
<<<<<<< HEAD
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
=======
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
