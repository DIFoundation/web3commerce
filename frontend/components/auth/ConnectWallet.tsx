'use client';

import { useDisconnect } from 'wagmi';
import { useAuth } from '@/hooks/useAuth';

interface ConnectWalletProps {
  className?: string;
}

export function ConnectWallet({ className = '' }: ConnectWalletProps) {
  const { 
    isLoading, 
    isAuthenticated, 
    user, 
    address, 
    login, 
    logout,

    loginMethod 
  } = useAuth();
  const { mutate } = useDisconnect();

  // Show loading state while Privy initializes
  if (isLoading) {
    return (
      <button
        disabled
        className={`px-4 py-2 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed ${className}`}
      >
        Loading...
      </button>
    );
  }

  // User is authenticated and connected
  if (isAuthenticated && address) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium">
            {user?.email?.address || formatAddress(address)}
          </span>
          <span className="text-xs text-gray-500">
            {loginMethod && `(${loginMethod})`} • {formatAddress(address)}
          </span>
        </div>
        <button
          onClick={() => {
            mutate();
            logout();
          }}
          className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Not authenticated - show connect button with social login options
  if(!isAuthenticated) {
  return (
    <button
      onClick={login}
      className={`px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors ${className}`}
    >
      Connect Wallet
    </button>
  );
}
}

// Helper function to format address
function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
// Attempted to log in, but user is already logged in. Use a `link` helper instead.