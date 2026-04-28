<<<<<<< HEAD
"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
=======
"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
<<<<<<< HEAD
      className="relative w-full overflow-x-auto"
    >
=======
      className="relative w-full overflow-x-auto">
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
<<<<<<< HEAD
  )
=======
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
<<<<<<< HEAD
  )
=======
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
<<<<<<< HEAD
  )
=======
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
<<<<<<< HEAD
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
=======
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
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

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
<<<<<<< HEAD
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
=======
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
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

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
<<<<<<< HEAD
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
=======
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
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

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
<<<<<<< HEAD
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
=======
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 *:[[role=checkbox]]:translate-y-[2px]",
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

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
<<<<<<< HEAD
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
=======
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  );
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
}

export {
  Table,
<<<<<<< HEAD
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
=======
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
>>>>>>> 872b5acfd427e94fbe17bcfabec14c1342fd95b7
