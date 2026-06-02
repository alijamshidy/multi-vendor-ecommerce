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
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function ResetPasswordForm() {
  const paths = useAuthPaths();
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const phoneRegex = /^(09[0-9]{9}|\+989[0-9]{9})$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const isIdentifierValid = useMemo(
    () => emailRegex.test(identifier) || phoneRegex.test(identifier),
    [identifier],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(identifier);
    if (!isIdentifierValid) return;
    setSubmitted(true);
    // TODO: connect to reset password API
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card className="rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset password</CardTitle>
            <CardDescription>
              Enter your email or phone number and we&apos;ll send you a reset
              link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4 text-center">
                <p className="text-sm leading-7 text-muted-foreground">
                  If an account exists for{" "}
                  <strong dir="ltr">{identifier}</strong>, you will receive
                  password reset instructions shortly.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full">
                  <Link href={paths.login}>Back to sign in</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
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
                      disabled={!isIdentifierValid}>
                      Send reset link
                    </Button>
                    <FieldDescription className="text-center">
                      Remember your password?{" "}
                      <Link href={paths.login}>Sign in</Link>
                    </FieldDescription>
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
