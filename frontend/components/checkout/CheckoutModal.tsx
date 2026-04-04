'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useConnection } from 'wagmi';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import { MapPin, Lock } from 'lucide-react';
import { useCreateOrder } from '@/hooks/useMarketplace';
// import { DotLottieReact } from '@lottiefiles/dotlottie-react';


// const SuccessAnimation = () => {
//   return (
//     <DotLottieReact
//       src="https://lottie.host/bf6de9b1-a2c0-475d-9419-cfd4cb0968bb/LMC6TjvNBu.lottie"
//       loop
//       autoplay
//     />
//   );
// };


export default function CheckoutModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, clearCart, formatPrice } = useCart();
  const { isConnected } = useConnection();
  const { createOrder, isLoading, isConfirming, isSuccess, isError } = useCreateOrder();
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ordersCreated, setOrdersCreated] = useState(false);

  const subtotal = cart.totalAmount;
  const shippingFee = cart.totalItems > 0 ? BigInt(0.001 * 1e18) : BigInt(0);
  const tax = subtotal * BigInt(5) / BigInt(100);
  const total = subtotal + shippingFee + tax;

  // Handle successful order completion
  useEffect(() => {
    if (ordersCreated && isSuccess && !isConfirming) {
      clearCart();
      onClose();
      // SuccessAnimation();
      alert('Order placed successfully!');
      setOrdersCreated(false);
      setIsProcessing(false);
    }
  }, [isSuccess, isConfirming, ordersCreated, clearCart, onClose]);

  // Handle transaction errors
  useEffect(() => {
    if (ordersCreated && isError) {
      alert('Transaction failed. Please try again.');
      setOrdersCreated(false);
      setIsProcessing(false);
    }
  }, [isError, ordersCreated]);

  const handleCreateOrder = async () => {
    if (!isConnected || !shippingAddress || cart.items.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Create orders for each cart item
      for (const item of cart.items) {
        await createOrder(
          item.productId,
          item.quantity,
          shippingAddress,
          item.product.price * BigInt(item.quantity)
        );
      }
      setOrdersCreated(true);
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
      
      setIsProcessing(false);
      setOrdersCreated(false);
    }
  };

  return (
    <>
    {/* Modal */}
    {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full min-h-[80vh] overflow-y-auto flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="space-y-3">
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
                      <div className="border-t pt-3 flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-blue-600">
                          {formatPrice(total)} CELO
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cart Items */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Items ({cart.totalItems})</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cart.items.map((item) => (
                        <div key={item.productId.toString()} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                              <span className="text-lg">📦</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                Product #{item.productId.toString()}
                              </div>
                              <div className="text-sm text-gray-600">
                                Qty: {item.quantity} × {formatPrice(item.product.price)} CELO
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900">
                              {formatPrice(item.product.price * BigInt(item.quantity))} CELO
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Shipping & Payment */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
                  
                  {!isConnected ? (
                    <div className="text-center py-8">
                      <ConnectWallet />
                      <p className="text-sm text-gray-600 mt-3">
                        Connect your wallet to proceed
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shipping Address
                        </label>
                        <textarea
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          rows={3}
                          placeholder="Enter your complete shipping address..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-red-600">
                            <MapPin className="w-5 h-5"/>
                          </span>
                          <span className="text-sm font-medium text-red-900">
                            Map Location (Comming Soon)
                          </span>
                        </div>
                        <p className="text-sm text-red-800">
                          Click the map to select your delivery location.
                        </p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-blue-600">
                            <Lock className="w-5 h-5"/>
                          </span>
                          <span className="text-sm font-medium text-blue-900">
                            Secure Blockchain Payment
                          </span>
                        </div>
                        <p className="text-sm text-blue-800">
                          Your payment will be processed via smart contract with full escrow protection.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end items-center gap-5 p-6 border-t bg-gray-50 mt-auto">
              <button
                onClick={onClose}
                className="bg-gray-200 text-blue-600 px-8 py-3 rounded-lg hover:text-blue-700 font-medium"
              >
                Cancel
              </button>
              
              <button
                onClick={handleCreateOrder}
                disabled={isProcessing || isLoading || isConfirming || !isConnected || !shippingAddress}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
              >
                {isProcessing || isLoading || isConfirming ? 'Processing...' : `Pay ${formatPrice(total)} CELO`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
