'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useAccount } from 'wagmi';
import { CartItem } from './CartItem';
import { ConnectButton } from "@/components/connect-button"

export function CartSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity, clearCart, formatPrice } = useCart();
  const { isConnected } = useAccount();
  
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    setShowCheckout(true);
    onClose();
    window.location.href = '/checkout';
  };

  const subtotal = cart.totalAmount;
  const shippingFee = cart.totalItems > 0 ? BigInt(0.001 * 1e18) : BigInt(0); // 0.001 CELO shipping fee
  const total = subtotal + shippingFee;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({cart.totalItems})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.totalItems === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🛒</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 mb-6">
                  Add some products to get started!
                </p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem
                    key={item.productId.toString()}
                    item={item}
                    onRemove={removeFromCart}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.totalItems > 0 && (
            <div className="border-t bg-gray-50 p-4">
              {/* Order Summary */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)} CELO</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingFee > 0 ? formatPrice(shippingFee) : 'Free'}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(total)} CELO
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isConnected ? (
                  <div className="text-center">
                    <ConnectButton />
                    <p className="text-xs text-gray-600 mt-2">
                      Connect wallet to checkout
                    </p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Proceed to Checkout
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to clear your cart?')) {
                          clearCart();
                        }
                      }}
                      className="w-full text-red-600 py-2 hover:text-red-700 transition-colors text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </>
                )}

                <button
                  onClick={onClose}
                  className="w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
