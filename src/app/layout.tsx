import type { Metadata } from "next";
import { Inter, Bebas_Neue, Rajdhani } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas-neue",
});

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

import { FirebaseAuthProvider } from "@/components/shared/FirebaseAuthProvider";
import { ChatWidget } from "@/components/shared/ChatWidget";

export const metadata: Metadata = {
  title: "ERAFLEX | Elite Football Athletics",
  description: "Premium football jerseys and performance gear for the elite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${bebasNeue.variable} ${rajdhani.variable} font-sans bg-brand-dark text-white`}
      >
        <FirebaseAuthProvider>
          <div className="contents">
            <ChatWidget />
          </div>
          {children}
        </FirebaseAuthProvider>
      </body>
    </html>
  );
}
