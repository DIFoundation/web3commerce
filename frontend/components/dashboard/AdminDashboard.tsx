'use client';

import { useState } from 'react';
import { useEscrow, useEscrowData, useDisputeWindowOpen, useDisputeTimeRemaining } from '@/hooks/useEscrow';
import { useMarketplace } from '@/hooks/useMarketplace';

interface AdminDashboardProps {
  activeTab: string;
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const { 
    escrowCounter, 
    resolveDispute, 
    setEscrowContract, 
    emergencyWithdraw,
    disputeWindow,
    marketplace: escrowMarketplace,
    // createEscrow,
    setMarketplace: setEscrowMarketplace,
    transferOwnership: transferEscrowOwnership
  } = useEscrow();
  const { 
    orderCounter, 
    productCounter, 
    escrowContract: marketplaceEscrowContract, 
    marketplaceOwner,
    // setEscrowContract: setMarketplaceEscrowContract,
    // transferOwnership: transferMarketplaceOwnership 
  } = useMarketplace();
  
  // State for escrow operations
  const [escrowId, setEscrowId] = useState('');
  const [disputeEscrowId, setDisputeEscrowId] = useState('');
  
  // Hooks for specific escrow data (used when escrowId is provided)
  const { escrow } = useEscrowData(escrowId ? BigInt(escrowId) : BigInt(0));
  const { isOpen: isDisputeWindowOpen } = useDisputeWindowOpen(escrowId ? BigInt(escrowId) : BigInt(0));
  const { remainingSeconds: getDisputeTimeRemaining } = useDisputeTimeRemaining(escrowId ? BigInt(escrowId) : BigInt(0));
  const [newMarketplaceAddress, setNewMarketplaceAddress] = useState('');
  const [newOwnerAddress, setNewOwnerAddress] = useState('');
  const [newEscrowAddress, setNewEscrowAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Emergency withdraw state
  const [emergencyWithdrawTo, setEmergencyWithdrawTo] = useState('');
  const [emergencyWithdrawAmount, setEmergencyWithdrawAmount] = useState('');
  
  const handleGetEscrow = async () => {
    if (!escrowId) return;
    setLoading(true);
    try {
      // Escrow data is now available directly from the useEscrowData hook
      console.log('Escrow data:', escrow);
    } catch (error) {
      console.error('Error fetching escrow:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResolveDispute = async () => {
    if (!disputeEscrowId) return;
    setLoading(true);
    try {
      // create an option to choose true or false
      await resolveDispute(BigInt(disputeEscrowId), true);
    } catch (error) {
      console.error('Error resolving dispute:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEmergencyWithdraw = async () => {
    if (!emergencyWithdrawTo || !emergencyWithdrawAmount) return;
    setLoading(true);
    try {
      await emergencyWithdraw(emergencyWithdrawTo as `0x${string}`, BigInt(emergencyWithdrawAmount));
      setEmergencyWithdrawTo('');
      setEmergencyWithdrawAmount('');
    } catch (error) {
      console.error('Error emergency withdraw:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateEscrow = async () => {
    // This would need buyer, seller, productId, amount parameters
    // For now, just a placeholder
    console.log('Create escrow function called');
  };
  
  const handleSetEscrowMarketplace = async () => {
    if (!newEscrowAddress) return;
    setLoading(true);
    try {
      await setEscrowMarketplace(newEscrowAddress as `0x${string}`);
    } catch (error) {
      console.error('Error setting escrow marketplace:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTransferEscrowOwnership = async () => {
    if (!newOwnerAddress) return;
    setLoading(true);
    try {
      await transferEscrowOwnership(newOwnerAddress as `0x${string}`);
    } catch (error) {
      console.error('Error transferring escrow ownership:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSetEscrowContract = async () => {
    if (!newEscrowAddress) return;
    setLoading(true);
    try {
      await setEscrowContract(newEscrowAddress as `0x${string}`);
    } catch (error) {
      console.error('Error setting escrow contract:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderEscrowsTab = () => (
    <div className="space-y-6">
      {/* Escrow Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Escrow Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-600">Total Escrows</p>
            <p className="text-2xl font-bold text-blue-900">{escrowCounter?.toString() || '0'}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm font-medium text-green-600">Dispute Window</p>
            <p className="text-2xl font-bold text-green-900">{disputeWindow?.toString() || '0'}s</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-600">Marketplace Contract</p>
            <p className="text-sm font-bold text-purple-900 truncate">{escrowMarketplace || 'Not set'}</p>
          </div>
        </div>
      </div>
      
      {/* Browse Escrows */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Escrows</h3>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter Escrow ID"
            value={escrowId}
            onChange={(e) => setEscrowId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGetEscrow}
            disabled={loading || !escrowId}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Get Escrow'}
          </button>
        </div>
        {escrow && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Escrow Details</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><strong>ID:</strong> {escrow.id.toString()}</div>
              <div><strong>Buyer:</strong> {escrow.buyer}</div>
              <div><strong>Seller:</strong> {escrow.seller}</div>
              <div><strong>Amount:</strong> {escrow.amount.toString()}</div>
              <div><strong>Product ID:</strong> {escrow.productId.toString()}</div>
              <div><strong>Status:</strong> {escrow.status}</div>
              <div><strong>Created:</strong> {new Date(Number(escrow.createdAt) * 1000).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
  const renderDisputesTab = () => (
    <div className="space-y-6">
      {/* Resolve Disputes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resolve Disputes</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Enter Escrow ID to Resolve"
              value={disputeEscrowId}
              onChange={(e) => setDisputeEscrowId(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleResolveDispute}
              disabled={loading || !disputeEscrowId}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Resolving...' : 'Resolve Dispute'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Dispute Window Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispute Window Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-600">Dispute Window Status</p>
            <p className="text-lg font-bold text-yellow-900">
              {isDisputeWindowOpen ? 'Open' : 'Closed'}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm font-medium text-purple-600">Time Remaining</p>
            <p className="text-lg font-bold text-purple-900">
              {getDisputeTimeRemaining ? `${getDisputeTimeRemaining} seconds` : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderSettingsTab = () => (
    <div className="space-y-6">
      {/* Marketplace Contract Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace Contract Settings</h3>
        <div className="space-y-6">
          {/* Set Marketplace */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Set Marketplace Contract</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="New Marketplace Address"
                value={newMarketplaceAddress}
                onChange={(e) => setNewMarketplaceAddress(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSetEscrowContract}
                disabled={loading || !newMarketplaceAddress}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting...' : 'Set Marketplace'}
              </button>
            </div>
          </div>
          
          {/* Transfer Marketplace Ownership */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Marketplace Ownership</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="New Owner Address"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTransferEscrowOwnership}
                disabled={loading || !newOwnerAddress}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Transferring...' : 'Transfer Ownership'}
              </button>
            </div>
          </div>
          
          {/* Marketplace Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm font-medium text-orange-600">Total Orders</p>
              <p className="text-2xl font-bold text-orange-900">{orderCounter?.toString() || '0'}</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <p className="text-sm font-medium text-pink-600">Total Products</p>
              <p className="text-2xl font-bold text-pink-900">{productCounter?.toString() || '0'}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Escrow Contract Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Escrow Contract Settings</h3>
        <div className="space-y-6">
          {/* Set Escrow Contract Marketplace */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Set Escrow Marketplace</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="New Marketplace Address"
                value={newEscrowAddress}
                onChange={(e) => setNewEscrowAddress(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSetEscrowMarketplace}
                disabled={loading || !newEscrowAddress}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Setting...' : 'Set Escrow Marketplace'}
              </button>
            </div>
          </div>
          
          {/* Transfer Escrow Ownership */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Escrow Ownership</label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="New Owner Address"
                value={newOwnerAddress}
                onChange={(e) => setNewOwnerAddress(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleTransferEscrowOwnership}
                disabled={loading || !newOwnerAddress}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Transferring...' : 'Transfer Ownership'}
              </button>
            </div>
          </div>
          
          {/* Contract Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Current Marketplace</p>
              <p className="text-sm font-bold text-gray-900 truncate">{marketplaceEscrowContract || 'Not set'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-600">Current Owner</p>
              <p className="text-sm font-bold text-gray-900 truncate">{marketplaceOwner || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderEmergencyTab = () => (
    <div className="space-y-6">
      {/* Emergency Withdraw */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Functions</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Withdraw</label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Recipient Address (0x...)"
                value={emergencyWithdrawTo}
                onChange={(e) => setEmergencyWithdrawTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Amount (in wei)"
                value={emergencyWithdrawAmount}
                onChange={(e) => setEmergencyWithdrawAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleEmergencyWithdraw}
                disabled={loading || !emergencyWithdrawTo || !emergencyWithdrawAmount}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Withdrawing...' : 'Emergency Withdraw'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">⚠️ Use only in emergency situations to withdraw specified amount to recipient</p>
          </div>
          
          {/* Create Escrow */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Create Escrow</label>
            <button
              onClick={handleCreateEscrow}
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Escrow (Admin)'}
            </button>
            <p className="text-xs text-gray-500 mt-2">Create new escrow as admin (requires buyer, seller, productId, amount)</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'escrows':
        return renderEscrowsTab();
      case 'disputes':
        return renderDisputesTab();
      case 'settings':
        return renderSettingsTab();
      case 'emergency':
        return renderEmergencyTab();
      default:
        return renderEscrowsTab();
    }
  };
  
  return (
    <div className="space-y-6">
      {renderTabContent()}
    </div>
  );
}
