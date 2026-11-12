import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { AuthGuard } from "./AuthGuard";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Alegra Café — Atendimentos",
  description: "Gestão de atendimentos da Alegra Café",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-[#FBF1E9]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}
