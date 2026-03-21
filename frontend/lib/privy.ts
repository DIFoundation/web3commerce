// import { PrivyConfig } from '@privy-io/react-auth';
import { celoSepolia, avalanche } from 'wagmi/chains';

export const privyConfig = {
  // Login methods - enable Gmail and Twitter
  loginMethods: ['email', 'wallet', 'google', 'twitter'],
  
  // Appearance customization
  appearance: {
    theme: 'light',
    accentColor: '#6366f1',
    logo: '/logo.png',
    walletChain: {
      [celoSepolia.id]: {
        label: 'Celo Sepolia',
        iconUrl: '/celo-logo.png',
      },
      [avalanche.id]: {
        label: 'Avalanche',
        iconUrl: '/avalanche-logo.png',
      },
    },
  },
  
  // Embedded wallets configuration
  embeddedWallets: {
    ethereum: {
      createOnLogin: 'users-without-wallets',
      noPromptOnSignature: false,
    },
  },
  
  // Chain configuration - use wagmi chain
  defaultChain: celoSepolia,
  
  // Supported chains - use wagmi chains
  supportedChains: [celoSepolia, avalanche],
  
  // OAuth configuration
  oauth: {
    google: {
      enabled: true,
    },
    twitter: {
      enabled: true,
    }
  },
  
  // Additional settings
  funding: {
    ethereum: {
      allowedFundingSources: ['onramp'],
    },
  },
  
  // Session settings
  session: {
    duration: 60 * 60 * 24 * 7, // 7 days
  },
};