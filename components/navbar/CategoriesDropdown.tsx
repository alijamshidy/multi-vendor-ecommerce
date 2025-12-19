import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { category } from "@/utils/category";
import { ChevronDownIcon } from "lucide-react";
import Image from "next/image";
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
          className="flex gap-4 [&_svg:not([class*='size-'])]:size-6 bg-[#059473] hover:bg-[#059473] focus-visible:border-ring focus-visible:ring-[#059473]/50 h-full">
          <CiCircleList className="w-6 h-6" />
          <span>All Category</span>
          <ChevronDownIcon className="relative top-px ml-1 size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="rounded-none bg-[#059473] min-w-(--radix-dropdown-menu-trigger-width)"
        align="center"
        sideOffset={10}>
        {category.map(category => {
          return (
            <DropdownMenuItem
              key={category._id}
              className="w-full h-full px-0 py-0 focus:bg-transparent">
              <Link
                href={`/category/${category.name}`}
                className="capitalize w-full h-full px-2 py-2 flex items-center gap-x-4">
                <span className="w-8 h-8">
                  <Image
                    width={"2"}
                    height={"5"}
                    src={category.image}
                    alt={category.name}
                    priority
                    className="rounded-full w-full h-full"
                  />
                </span>
                {category.name}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
