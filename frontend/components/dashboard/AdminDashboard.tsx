'use client';

import { formatEther } from 'viem';

// Mock data - replace with real data
const mockUsers = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'SELLER', status: 'ACTIVE', joinDate: '2024-01-15', revenue: '125,500 CELO' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'BUYER', status: 'ACTIVE', joinDate: '2024-02-20', spent: '45,200 CELO' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'ADMIN', status: 'ACTIVE', joinDate: '2024-01-10' },
  { id: 4, name: 'Diana', email: 'diana@example.com', role: 'SELLER', status: 'PENDING', joinDate: '2024-03-05', revenue: '89,300 CELO' },
];

const mockTransactions = [
  { id: 1, type: 'ORDER', user: 'Alice', amount: '2,500 CELO', status: 'COMPLETED', date: '2024-03-15', hash: '0x1234...5678' },
  { id: 2, type: 'PAYMENT', user: 'Bob', amount: '1,200 CELO', status: 'PENDING', date: '2024-03-16', hash: '0x8765...4321' },
  { id: 3, type: 'REFUND', user: 'Charlie', amount: '500 CELO', status: 'COMPLETED', date: '2024-03-14', hash: '0x9876...1234' },
];

interface AdminDashboardProps {
  allProducts: any[];
  buyerOrders: any[];
  buyerEscrows: any[];
}

export function AdminDashboard({ allProducts, buyerOrders, buyerEscrows }: AdminDashboardProps) {
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
        <StatCard title="Total Products" value={allProducts?.length?.toString() || '0'} icon="📦" />
        <StatCard title="Total Orders" value={buyerOrders?.length?.toString() || '0'} icon="🛒" />
        <StatCard title="Active Sellers" value="89" icon="🏪" />
        <StatCard title="Escrow Transactions" value={(buyerEscrows?.length || 0).toString()} icon="🔄" />
      </div>

      {/* User Management */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Management</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs">👤</span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'SELLER' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                    {user.status === 'ACTIVE' && (
                      <button className="text-red-600 hover:text-red-900">Suspend</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Escrow Transactions</h3>
        <div className="space-y-3">
          {mockTransactions.slice(0, 5).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${
                  transaction.status === 'COMPLETED' ? 'bg-green-500' :
                  transaction.status === 'PENDING' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <div className="text-sm font-medium text-gray-900">{transaction.type}</div>
                  <div className="text-xs text-gray-500">{transaction.user}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{transaction.amount}</div>
                <div className="text-xs text-gray-500">{transaction.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
