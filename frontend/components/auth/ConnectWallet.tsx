'use client';

import { useState } from 'react';
import { useDisconnect } from 'wagmi';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

interface ConnectWalletProps {
  className?: string;
}

export function ConnectWallet({ className = '' }: ConnectWalletProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { 
    isLoading, 
    isAuthenticated, 
    user, 
    address, 
    login, 
    logout,
    getUserInfo,
    loginMethod 
  } = useAuth();
  const { mutate } = useDisconnect();

  const userInfo = getUserInfo();

  const handleLogIn = () => {

    console.log('isAuthenticated', isAuthenticated);
    console.log('user', user);
    console.log('get user info', getUserInfo());

    if (!isAuthenticated && user != null) {
      logout();
    } else {
      login();
    }
  }

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
      <div className={`relative ${className}`}>
        <div 
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.email?.address?.charAt(0).toUpperCase() || address.slice(2, 3).toUpperCase()}
            </span>
          </div>
          
          {/* User Info */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              {user?.email?.address || 'Anonymous User'}
            </span>
            <span className="text-xs text-gray-500">
              {formatAddress(address)}
            </span>
          </div>

          {/* Dropdown Arrow */}
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
            <div className="flex flex-col items-start gap-2 px-4 py-2 text-sm">
              <div>
                <p>{userInfo?.email || 'No email linked'}</p>
              </div>
              <p>
                {formatAddress(address)} 
                <span> {userInfo?.type}</span>
              </p>
            </div>

            <div className="border-t border-gray-200 mb-2"></div>
            
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsDropdownOpen(false)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            
            <button
              onClick={() => {
                navigator.clipboard.writeText(address);
                setIsDropdownOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Address
            </button>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <button
              onClick={() => {
                mutate();
                logout();
                setIsDropdownOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Disconnect
            </button>
          </div>
        )}

        {/* Click outside to close dropdown */}
        {isDropdownOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
        )}
      </div>
    );
  }

  // Not authenticated - show connect button
  if (!isAuthenticated) {
    return (
      <button
        onClick={handleLogIn}
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