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
import { useAuthPaths } from "@/hooks/use-auth-paths";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterForm() {
  const paths = useAuthPaths();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const passwordsMatch =
    password.length > 0 && password === confirmPassword;
  const isValid = useMemo(
    () =>
      name.trim().length >= 2 &&
      emailRegex.test(email) &&
      password.length >= 8 &&
      passwordsMatch,
    [name, email, password, passwordsMatch],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isValid) return;
    // TODO: connect to register API
  };

  return (
    <AuthShell>
      <div className="flex flex-col gap-6">
        <Card className="rounded-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Create your account</CardTitle>
            <CardDescription>
              Join the marketplace to shop and manage orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
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
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    autoComplete="email"
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
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={event => setConfirmPassword(event.target.value)}
                      autoComplete="new-password"
                      className="pe-9"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfirm(current => !current)}
                      className="absolute inset-y-0 end-0 text-muted-foreground hover:bg-transparent">
                      {showConfirm ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                      <span className="sr-only">Toggle confirm password</span>
                    </Button>
                  </div>
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
                    disabled={!isValid}>
                    Create account
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <Link href={paths.login}>Sign in</Link>
                  </FieldDescription>
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
