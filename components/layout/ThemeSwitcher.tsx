"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export type ThemeSwitcherProps = {
  open?: boolean;
  value?: "light" | "dark" | "system";
  onChange?: (theme: "light" | "dark" | "system") => void;
  defaultValue?: "light" | "dark" | "system";
  className?: string;
};

export const ThemeSwitcher = ({
  open,
  value,
  onChange,
  defaultValue = "system",
  className,
}: ThemeSwitcherProps) => {
  const t = useTranslations("theme");
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const themes = [
    {
      key: "system",
      icon: Monitor,
      label: t("system"),
    },
    {
      key: "light",
      icon: Sun,
      label: t("light"),
    },
    {
      key: "dark",
      icon: Moon,
      label: t("dark"),
    },
  ];

  const handleThemeClick = useCallback(
    (themeKey: "light" | "dark" | "system") => {
      setTheme(themeKey);
      onChange?.(themeKey);
    },
    [setTheme, onChange],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = value || theme || defaultValue;

  if (open) {
    return (
      <div>
        <Suspense>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {resolvedTheme === "light" ? (
                  <Sun className="w-4 h-4" />
                ) : resolvedTheme === "dark" ? (
                  <Moon className="w-4 h-4" />
                ) : (
                  <Monitor className="w-4 h-4" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto"
              align="center"
              sideOffset={10}>
              <div
                className={cn(
                  "relative isolate flex h-9 rounded-full bg-background p-1 w-full justify-center items-center",
                  className,
                )}>
                {themes.map(({ key, icon: Icon, label }) => {
                  const isActive = currentTheme === key;

                  return (
                    <button
                      aria-label={label}
                      className="relative h-7 w-7 rounded-full"
                      key={key}
                      onClick={() =>
                        handleThemeClick(key as "light" | "dark" | "system")
                      }
                      type="button">
                      {isActive && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-secondary"
                          layoutId="activeTheme"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                      <Icon
                        className={cn(
                          "relative z-10 m-auto h-4 w-4",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      />
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </Suspense>
      </div>
    );
  } else {
    return (
      <div
        className={cn(
          "relative isolate flex h-8 rounded-full bg-background p-1",
          className,
        )}>
        {themes.map(({ key, icon: Icon, label }) => {
          const isActive = currentTheme === key;

          return (
            <button
              aria-label={label}
              className="relative h-6 w-6 rounded-full"
              key={key}
              onClick={() =>
                handleThemeClick(key as "light" | "dark" | "system")
              }
              type="button">
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-secondary"
                  layoutId="activeTheme"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-10 m-auto h-4 w-4",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }
};
