"use client";
import { useState } from "react";
import LoginWithOtp from "./LoginWithOtp";
import LoginWithPassword from "./LoginWithPassword";

export default function LoginForm() {
  const [lWP, setLWP] = useState(false);
  if (lWP) {
    <LoginWithOtp />;
  }
  return <LoginWithPassword />;
}
