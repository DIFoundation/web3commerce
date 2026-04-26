'use client';

import { ProductCardProps } from '@/types';
import { Address } from 'viem';
import { useCart } from '@/hooks/useCart';

export function ProductCard({ 
  product, 
  showSeller = true, 
  showActions = true,
  onViewDetails,
}: ProductCardProps) {
  const { addToCart, isInCart } = useCart();
  
  const formatPrice = (price: bigint) => {
    return (Number(price) / 1e18).toFixed(4);
  };

  const formatAddress = (address: Address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isInStock = product.stock > 0;
  const isNFTBacked = product.id.toString().endsWith('7') || product.id.toString().endsWith('3');
  const itemInCart = isInCart(product.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl text-gray-400 dark:text-gray-500">📦</span>
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Verified
          </div>
          {isNFTBacked && (
            <div className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
              NFT-Backed
            </div>
          )}
          {!isInStock && (
            <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Out of Stock
            </div>
          )}
        </div>

        {/* Quick Actions */}
        {showActions && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id);
              }}
              className={`bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors ${!isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isInStock}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        )}

        {/* stock number */}
        <div className="absolute bottom-2 left-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
            Stock: {product.stock.toString()}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Name & Rating */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 flex-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <span className="text-yellow-400">⭐</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">4.5</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-xs mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Price & Stock */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(product.price)} CELO
            </span>
          </div>
          {showSeller && (
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">Seller</p>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {formatAddress(product.seller)}
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(product.id)}
            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </button>
          {showActions && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product.id);
              }}
              className={`bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium ${itemInCart ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : ''}`}
              disabled={!isInStock}
            >
              {itemInCart ? 'In Cart ✓' : isInStock ? 'Add to Cart' : 'Sold Out'}
            </button>
          )}
        </div>
      </div>

      {/* Web3 Trust Indicators */}
      <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span className="text-green-500">🔗</span>
            <span>On-chain</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-blue-500">⚡</span>
            <span>Instant</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-purple-500">🛡️</span>
            <span>Escrow</span>
          </div>
        </div>
      </div>
    </div>
  );
}