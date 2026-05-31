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
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const phoneRegex = /^(09[0-9]{9}|\+989[0-9]{9})$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

type LoginWithOtpProps = {
  onSwitchToPassword?: () => void;
};

export default function LoginWithOtp({
  onSwitchToPassword,
}: LoginWithOtpProps) {
  const paths = useAuthPaths();
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const isIdentifierValid = useMemo(
    () => emailRegex.test(identifier) || phoneRegex.test(identifier),
    [identifier],
  );

  const isOtpValid = otp.length === 6;

  const handleSendCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isIdentifierValid) return;
    setCodeSent(true);
    // TODO: request OTP from API
  };

  const handleVerify = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOtpValid) return;
    // TODO: verify OTP with API
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card className="rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Sign in with OTP</CardTitle>
            <CardDescription>
              {codeSent
                ? "Enter the 6-digit code we sent you"
                : "We will send a one-time code to your email or phone"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!codeSent ? (
              <form onSubmit={handleSendCode}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="otp-identifier">
                      Email or phone number
                    </FieldLabel>
                    <Input
                      id="otp-identifier"
                      value={identifier}
                      onChange={event => setIdentifier(event.target.value)}
                      type="text"
                      inputMode="email"
                      placeholder="m@example.com or 09181234567"
                      required
                    />
                  </Field>
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!isIdentifierValid}>
                      Send code
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleVerify}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="otp">Verification code</FieldLabel>
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
                      disabled={!isOtpValid}>
                      Verify and sign in
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setCodeSent(false);
                        setOtp("");
                      }}>
                      Use a different contact
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
            )}

            <FieldDescription className="mt-4 text-center">
              {onSwitchToPassword ? (
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0"
                  onClick={onSwitchToPassword}>
                  Sign in with password instead
                </Button>
              ) : null}
            </FieldDescription>

            <FieldDescription className="text-center">
              Don&apos;t have an account?{" "}
              <Link href={paths.register}>Create one</Link>
            </FieldDescription>
          </CardContent>
        </Card>
        <AuthFooterNote />
      </div>
    </AuthShell>
  );
}
