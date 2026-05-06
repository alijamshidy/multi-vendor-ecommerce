import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // بررسی در دیتابیس خودتان
        const user = await getUserFromDb(
          credentials.email,
          credentials.password,
        );
        if (user) {
          return { id: user.id, email: user.email, role: user.role };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/en/login", // توجه به locale پیش‌فرض
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

async function getUserFromDb(email: string, password: string) {
  // اینجا لاگین واقعی خود را پیاده کنید
  if (email === "admin@example.com" && password === "admin123") {
    return { id: "1", email, role: "admin" };
  }
  if (email === "customer@example.com" && password === "customer123") {
    return { id: "2", email, role: "customer" };
  }
  return null;
}
