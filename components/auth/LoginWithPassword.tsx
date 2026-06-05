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
  FieldSeparator,
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
import Link from "next/link";
import { useTranslations } from "next-intl";
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

  const isRateLimited = cooldownUntil !== null && Date.now() < cooldownUntil;

  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownSecondsLeft(0);
      return;
    }

    const tick = () => {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setCooldownUntil(null);
        setCooldownSecondsLeft(0);
        return;
      }
      setCooldownSecondsLeft(remaining);
    };

    tick();
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
      const message =
        error instanceof Error ? error.message : t("loginFailed");

      if (error instanceof AuthRequestError && error.status === 429) {
        const parsedSeconds = parseThrottleCooldownSeconds(message);
        const cooldownSeconds = Math.max(
          parsedSeconds ?? MIN_LOGIN_COOLDOWN_SECONDS,
          MIN_LOGIN_COOLDOWN_SECONDS,
        );
        setCooldownUntil(Date.now() + cooldownSeconds * 1000);
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
            <CardDescription>
              {t("signInDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4">
                      <path
                        d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                        fill="currentColor"
                      />
                    </svg>
                    {t("apple")}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-4">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    {t("google")}
                  </Button>
                </Field>

                <FieldSeparator>{t("orContinueWith")}</FieldSeparator>

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
                    <p className="text-center text-sm text-destructive" role="alert">
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
