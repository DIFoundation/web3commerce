'use client';

import { useCart } from '@/hooks/useCart';
import { useConnection } from 'wagmi';
import { useRouter } from 'next/navigation';
import { ConnectWallet } from '@/components/auth/ConnectWallet';

export function CartIcon() {
  const { cart, isInCart } = useCart();
  const { isConnected, status } = useConnection();
  const router = useRouter();

  return (
    <div className="relative">
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
        onClick={(e) => {
          e.preventDefault();
          router.push('/cart');
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        
        {/* Cart Badge */}
        {cart.totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {cart.totalItems > 99 ? '99+' : cart.totalItems}
          </span>
        )}
      </button>
    </div>
  );
}
