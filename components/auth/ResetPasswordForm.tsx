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
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthPaths } from "@/hooks/use-auth-paths";
import useAuthStore from "@/store/authStore";
import { isLoginPasswordValid } from "@/utils/password";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordForm() {
  const t = useTranslations("auth");
  const paths = useAuthPaths();
  const router = useRouter();
  const resetPasswordRequest = useAuthStore(
    state => state.resetPasswordRequest,
  );
  const resetPasswordConfirm = useAuthStore(
    state => state.resetPasswordConfirm,
  );
  const isRequesting = useAuthStore(state => state.loading.resetPasswordRequest);
  const isConfirming = useAuthStore(state => state.loading.resetPasswordConfirm);

  const [step, setStep] = useState<"request" | "confirm">("request");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await resetPasswordRequest({ identifier });
      toast.success(t("resetCodeSent"));
      setStep("confirm");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("resetCodeFailed"),
      );
    }
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoginPasswordValid(password)) {
      toast.error(t("passwordRequirements.minLength"));
      return;
    }

    try {
      await resetPasswordConfirm({ identifier, code, password });
      toast.success(t("passwordResetSuccess"));
      router.push(paths.login);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("passwordResetFailed"),
      );
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card className="rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("resetPassword")}</CardTitle>
            <CardDescription>
              {step === "request"
                ? t("resetRequestDescription")
                : t("resetCodeDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "request" ? (
              <form onSubmit={handleRequest}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-email">{t("email")}</FieldLabel>
                    <Input
                      id="reset-email"
                      type="email"
                      value={identifier}
                      onChange={event => setIdentifier(event.target.value)}
                      required
                      autoComplete="email"
                    />
                  </Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isRequesting || !identifier.trim()}
                  >
                    {isRequesting ? t("sending") : t("sendResetCode")}
                  </Button>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleConfirm}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-code">{t("verificationCode")}</FieldLabel>
                    <Input
                      id="reset-code"
                      inputMode="numeric"
                      value={code}
                      onChange={event => setCode(event.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="reset-password">
                      {t("newPassword")}
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="reset-password"
                        type={isVisible ? "text" : "password"}
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                        required
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 inset-e-0 flex items-center px-3"
                        onClick={() => setIsVisible(current => !current)}
                        aria-label={isVisible ? "Hide password" : "Show password"}
                      >
                        {isVisible ? (
                          <EyeOffIcon className="size-4" />
                        ) : (
                          <EyeIcon className="size-4" />
                        )}
                      </button>
                    </div>
                  </Field>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      isConfirming ||
                      !code.trim() ||
                      !password ||
                      !isLoginPasswordValid(password)
                    }
                  >
                    {isConfirming ? t("resetting") : t("resetPasswordButton")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep("request")}
                  >
                    {t("sendResetCode")}
                  </Button>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="text-center text-sm">
          {t("rememberPassword")}{" "}
          <Link href={paths.login} className="underline">
            {t("signIn")}
          </Link>
        </p>

        <AuthFooterNote />
      </div>
    </AuthShell>
  );
}
