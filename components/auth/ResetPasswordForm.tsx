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
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(09[0-9]{9}|\+989[0-9]{9})$/;

export default function ResetPasswordForm() {
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
      toast.success("Reset code sent");
      setCodeSent(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset code",
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
      toast.success("Password reset successfully");
      router.push(paths.login);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password",
      );
    }
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card className="rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset password</CardTitle>
            <CardDescription>
              {codeSent
                ? "Enter the code and your new password"
                : "Enter your email or phone number to receive a reset code"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!codeSent ? (
              <form onSubmit={handleRequest}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-email">
                      Email or phone number
                    </FieldLabel>
                    <Input
                      id="reset-email"
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
                      disabled={!isIdentifierValid || isRequesting}>
                      {isRequesting ? "Sending..." : "Send reset code"}
                    </Button>
                    <FieldDescription className="text-center">
                      Remember your password?{" "}
                      <Link href={paths.login}>Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleConfirm}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-code">Verification code</FieldLabel>
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
                    <FieldLabel htmlFor="new-password">New password</FieldLabel>
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
                      {isConfirming ? "Resetting..." : "Reset password"}
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
                      Use a different contact
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
