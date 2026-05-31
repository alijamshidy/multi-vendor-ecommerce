import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Next Storefront",
  description: "A nifty store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      dir="ltr">
      <body
        suppressHydrationWarning
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        className={`antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
