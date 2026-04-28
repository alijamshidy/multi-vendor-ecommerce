"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { Countries } from "@/utils/CountryAndLangs";
import { useState } from "react";
import { Separator } from "../ui/separator";

export default function LangsDropdown() {
  const [selectedLang, setSelectedLang] = useState("En");

  const selectedCountry = Countries.find(c => c.lang === selectedLang)!;
  const SelectedFlag = selectedCountry.icon;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="border-none cursor-pointer bg-transparent flex items-center gap-2 hover:bg-blue-300 data-[state=open]:bg-blue-300/50 focus:bg-blue-300 data-[state=open]:focus:bg-blue-300 data-[state=open]:hover:bg-blue-300 ">
            <SelectedFlag
              title={selectedCountry.lang}
              className="w-5 h-5"
            />
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            {Countries.map(item => {
              const Flag = item.icon;

              return (
                <NavigationMenuLink
                  key={item.lang}
                  onClick={() => setSelectedLang(item.lang)}
                  className="w-24 flex-row items-center justify-between cursor-pointer">
                  <Flag title={item.lang} />
                  <span>{item.lang}</span>
                </NavigationMenuLink>
              );
            })}
            <Separator className="my-2" />
            <NavigationMenuLink className="w-24 flex-row items-center justify-between cursor-pointer">
              <SelectedFlag />
              <span>{selectedLang}</span>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
