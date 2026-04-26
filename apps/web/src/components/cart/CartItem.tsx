'use client';
 
import { useCart } from '@/hooks/useCart';
import { Address } from 'viem';
import { CartItem as CartItemType } from '@/types';
 
export function CartItem({ item, onRemove, onUpdateQuantity }: { 
  item: CartItemType; 
  onRemove?: (productId: bigint) => void; 
  onUpdateQuantity?: (productId: bigint, quantity: number) => void; 
}) {
  const { formatPrice } = useCart();
 
  const productData = item.product;
 
  if (!productData) return null;
 
  const itemTotal = productData.price * BigInt(item.quantity);
  const isInStock = productData.stock > 0;
  const maxQuantity = Number(productData.stock);
 
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      onUpdateQuantity?.(item.productId, newQuantity);
    }
  };
 
  const formatAddress = (address: Address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
 
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-200 rounded-lg shrink-0 flex items-center justify-center">
          <span className="text-2xl text-gray-400">📦</span>
        </div>
 
        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                {productData.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Seller: {formatAddress(productData.seller)}
              </p>
            </div>
            <button
              onClick={() => onRemove?.(item.productId)}
              className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
 
          {/* Price and Stock Status */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(productData.price)} CELO
              </span>
              <span className="text-xs text-gray-500 ml-2">
                each
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-blue-600">
                {formatPrice(itemTotal)} CELO
              </span>
              {!isInStock && (
                <span className="block text-xs text-red-600 mt-1">
                  Out of stock
                </span>
              )}
            </div>
          </div>
 
          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={item.quantity >= maxQuantity}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              {maxQuantity < 10 && (
                <span className="text-xs text-gray-500">
                  (Max: {maxQuantity})
                </span>
              )}
            </div>
 
            {/* Stock Warning */}
            {item.quantity > maxQuantity && (
              <span className="text-xs text-red-600 font-medium">
                Only {maxQuantity} available
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
