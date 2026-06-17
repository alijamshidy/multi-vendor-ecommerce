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
import type { AuthRole } from "@/lib/auth-cookie";
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

type LoginRole = Extract<AuthRole, "customer" | "seller" | "admin">;

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
  const loginStaff = useAuthStore(state => state.loginStaff);
  const isCustomerLoading = useAuthStore(state => state.loading.login);
  const isStaffLoading = useAuthStore(state => state.loading.loginStaff);
  const errorMessage = useAuthStore(state => state.errorMessage);
  const [loginRole, setLoginRole] = useState<LoginRole>(() => {
    const role = searchParams.get("role");
    if (role === "seller" || role === "admin") return role;
    return "customer";
  });
  const [isVisible, setIsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [cooldownSecondsLeft, setCooldownSecondsLeft] = useState(0);

  const isLoading =
    loginRole === "customer" ? isCustomerLoading : isStaffLoading;
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
    if (loginRole === "customer") {
      return (isEmail || isPhone) && isPasswordValid;
    }
    return isEmail && isPasswordValid;
  }, [identifier, password, loginRole]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading || isRateLimited) return;

    try {
      if (loginRole === "customer") {
        await login({ identifier, password });
      } else {
        await loginStaff({ role: loginRole, identifier, password });
      }

      toast.success(t("signedInSuccess"));
      const callbackUrl = searchParams.get("callbackUrl");
      const defaultDestination = paths.dashboardForRole(
        loginRole === "customer" ? "customer" : loginRole,
      );
      const destination = isSafeCallbackUrl(callbackUrl)
        ? callbackUrl
        : defaultDestination;
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
                <Field>
                  <div className="grid grid-cols-3 gap-2">
                    {(["customer", "seller", "admin"] as const).map(role => (
                      <Button
                        key={role}
                        type="button"
                        variant={loginRole === role ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setLoginRole(role)}>
                        {t(
                          `loginAs${role.charAt(0).toUpperCase()}${role.slice(1)}`,
                        )}
                      </Button>
                    ))}
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="identifier">
                    {loginRole === "customer" ? t("emailOrPhone") : t("email")}
                  </FieldLabel>
                  <Input
                    id="identifier"
                    value={identifier}
                    onChange={event => setIdentifier(event.target.value)}
                    type="text"
                    inputMode="email"
                    autoComplete="username"
                    placeholder={
                      loginRole === "customer"
                        ? t("emailOrPhonePlaceholder")
                        : t("emailPlaceholder")
                    }
                    required
                  />
                </Field>

                <Field>
                  <div className="flex items-center gap-2">
                    <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                    {loginRole === "customer" ? (
                      <Link
                        href={paths.resetPassword}
                        className="ms-auto text-sm underline-offset-4 hover:underline">
                        {t("forgotPassword")}
                      </Link>
                    ) : null}
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
                    disabled={isLoading || isRateLimited}>
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
                    <Link
                      href={
                        loginRole === "seller"
                          ? paths.sellerRegister
                          : paths.register
                      }>
                      {loginRole === "seller"
                        ? t("registerAsSeller")
                        : t("createOne")}
                    </Link>
                  </FieldDescription>
                  {onSwitchToOtp && loginRole === "customer" ? (
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
