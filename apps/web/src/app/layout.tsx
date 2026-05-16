import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from "@/providers/query-provider";

import { Navbar } from '@/components/navbar';
import { WalletProvider } from "@/components/wallet-provider"

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'web3commerce',
  description: 'Number #1 Blockchain Commerce Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          {/* Navbar is included on all pages */}
          <div className="relative flex min-h-screen flex-col">
            <WalletProvider>
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
            </WalletProvider>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
