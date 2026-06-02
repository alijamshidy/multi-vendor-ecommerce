"use client";

import { Suspense, useState } from "react";
import LoginWithOtp from "./LoginWithOtp";
import LoginWithPassword from "./LoginWithPassword";

function LoginFormContent() {
  const [useOtp, setUseOtp] = useState(false);

  if (useOtp) {
    return (
      <LoginWithOtp onSwitchToPassword={() => setUseOtp(false)} />
    );
  }

  return <LoginWithPassword onSwitchToOtp={() => setUseOtp(true)} />;
}

export default function LoginForm() {
  return (
    <Suspense fallback={null}>
      <LoginFormContent />
    </Suspense>
  );
}
