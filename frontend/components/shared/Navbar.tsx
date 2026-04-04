'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useConnection } from 'wagmi';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import { useCart } from '@/hooks/useCart';

export function Navbar() {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const { isConnected } = useConnection();
  const { cart } = useCart();
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
      scrolled ? 'bg-gray-100/65 backdrop-blur-sm shadow-sm' : 'bg-transparent'
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
        <ConnectWallet />
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
          ? 'text-gray-800 font-semibold underline underline-offset-8 decoration-2'
          : 'text-gray-700 hover:text-gray-800 hover:underline hover:underline-offset-8 hover:decoration-2'
      }`}
    >
      {children}
    </Link>
  );
}
