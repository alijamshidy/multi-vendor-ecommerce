"use client";

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
import Link from "next/link";
import { FormEvent, useState } from "react";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset password</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="space-y-4 text-center">
                <p className="text-sm leading-7 text-muted-foreground">
                  If an account exists for <strong>{email}</strong>, you will
                  receive password reset instructions shortly.
                </p>
                <Button
                  asChild
                  variant="outline"
                  className="w-full">
                  <Link href="login">Back to login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="reset-email">Email</FieldLabel>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="m@example.com"
                      value={email}
                      onChange={event => setEmail(event.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <Button
                      type="submit"
                      className="w-full">
                      Send reset link
                    </Button>
                    <FieldDescription className="text-center">
                      Remember your password?{" "}
                      <Link href="login">Sign in</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthShell>
  );
}
