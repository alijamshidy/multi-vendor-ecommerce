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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthPaths } from "@/hooks/use-auth-paths";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(09[0-9]{9}|\+989[0-9]{9})$/;

export default function ResetPasswordForm() {
  const t = useTranslations("auth");
  const paths = useAuthPaths();
  const router = useRouter();
  const resetPasswordRequest = useAuthStore(state => state.resetPasswordRequest);
  const resetPasswordConfirm = useAuthStore(state => state.resetPasswordConfirm);
  const isRequesting = useAuthStore(state => state.loading.resetPasswordRequest);
  const isConfirming = useAuthStore(state => state.loading.resetPasswordConfirm);

  const [identifier, setIdentifier] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const isIdentifierValid = useMemo(
    () => emailRegex.test(identifier) || phoneRegex.test(identifier),
    [identifier],
  );
  const isCodeValid = code.length === 6;
  const isPasswordValid = newPassword.length >= 8;

  const handleRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isIdentifierValid || isRequesting) return;

    try {
      await resetPasswordRequest({ identifier });
      toast.success(t("resetCodeSent"));
      setCodeSent(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("resetCodeFailed"),
      );
    }
  };

  const handleConfirm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isCodeValid || !isPasswordValid || isConfirming) return;

    try {
      await resetPasswordConfirm({
        identifier,
        code,
        new_password: newPassword,
      });
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
              {codeSent
                ? t("resetCodeDescription")
                : t("resetRequestDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!codeSent ? (
              <form onSubmit={handleRequest}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-email">
                      {t("emailOrPhone")}
                    </FieldLabel>
                    <Input
                      id="reset-email"
                      value={identifier}
                      onChange={event => setIdentifier(event.target.value)}
                      type="text"
                      inputMode="email"
                      placeholder={t("emailOrPhonePlaceholder")}
                      required
                    />
                  </Field>
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!isIdentifierValid || isRequesting}>
                      {isRequesting ? t("sending") : t("sendResetCode")}
                    </Button>
                    <FieldDescription className="text-center">
                      {t("rememberPassword")}{" "}
                      <Link href={paths.login}>{t("signIn")}</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleConfirm}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-code">{t("verificationCode")}</FieldLabel>
                    <InputOTP
                      id="reset-code"
                      maxLength={6}
                      value={code}
                      onChange={setCode}
                      containerClassName="justify-center">
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="new-password">{t("newPassword")}</FieldLabel>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={event => setNewPassword(event.target.value)}
                      autoComplete="new-password"
                      required
                    />
                  </Field>
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!isCodeValid || !isPasswordValid || isConfirming}>
                      {isConfirming ? t("resetting") : t("resetPasswordButton")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setCodeSent(false);
                        setCode("");
                        setNewPassword("");
                      }}>
                      {t("useDifferentContact")}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
        <AuthFooterNote />
      </div>
    </AuthShell>
  );
}
