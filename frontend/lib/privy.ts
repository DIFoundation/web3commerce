import { PrivyClientConfig } from '@privy-io/react-auth';
import { celoSepolia, avalanche } from 'wagmi/chains';

export const privyConfig: PrivyClientConfig = {
  // Login methods - enable Gmail and Twitter
  loginMethods: ['email', 'wallet', 'google', 'twitter'],
  
  // Appearance customization
  appearance: {
    theme: 'light' as const,
    accentColor: '#6366f1' as const,
    logo: '/logo.png',
  },
  
  // Embedded wallets configuration
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
    },
  },
  
  // Chain configuration - use wagmi chain
  defaultChain: celoSepolia,
  
  // Supported chains - use wagmi chains
  supportedChains: [celoSepolia, avalanche],
};