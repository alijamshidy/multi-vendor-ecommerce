"use client";

import { ComputerIcon, MoonIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaRegSun } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger id="">
          <DropdownMenuLabel className="cursor-pointer">
            <div className="w-5 h-5" />
          </DropdownMenuLabel>
        </DropdownMenuTrigger>
      </DropdownMenu>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger id="">
          <DropdownMenuLabel className="cursor-pointer">
            {getIcon(theme)}
          </DropdownMenuLabel>
          <DropdownMenuContent className="border-none data-[state=closed]:fade-out-0">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              system
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </>
  );

  function getIcon(theme?: string) {
    if (theme === "light") {
      return <FaRegSun />;
    } else if (theme === "dark") {
      return <MoonIcon />;
    } else {
      return <ComputerIcon />;
    }
  }
}
