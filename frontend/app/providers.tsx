'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { celoSepolia } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected, walletConnect } from 'wagmi/connectors';
import { CartProvider } from '@/hooks/useCart';
import { privyConfig } from '@/lib/privy';

// Create Wagmi config for Celo Sepolia
const config = createConfig({
  chains: [celoSepolia],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
      metadata: {
        name: 'Web3Commerce',
        description: 'Decentralized multi-vendor marketplace',
        url: typeof window !== 'undefined' ? window.location.origin : '',
        icons: [],
      },
    }),
  ],
  transports: {
    [celoSepolia.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
  },
});

// React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
    },
  },
});

// Privy app ID from environment
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={privyConfig}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <CartProvider>
            {children}
          </CartProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </PrivyProvider>
  );
}
