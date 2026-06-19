import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watcher Factory",
  description: "Voice-First Agentic Software Factory",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground flex">
        {children}
      </body>
    </html>
  );
}
