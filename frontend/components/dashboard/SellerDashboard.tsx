'use client';

import { formatEther } from 'viem';
import { Product, Seller } from '@/types'

interface SellerDashboardProps {
  activeTab: string;
  isSeller: boolean;
  seller: Seller;
  sellerProducts: Product[];
  sellerOrders: any[];
  sellerEscrows: any[];
  allProducts: any[];
}

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

export function SellerDashboard({ activeTab,
  isSeller,
  seller,
  sellerProducts,
  sellerOrders,
  sellerEscrows,
  allProducts
}: SellerDashboardProps) {

  const productsTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">My Products</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allProducts?.filter((product, index) =>
              sellerProducts?.includes(BigInt(index + 1))
            ).map((product, index) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-lg">📦</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">ID: #{product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatEther(product.price)} CELO
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.stock.toString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    {product.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                  <button className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ordersTab = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">My Orders</h3>
      <div className="space-y-4">
        {sellerOrders?.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{order.id}</h4>
                <p className="text-sm text-gray-600">{order.status}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{formatEther(order.total)} ETH</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const escrowsTab = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">My Escrows</h3>
      <div className="space-y-4">
        {sellerEscrows?.map((escrow) => (
          <div key={escrow.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{escrow.id}</h4>
                <p className="text-sm text-gray-600">{escrow.status}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{formatEther(escrow.amount)} ETH</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const storeTab = () => (
    <div>
      <h3 className="text-lg font-semibold text-gray-900">Store Info</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Store Name</span>
          <span className="text-sm font-medium text-gray-900">{seller?.storeName || 'Not Registered'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Store Description</span>
          <span className="text-sm font-medium text-gray-900">{seller?.description || 'Not Registered'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Store URL</span>
          <span className="text-sm font-medium text-gray-900">{seller?.storeUrl || 'No URL'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Status</span>
          <span className="text-sm font-medium text-gray-900">{isSeller ? 'Registered' : 'Not Registered'}</span>
        </div>
      </div>
    </div>
  );

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return productsTab();
      case 'orders':
        return ordersTab();
      case 'escrows':
        return escrowsTab();
      case 'store':
        return storeTab();
      default:
        return productsTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="My Products" value={sellerProducts?.length?.toString() || '0'} icon="📦" />
        <StatCard title="Total Orders" value={sellerOrders?.length?.toString() || '0'} icon="🛒" />
        <StatCard title="Escrow Count" value={sellerEscrows?.length?.toString() || '0'} icon="🔄" />
        <StatCard title="Store Status" value={isSeller ? 'Active' : 'Not Registered'} icon="🏪" />
      </div>
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
