import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers/Web3Provider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ContractsProvider } from "@/providers/ContractsProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Indahouse Admin",
  description: "Administrative Operations Control Center",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <Suspense fallback={null}>
          <AuthProvider>
            <ContractsProvider>
              <Providers>{children}</Providers>
            </ContractsProvider>
          </AuthProvider>
        </Suspense>
      </body>
    </html>
  );
}
