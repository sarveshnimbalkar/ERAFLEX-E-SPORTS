import type { Metadata } from "next";
import { Inter, Bebas_Neue, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bebas-neue",
});

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
  display: "swap",
});

import { FirebaseAuthProvider } from "@/components/shared/FirebaseAuthProvider";
import { FloatingChat } from "@/components/shared/FloatingChat";
import { ToastProvider } from "@/components/shared/ToastProvider";
import { SmoothScroll } from "@/components/shared/SmoothScroll";

export const metadata: Metadata = {
  title: {
    template: "%s | ERAFLEX",
    default: "ERAFLEX | Premium Sports & Performance Gear",
  },
  description: "Shop elite sports apparel, bespoke football jerseys, and performance athletic gear. Custom 3D design and premium sports merchandise.",
  keywords: ["sports gear", "football jerseys", "athletic wear", "premium sports apparel", "ERAFLEX"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${bebasNeue.variable} ${rajdhani.variable} font-sans bg-brand-dark text-white`}
      >
        <FirebaseAuthProvider>
          <ToastProvider />
          <SmoothScroll>
            <div className="contents">
              <FloatingChat />
            </div>
            {children}
          </SmoothScroll>
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
