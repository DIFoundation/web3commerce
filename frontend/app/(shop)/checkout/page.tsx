'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useConnection } from 'wagmi';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import { useMarketplace } from '@/hooks/useMarketplace';

export default function CheckoutPage() {
  const { cart, clearCart, formatPrice } = useCart();
  const { createOrder } = useMarketplace();
  const { address, isConnected } = useConnection();

  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('crypto');
  const [isProcessing, setIsProcessing] = useState(false);


  const subtotal = cart.totalAmount;
  const shippingFee = cart.totalItems > 0 ? BigInt(0.001 * 1e18) : BigInt(0);
  const tax = subtotal * BigInt(5) / BigInt(100);
  const total = subtotal + shippingFee + tax;

  const handleCheckout = async () => {
    if (!isConnected || !address) return;

    setIsProcessing(true);

    try {
      // Create orders for each cart item
      for (const item of cart.items) {
        await createOrder.createOrder(
          item.productId,
          item.quantity,
          shippingAddress
        );
      }

      // Clear cart after successful checkout
      clearCart();

      // Redirect to success page
      window.location.href = '/checkout/success';
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.totalItems === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🛒</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <a
            href="/marketplace"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <div className="text-sm text-gray-600">
              {cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                1
              </div>
              <span className={`ml-2 text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                Shipping
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                2
              </div>
              <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                Payment
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                3
              </div>
              <span className={`ml-2 text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                Review
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your complete shipping address..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Cryptocurrency</div>
                    <div className="text-sm text-gray-600">Pay with CELO via smart contract</div>
                  </div>
                  <span className="text-2xl">🪙</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="fiat"
                    checked={paymentMethod === 'fiat'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Credit Card</div>
                    <div className="text-sm text-gray-600">Coming soon</div>
                  </div>
                  <span className="text-2xl">💳</span>
                </label>
              </div>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                2
              </div>
              <span className={`ml-2 text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                Payment
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-200"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                3
              </div>
              <span className={`ml-2 text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-600'
                }`}>
                Review
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shipping Address
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your complete shipping address..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10001"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Payment Method
              </h2>

              <div className="space-y-4">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="crypto"
                    checked={paymentMethod === 'crypto'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Cryptocurrency</div>
                    <div className="text-sm text-gray-600">Pay with CELO via smart contract</div>
                  </div>
                  <span className="text-2xl">🪙</span>
                </label>

                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="fiat"
                    checked={paymentMethod === 'fiat'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">Credit Card</div>
                    <div className="text-sm text-gray-600">Coming soon</div>
                  </div>
                  <span className="text-2xl">💳</span>
                </label>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Order Items ({cart.totalItems})
              </h2>

              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.productId.toString()} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-xl text-gray-400">📦</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Product #{item.productId.toString()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatPrice(item.product.price)} CELO each
                      </div>
                      <div className="text-sm text-gray-600">
                        {formatPrice(item.product.price * BigInt(item.quantity))} CELO total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md sticky top-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  Order Summary
                </h2>

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

                {/* Wallet Connection */}
                {!isConnected ? (
                  <div className="text-center mb-6">
                    <ConnectWallet />
                    <p className="text-sm text-gray-600 mt-3">
                      Connect your wallet to complete checkout
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Wallet Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Paying with:</span>
                        <span className="text-sm font-medium">
                          {address?.slice(0, 6)}...{address?.slice(-4)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      disabled={isProcessing || !shippingAddress}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
                    >
                      {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)} CELO`}
                    </button>

                    {/* Security Info */}
                    <div className="mt-4 text-center text-sm text-gray-600">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-green-600">🔒</span>
                        <span>Secure blockchain transaction</span>
                      </div>
                      <p>
                        Your payment is protected by smart contract escrow
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}