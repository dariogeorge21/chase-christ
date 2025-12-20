import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JAAGO — Rise & React | Chase Christ",
  description: "A faith-inspired reaction game for church events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
