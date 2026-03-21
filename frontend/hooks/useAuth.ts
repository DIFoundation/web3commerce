'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useConnection, useDisconnect } from 'wagmi';

interface LinkedAccount {
  type: string;
  address?: string;
  name?: string | null;
}

interface User {
  email?: {
    address: string;
  };
  phone?: {
    number: string;
  };
  linkedAccounts?: LinkedAccount[];
  createdAt: string;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  address: string | null;
  loginMethod: string | null;
}

export function useAuth() {
  const { login, logout, authenticated, user, ready } = usePrivy();
  const { address, isConnected } = useConnection();
  const { mutate: disconnect } = useDisconnect();

  const authState: AuthState = {
    isLoading: !ready,
    isAuthenticated: authenticated && isConnected,
    user: user as User | null,
    address: address || null,
    loginMethod: user?.linkedAccounts?.[0]?.type || null,
  };

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      disconnect();
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const getUserInfo = () => {
    if (!user) return null;

    return {
      email: user.email?.address,
      phone: user.phone?.number,
      socialAccounts: user.linkedAccounts?.filter((account: LinkedAccount) => 
        account.type === 'google' || account.type === 'twitter'
      ),
      walletAddress: address,
      createdAt: user.createdAt,
    };
  };

  return {
    ...authState,
    login: handleLogin,
    logout: handleLogout,
    getUserInfo,
    ready,
  };
}