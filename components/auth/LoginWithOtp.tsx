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
import { isSafeCallbackUrl, redirectAfterAuth } from "@/lib/auth-cookie";
import useAuthStore from "@/store/authStore";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

const phoneRegex = /^(09[0-9]{9}|\+989[0-9]{9})$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type LoginWithOtpProps = {
  onSwitchToPassword?: () => void;
};

export default function LoginWithOtp({
  onSwitchToPassword,
}: LoginWithOtpProps) {
  const t = useTranslations("auth");
  const paths = useAuthPaths();
  const searchParams = useSearchParams();
  const requestOtp = useAuthStore(state => state.requestOtp);
  const verifyOtp = useAuthStore(state => state.verifyOtp);
  const isRequestingOtp = useAuthStore(state => state.loading.requestOtp);
  const isVerifying = useAuthStore(state => state.loading.verifyOtp);

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const isIdentifierValid = useMemo(
    () => emailRegex.test(identifier) || phoneRegex.test(identifier),
    [identifier],
  );

  const isOtpValid = otp.length === 6;

  const handleSendCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isIdentifierValid || isRequestingOtp) return;

    try {
      await requestOtp({ identifier });
      toast.success(t("otpSentSuccess"));
      setCodeSent(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("otpSendFailed"),
      );
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOtpValid || isVerifying) return;

    try {
      await verifyOtp({ identifier, code: otp });
      toast.success(t("signedInSuccess"));
      const callbackUrl = searchParams.get("callbackUrl");
      const destination = isSafeCallbackUrl(callbackUrl)
        ? callbackUrl
        : paths.dashboard;
      redirectAfterAuth(destination);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("otpVerifyFailed"),
      );
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card className="rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("signInWithOtpTitle")}</CardTitle>
            <CardDescription>
              {codeSent
                ? t("otpSentDescription")
                : t("otpSendDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!codeSent ? (
              <form onSubmit={handleSendCode}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="otp-identifier">
                      {t("emailOrPhone")}
                    </FieldLabel>
                    <Input
                      id="otp-identifier"
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
                      disabled={!isIdentifierValid || isRequestingOtp}>
                      {isRequestingOtp ? t("sending") : t("sendCode")}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleVerify}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="otp">{t("verificationCode")}</FieldLabel>
                    <InputOTP
                      id="otp"
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
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
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!isOtpValid || isVerifying}>
                      {isVerifying ? t("verifying") : t("verifyAndSignIn")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setCodeSent(false);
                        setOtp("");
                      }}>
                      {t("useDifferentContact")}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}

            <FieldDescription className="mt-4 py-4 pb-2 text-center">
              {onSwitchToPassword ? (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0"
                  onClick={onSwitchToPassword}>
                  {t("signInWithPassword")}
                </Button>
              ) : null}
            </FieldDescription>

            <FieldDescription className="text-center">
              {t("noAccount")}{" "}
              <Link href={paths.register}>{t("createOne")}</Link>
            </FieldDescription>
          </CardContent>
        </Card>
        <AuthFooterNote />
      </div>
    </AuthShell>
  );
}
