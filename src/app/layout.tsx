import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tanveer Mehra",
  description: "AI Product Engineer — portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/intro/desk.png" />
        <link rel="preload" as="image" href="/card/front.png" />
        <link rel="preload" as="image" href="/card/back.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
