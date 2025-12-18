import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categorys } from "@/utils/links";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { CiCircleList } from "react-icons/ci";
import { Button } from "../ui/button";

export default async function CategoriesDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="border-none rounded-none col-span-1 cursor-pointer w-full"
        asChild>
        <Button
          variant="default"
          className="flex gap-4 [&_svg:not([class*='size-'])]:size-6 bg-[#059473] hover:bg-[#059473] focus-visible:border-ring focus-visible:ring-[#059473]/50">
          <CiCircleList className="w-6 h-6" />
          <span>All Category</span>
          <ChevronDownIcon
            className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="rounded-none"
        align="center"
        sideOffset={0}>
        {categorys.map(category => {
          if (category.label === "dashboard") {
            return null;
          }
          return (
            <div
              key={category.href}
              className="py-1">
              <DropdownMenuItem>
                <Link
                  href={`/category/${category.href}`}
                  className="capitalize w-full">
                  {category.label}
                </Link>
              </DropdownMenuItem>
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
