"use client";

import AuthFooterNote from "@/components/auth/AuthFooterNote";
import AuthShell from "@/components/auth/AuthShell";
import InputPasswordStrength from "@/components/form/PasswordInputWithStrength";
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
import { isRegistrationPasswordValid } from "@/utils/password";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { toast } from "sonner";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneRegex = /^(09[0-9]{9}|\+989[0-9]{9})$/;

export default function RegisterForm() {
  const paths = useAuthPaths();
  const router = useRouter();
  const register = useAuthStore(state => state.register);
  const verifyOtp = useAuthStore(state => state.verifyOtp);
  const isRegistering = useAuthStore(state => state.loading.register);
  const isVerifying = useAuthStore(state => state.loading.verifyOtp);

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const isEmail = emailRegex.test(identifier);
  const isPhone = phoneRegex.test(identifier);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const isValid = useMemo(
    () =>
      name.trim().length >= 2 &&
      (isEmail || isPhone) &&
      isRegistrationPasswordValid(password) &&
      passwordsMatch,
    [name, identifier, password, passwordsMatch, isEmail, isPhone],
  );

  const isOtpValid = otp.length === 6;

  const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid || isRegistering) return;

    try {
      await register({
        identifier,
        password,
        full_name: name.trim(),
      });
      toast.success("Account created. Enter the OTP we sent you.");
      setOtpSent(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isOtpValid || isVerifying) return;

    try {
      await verifyOtp({ identifier, code: otp });
      toast.success("Account verified successfully");
      router.push(paths.dashboard);
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
            <CardTitle className="text-xl">
              {otpSent ? "Verify your account" : "Create your account"}
            </CardTitle>
            <CardDescription>
              {otpSent
                ? "Enter the 6-digit code sent to your email or phone"
                : "Join the marketplace to shop and manage orders"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!otpSent ? (
              <form onSubmit={handleRegister}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={event => setName(event.target.value)}
                      autoComplete="name"
                      required
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="register-identifier">
                      Email or phone number
                    </FieldLabel>
                    <Input
                      id="register-identifier"
                      type="text"
                      placeholder="m@example.com or 09181234567"
                      value={identifier}
                      onChange={event => setIdentifier(event.target.value)}
                      autoComplete="username"
                      required
                    />
                  </Field>

                  <Field>
                    <InputPasswordStrength
                      value={password}
                      onChange={setPassword}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={event => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      required
                    />
                    {confirmPassword.length > 0 && !passwordsMatch ? (
                      <FieldDescription className="text-destructive">
                        Passwords do not match
                      </FieldDescription>
                    ) : null}
                  </Field>

                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!isValid || isRegistering}>
                      {isRegistering ? "Creating account..." : "Create account"}
                    </Button>
                    <FieldDescription className="text-center">
                      Already have an account?{" "}
                      <Link href={paths.login}>Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="register-otp">
                      Verification code
                    </FieldLabel>
                    <InputOTP
                      id="register-otp"
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
                      {isVerifying ? "Verifying..." : "Verify and continue"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setOtpSent(false);
                        setOtp("");
                      }}>
                      Back to registration
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
