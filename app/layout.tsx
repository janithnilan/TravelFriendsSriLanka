import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Travel Friends Sri Lanka | Find your way here",
    template: "%s | Travel Friends Sri Lanka",
  },
  description:
    "A more thoughtful way to discover Sri Lanka, plan your days, and make the journey your own.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
