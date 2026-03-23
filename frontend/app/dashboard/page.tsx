'use client';

import { useState } from 'react';
import { useConnection } from 'wagmi';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import { useMarketplace as useMarketplaceHook } from '@/hooks/useMarketplace';
import { useEscrow as useEscrowHook } from '@/hooks/useEscrow';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { SellerDashboard } from '@/components/dashboard/SellerDashboard';
import { BuyerDashboard } from '@/components/dashboard/BuyerDashboard';


export default function Dashboard() {
  const { address, isConnected } = useConnection();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedUser, setSelectedUser] = useState(null);

  // Contract hooks
  const { 
    isSeller, 
    seller, 
    sellerProducts, 
    buyerOrders, 
    sellerOrders,
    allProducts,
    loadingAllProducts 
  } = useMarketplaceHook();
  const { 
    buyerEscrows, 
    sellerEscrows, 
    isOwner 
  } = useEscrowHook();

  // Compute role directly instead of using useEffect
  const userRole = isOwner ? 'ADMIN' : isSeller ? 'SELLER' : 'BUYER';


  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔐</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6">
            Connect your wallet to access your dashboard
          </p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  const renderDashboard = () => {
    switch (userRole) {
      case 'ADMIN':
        return (
          <AdminDashboard 
            allProducts={allProducts}
            buyerOrders={buyerOrders}
            buyerEscrows={buyerEscrows}
          />
        );
      case 'SELLER':
        return (
          <SellerDashboard 
            isSeller={isSeller}
            seller={seller}
            sellerProducts={sellerProducts}
            sellerOrders={sellerOrders}
            sellerEscrows={sellerEscrows}
            allProducts={allProducts}
          />
        );
      case 'BUYER':
        return (
          <BuyerDashboard 
            buyerOrders={buyerOrders}
            buyerEscrows={buyerEscrows}
            allProducts={allProducts}
          />
        );
      default:
        return (
          <BuyerDashboard 
            buyerOrders={buyerOrders}
            buyerEscrows={buyerEscrows}
            allProducts={allProducts}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  userRole === 'ADMIN' ? 'bg-purple-500' :
                  userRole === 'SELLER' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
                <span className="text-sm font-medium text-gray-700">
                  {userRole} Dashboard
                </span>
              </div>
              <div className="text-sm text-gray-500">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            {['overview', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {renderDashboard()}
      </div>
    </div>
  );
}
