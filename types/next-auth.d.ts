import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    idToken?: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    idToken?: string;
    provider?: string;
  }
}
