'use client';

import React, { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  saveAmount: number;
  shipping: number;
  seller: string;
  sellerType: 'global' | 'aliexpress';
  quantity: number;
  image: string;
  onlyLeft?: number;
  newShopperSave?: number;
  selected: boolean;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Acasis USB 3.1 10Gbps Hub',
      description: '4 Ports USB C Hub Adapter with 100W Power Delivery',
      price: 72782.25,
      originalPrice: 125564.50,
      saveAmount: 52782.25,
      shipping: 4348.08,
      seller: 'Acasis Official Store',
      sellerType: 'global',
      quantity: 1,
      image: '📦',
      onlyLeft: 1,
      selected: true,
    },
    {
      id: '2',
      name: 'hiena Hair Clipper Kit',
      description: 'Professional Hair Trimmer for Men with LED Display',
      price: 32560.47,
      originalPrice: 65000.00,
      saveAmount: 32439.53,
      shipping: 4348.08,
      seller: 'HIENA PRO Official Store',
      sellerType: 'aliexpress',
      quantity: 1,
      image: '✂️',
      newShopperSave: 5000,
      selected: true,
    },
    {
      id: '3',
      name: '65W Max 60W 45W USB C Type C phone Laptop Charger',
      description: 'Fast Charging Adapter for Multiple Devices',
      price: 20000.00,
      originalPrice: 45000.00,
      saveAmount: 25000.00,
      shipping: 4348.08,
      seller: 'TechGear Official Store',
      sellerType: 'global',
      quantity: 1,
      image: '🔌',
      selected: false,
    },
  ]);

  const [selectAll, setSelectAll] = useState(true);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCartItems(items => items.map(item => ({ ...item, selected: newSelectAll })));
  };

  const handleSelectItem = (id: string) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleDeleteSelected = () => {
    setCartItems(items => items.filter(item => !item.selected));
    setSelectAll(false);
  };

  const selectedItems = cartItems.filter(item => item.selected);
  const itemsTotal = selectedItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
  const itemsDiscount = selectedItems.reduce((sum, item) => sum + (item.saveAmount * item.quantity), 0);
  const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = selectedItems.reduce((sum, item) => sum + item.shipping, 0);
  const estimatedTotal = subtotal + shipping;

  const globalSellerItems = cartItems.filter(item => item.sellerType === 'global');
  const aliexpressItems = cartItems.filter(item => item.sellerType === 'aliexpress');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Shopping Cart ({cartItems.length})
          </h1>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Select all items</span>
            </label>
            <button
              onClick={handleDeleteSelected}
              className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Delete selected items
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content - Cart Items */}
          <div className="flex-1 space-y-6">
            {/* Global Sellers Section */}
            {globalSellerItems.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Shipped by global sellers
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {globalSellerItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onSelect={() => handleSelectItem(item.id)}
                      onQuantityChange={(delta) => handleQuantityChange(item.id, delta)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* AliExpress Section */}
            {aliexpressItems.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Shipped by AliExpress
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {aliexpressItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onSelect={() => handleSelectItem(item.id)}
                      onQuantityChange={(delta) => handleQuantityChange(item.id, delta)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-96">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Items total</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    NGN{itemsTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Items discount</span>
                  <span className="font-medium">
                    -NGN{itemsDiscount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-900 dark:text-gray-100 font-semibold text-lg pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span>Subtotal</span>
                  <span>NGN{subtotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    NGN{shipping.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between text-gray-900 dark:text-gray-100 font-bold text-xl pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span>Estimated total</span>
                  <span>NGN{estimatedTotal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 rounded-xl transition-colors shadow-md hover:shadow-lg mb-6">
                Checkout ({selectedItems.length})
              </button>

              {/* Payment Methods */}
              <div className="mb-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Payment methods</p>
                <div className="flex gap-3">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                  <div className="w-12 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">VERVE</div>
                  <div className="w-12 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                  <div className="w-12 h-8 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">OPay</div>
                  <div className="w-12 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-bold">💳</div>
                </div>
              </div>

              {/* Buyer Protection */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">Buyer Protection</span>
                    <br />
                    Get a full refund if the item is not as described or not delivered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CartItem({ item, onSelect, onQuantityChange }: { 
  item: CartItem; 
  onSelect: () => void; 
  onQuantityChange: (delta: number) => void;
}) {
  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex items-start pt-2">
          <input
            type="checkbox"
            checked={item.selected}
            onChange={onSelect}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
        </div>

        {/* Product Image */}
        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-4xl flex-shrink-0">
          {item.image}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-1">
            {item.description}
          </p>

          {/* Tags */}
          <div className="flex gap-2 mb-3">
            {item.onlyLeft && (
              <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded">
                Only {item.onlyLeft} left
              </span>
            )}
            {item.newShopperSave && (
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-1 rounded">
                New shoppers save NGN{item.newShopperSave.toLocaleString()}
              </span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              NGN{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-gray-400 line-through">
              NGN{item.originalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-sm text-green-600 dark:text-green-400 font-medium">
              Save NGN{item.saveAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </span>
          </div>

          {/* Shipping */}
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            + Shipping: NGN{item.shipping.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>

          {/* Seller */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>by</span>
            <span className="font-medium text-blue-600 dark:text-blue-400">{item.seller}</span>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => onQuantityChange(-1)}
              className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              disabled={item.quantity <= 1}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100 min-w-[40px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onQuantityChange(1)}
              className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
