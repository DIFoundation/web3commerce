import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/shared/Navbar";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Web3Commerce",
  description: "Decentralized multi-vendor marketplace with escrow",
  other: {
    "talentapp:project_verification": "055d3c212e609c00f599b7c4dc17cb67f2dddc3125909bc953611c182a35bef3e1527f07672acb8c8fadc4cc03f9fcafb83b9fc21ca1052300cc2bbc08ac06b6"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased mx-14 bg-gray-100 dark:bg-gray-900`}>
        <ThemeProvider>
          <Providers>
            <Navbar />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
