"use client";
import { useState } from "react";
import LoginWithOtp from "./LoginWithOtp";
import LoginWithPassword from "./LoginWithPassword";

export default function LoginForm() {
  const [useOtp, setUseOtp] = useState(false);

  if (useOtp) {
    return <LoginWithOtp />;
  }

  return <LoginWithPassword onSwitchToOtp={() => setUseOtp(true)} />;
}
