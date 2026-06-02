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
import { useRouter, useSearchParams } from "next/navigation";
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
  const paths = useAuthPaths();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestOtp = useAuthStore(state => state.requestOtp);
  const verifyOtp = useAuthStore(state => state.verifyOtp);
  const loader = useAuthStore(state => state.loader);

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
    if (!isIdentifierValid || loader) return;

    try {
      await requestOtp({ identifier });
      toast.success("OTP sent successfully");
      setCodeSent(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send OTP",
      );
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOtpValid || loader) return;

    try {
      await verifyOtp({ identifier, code: otp });
      toast.success("Signed in successfully");
      const callbackUrl = searchParams.get("callbackUrl") || paths.dashboard;
      router.push(callbackUrl);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "OTP verification failed",
      );
    }
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
                      disabled={!isIdentifierValid || loader}>
                      {loader ? "Sending..." : "Send code"}
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
                      disabled={!isOtpValid || loader}>
                      {loader ? "Verifying..." : "Verify and sign in"}
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

            <FieldDescription className="mt-4 py-4 pb-2 text-center">
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
