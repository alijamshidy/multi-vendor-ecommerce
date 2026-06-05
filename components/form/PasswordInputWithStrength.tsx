"use client";

import { useId, useMemo, useState } from "react";

import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";

import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { PASSWORD_REQUIREMENTS } from "@/utils/password";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const requirements = PASSWORD_REQUIREMENTS;

type InputPasswordStrengthProps = {
  value?: string;
  onChange?: (value: string) => void;
  id?: string;
};

export default function InputPasswordStrength({
  value: valueProp,
  onChange,
  id: idProp,
}: InputPasswordStrengthProps) {
  const t = useTranslations("auth");
  const [internalValue, setInternalValue] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const password = valueProp ?? internalValue;

  const setPassword = (next: string) => {
    if (valueProp === undefined) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const strength = requirements.map(req => ({
    met: req.regex.test(password),
    key: req.key,
  }));

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length;
  }, [strength]);

  const getColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-destructive";
    if (score <= 2) return "bg-orange-500";
    if (score <= 3) return "bg-amber-500";
    if (score === 4) return "bg-yellow-400";

    return "bg-green-500";
  };

  const getText = (score: number) => {
    if (score === 0) return t("passwordStrength.enter");
    if (score <= 2) return t("passwordStrength.weak");
    if (score <= 3) return t("passwordStrength.medium");
    if (score === 4) return t("passwordStrength.strong");

    return t("passwordStrength.veryStrong");
  };

  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{t("password")}</Label>
      <div className="relative">
        <Input
          required
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder={t("password")}
          value={password}
          onChange={event => setPassword(event.target.value)}
          autoComplete="new-password"
          className="pe-9"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(current => !current)}
          className="absolute inset-y-0 end-0 text-muted-foreground hover:bg-transparent">
          {isVisible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
          <span className="sr-only">
            {isVisible ? t("hidePassword") : t("showPassword")}
          </span>
        </Button>
      </div>

      <div className="flex h-1 w-full gap-1">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-full flex-1 rounded-full transition-all duration-500 ease-out",
              index < strengthScore ? getColor(strengthScore) : "bg-border",
            )}
          />
        ))}
      </div>

      <p className="text-sm font-medium text-foreground">
        {getText(strengthScore)}. {t("passwordStrength.mustContain")}
      </p>

      <ul className="space-y-1.5 px-2">
        {strength.map((req, index) => (
          <li
            key={index}
            className="flex items-center gap-2">
            {req.met ? (
              <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
            ) : (
              <XIcon className="size-4 text-muted-foreground" />
            )}
            <span
              className={cn(
                "text-xs",
                req.met
                  ? "text-green-600 dark:text-green-400"
                  : "text-muted-foreground",
              )}>
              {t(`passwordRequirements.${req.key}`)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
