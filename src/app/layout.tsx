import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Marsha Learn Denmark",
  description: "Learn Danish with Marsha — from A1 to B2, Copenhagen to Viking Age",
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Marsha Learn Denmark',
  },
  themeColor: '#C60C30',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da">
      <body className={`${geistSans.variable} antialiased`}>
        <main className="pb-24 min-h-screen">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
