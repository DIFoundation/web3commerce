'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useConnection } from 'wagmi';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import { useCart } from '@/hooks/useCart';
import { useTheme } from '@/contexts/ThemeContext';

export function Navbar() {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const { isConnected } = useConnection();
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const itemInCart = cart.totalItems;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
      scrolled ? 'bg-gray-100/65 dark:bg-gray-800/65 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-[1500] mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold hover:text-blue-400 transition-colors">
          Web3Commerce
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {authenticated && isConnected && (
            <>
            <NavLink href="/marketplace" isActive={isActive('/marketplace')}>
              Marketplace
            </NavLink>
              <NavLink href="/orders" isActive={isActive('/orders')}>
                My Orders
              </NavLink>
              <NavLink href="/cart" isActive={isActive('/cart')}>
                Cart
                <span className="ml-1 align-super text-sm font-normal bg-gray-800 rounded-full px-1 py-0.5 text-white">{itemInCart}</span>
              </NavLink>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <ConnectWallet />
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

// Helper Component

function NavLink({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`text-base font-sans transition-colors ${
        isActive
          ? 'text-gray-800 font-semibold underline underline-offset-8 decoration-2 dark:text-gray-300'
          : 'text-gray-700 hover:text-gray-800 hover:underline hover:underline-offset-8 hover:decoration-2 dark:text-gray-400 dark:hover:text-gray-300'
      }`}
    >
      {children}
    </Link>
  );
}
