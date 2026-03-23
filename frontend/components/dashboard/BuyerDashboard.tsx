'use client';

import { formatEther } from 'viem';

interface BuyerDashboardProps {
  buyerOrders: any[];
  buyerEscrows: any[];
  allProducts: any[];
}

export function BuyerDashboard({ buyerOrders, buyerEscrows, allProducts }: BuyerDashboardProps) {
  const StatCard = ({ title, value, change, icon }: { title: string; value: string; change?: string; icon: string }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </p>
          )}
        </div>
        <div className="text-2xl text-gray-400">
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Orders" value={buyerOrders?.length?.toString() || '0'} icon="🛒" />
        <StatCard title="Escrow Transactions" value={buyerEscrows?.length?.toString() || '0'} icon="🔄" />
        <StatCard title="Available Products" value={allProducts?.length?.toString() || '0'} icon="📦" />
        <StatCard title="Connected" value="Yes" icon="✅" />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">My Orders</h3>
        <div className="space-y-3">
          {buyerOrders?.slice(0, 3).map((orderId, index) => (
            <div key={orderId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Order #{orderId}</div>
                  <div className="text-xs text-gray-500">Product ID: {orderId}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Pending</div>
                <div className="text-xs text-gray-500">View Details</div>
              </div>
            </div>
          ))}
          {(!buyerOrders || buyerOrders.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">🛒</span>
              <p>No orders yet</p>
              <p className="text-sm">Start shopping to see your orders here</p>
            </div>
          )}
        </div>
      </div>

      {/* Available Products */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProducts?.slice(0, 6).map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-full h-24 bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <span className="text-2xl">📦</span>
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h4>
              <p className="text-sm font-bold text-blue-600">{formatEther(product.price)} CELO</p>
              <p className="text-xs text-gray-500">Stock: {product.stock.toString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
