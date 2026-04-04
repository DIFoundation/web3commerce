'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { useConnection } from 'wagmi';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import { useCart } from '@/hooks/useCart';

export function Navbar() {
  const pathname = usePathname();
  const { authenticated } = usePrivy();
  const { isConnected } = useConnection();
  const { cart } = useCart();

  const itemInCart = cart.totalItems;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full px-6 py-4">
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
                Cart {itemInCart}
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
      className={`text-sm font-medium transition-colors ${
        isActive ? 'text-blue-400' : 'text-gray-300 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );
}
