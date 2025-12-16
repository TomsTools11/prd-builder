import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRD Builder - AI-Powered Product Requirements Generator",
  description: "Generate comprehensive Product Requirements Documents using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
