'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useConnection } from 'wagmi';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import { CartItem } from '@/components/cart/CartItem';
import Link from 'next/link';
import CheckoutModal from '@/components/checkout/CheckoutModal';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, formatPrice } = useCart();
  const { isConnected } = useConnection();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const subtotal = cart.totalAmount;
  const shippingFee = cart.totalItems > 0 ? BigInt(0.001 * 1e18) : BigInt(0); // 0.001 CELO shipping
  const tax = subtotal * BigInt(5) / BigInt(100); // 5% tax
  const total = subtotal + shippingFee + tax;

  const displayCheckoutModal = () => {
    setShowCheckoutModal(true);
  };

  const handleClearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      clearCart();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            <div className="text-sm text-gray-600">
              {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {cart.totalItems === 0 ? (
                <div className="text-center py-16">
                  <span className="text-8xl mb-6 block">🛒</span>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Your cart is empty
                  </h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Looks like you haven&apos;t added anything to your cart yet. 
                    Start shopping to fill it up!
                  </p>
                  <Link
                    href="/marketplace"
                    className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Cart Items ({cart.totalItems})
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear All
                    </button>
                  </div>

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
                </div>
              )}
            </div>

            {/* Recommendations */}
            {cart.totalItems > 0 && (
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  You might also like
                </h3>
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    Product recommendations coming soon...
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md sticky top-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

                {cart.totalItems === 0 ? (
                  <div className="text-center py-8">
                    <span className="text-4xl mb-4 block">📦</span>
                    <p className="text-gray-600">
                      Add items to your cart to see summary
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-6">
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
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax (5%)</span>
                        <span className="font-medium">{formatPrice(tax)} CELO</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="font-semibold text-gray-900">Total</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(total)} CELO
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Promo Code */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Promo Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                          Apply
                        </button>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    {!isConnected ? (
                      <div className="text-center">
                        <ConnectWallet />
                        <p className="text-sm text-gray-600 mt-3">
                          Connect your wallet to proceed with checkout
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={displayCheckoutModal}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Proceed to Checkout
                      </button>
                    )}

                    {/* Security Badge */}
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-600">
                      <span className="text-green-600">🔒</span>
                      <span>Secure checkout powered by blockchain</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CheckoutModal 
        isOpen={showCheckoutModal} 
        onClose={() => setShowCheckoutModal(false)} 
      />
    </div>
  );
}