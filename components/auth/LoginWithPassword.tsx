"use client";

import AuthFooterNote from "@/components/auth/AuthFooterNote";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthPaths } from "@/hooks/use-auth-paths";
import {
  AuthRequestError,
  parseThrottleCooldownSeconds,
} from "@/lib/api-utils";
import { isSafeCallbackUrl, redirectAfterAuth } from "@/lib/auth-cookie";
import useAuthStore from "@/store/authStore";
import { isLoginPasswordValid } from "@/utils/password";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(09[0-9]{9}|\+989[0-9]{9})$/;
const MIN_LOGIN_COOLDOWN_SECONDS = 60;

function formatCooldown(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.ceil(seconds / 3600);
    return `${hours}h`;
  }
  if (seconds >= 60) {
    const minutes = Math.ceil(seconds / 60);
    return `${minutes}m`;
  }
  return `${seconds}s`;
}

export default function LoginWithPassword({
  onSwitchToOtp,
}: {
  onSwitchToOtp?: () => void;
}) {
  const t = useTranslations("auth");
  const paths = useAuthPaths();
  const searchParams = useSearchParams();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.loading.login);
  const errorMessage = useAuthStore(state => state.errorMessage);
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);

  const isRateLimited = cooldownSecondsLeft > 0;

  useEffect(() => {
    if (!cooldownUntil) return;

    const tick = () => {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCooldownUntil(null);
        setCooldownSecondsLeft(0);
        return;
      }
      setCooldownSecondsLeft(remaining);
    };

    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [cooldownUntil]);

  const isValid = useMemo(() => {
    const isEmail = emailRegex.test(identifier);
    const isPhone = phoneRegex.test(identifier);
    const isPasswordValid = isLoginPasswordValid(password);
    return (isEmail || isPhone) && isPasswordValid;
  }, [identifier, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isLoading || isRateLimited) return;

    try {
      await login({ identifier, password });
      toast.success(t("signedInSuccess"));
      const callbackUrl = searchParams.get("callbackUrl");
      const destination = isSafeCallbackUrl(callbackUrl)
        ? callbackUrl
        : paths.dashboard;
      redirectAfterAuth(destination);
    } catch (error) {
      const message = error instanceof Error ? error.message : t("loginFailed");

      if (error instanceof AuthRequestError && error.status === 429) {
        const parsedSeconds = parseThrottleCooldownSeconds(message);
        const cooldownSeconds = Math.max(
          parsedSeconds ?? MIN_LOGIN_COOLDOWN_SECONDS,
          MIN_LOGIN_COOLDOWN_SECONDS,
        );
        setCooldownUntil(Date.now() + cooldownSeconds * 1000);
        setCooldownSecondsLeft(cooldownSeconds);
      }

      toast.error(message);
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card className="rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("welcomeBack")}</CardTitle>
            <CardDescription>{t("signInDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                {/* <Field>
                  <SocialLoginButtons />
                </Field>

                <FieldSeparator>{t("orContinueWith")}</FieldSeparator> */}

                <Field>
                  <FieldLabel htmlFor="identifier">
                    {t("emailOrPhone")}
                  </FieldLabel>
                  <Input
                    id="identifier"
                    value={identifier}
                    onChange={event => setIdentifier(event.target.value)}
                    type="text"
                    inputMode="email"
                    autoComplete="username"
                    placeholder={t("emailOrPhonePlaceholder")}
                    required
                  />
                </Field>

                <Field>
                  <div className="flex items-center gap-2">
                    <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                    <Link
                      href={paths.resetPassword}
                      className="ms-auto text-sm underline-offset-4 hover:underline">
                      {t("forgotPassword")}
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      required
                      type={isVisible ? "text" : "password"}
                      placeholder={t("password")}
                      value={password}
                      onChange={event => setPassword(event.target.value)}
                      autoComplete="current-password"
                      className="pe-9"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsVisible(current => !current)}
                      className="absolute inset-y-0 end-0 text-muted-foreground hover:bg-transparent">
                      {isVisible ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                      <span className="sr-only">
                        {isVisible ? t("hidePassword") : t("showPassword")}
                      </span>
                    </Button>
                  </div>
                </Field>

                <Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!isValid || isLoading || isRateLimited}>
                    {isLoading
                      ? t("signingIn")
                      : isRateLimited
                        ? t("tryAgainIn", {
                            time: formatCooldown(cooldownSecondsLeft),
                          })
                        : t("signIn")}
                  </Button>
                  {errorMessage ? (
                    <p
                      className="text-center text-sm text-destructive"
                      role="alert">
                      {errorMessage}
                    </p>
                  ) : null}
                  <FieldDescription className="text-center">
                    {t("noAccount")}{" "}
                    <Link href={paths.register}>{t("createOne")}</Link>
                  </FieldDescription>
                  {onSwitchToOtp ? (
                    <Button
                      type="button"
                      variant="link"
                      className="w-full"
                      onClick={onSwitchToOtp}>
                      {t("signInWithOtp")}
                    </Button>
                  ) : null}
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
        <AuthFooterNote />
      </div>
    </AuthShell>
  );
}
