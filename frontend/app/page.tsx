'use client';

import { useMarketplace } from '@/hooks/useMarketplace';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import Link from 'next/link';

export default function LandingPage() {
  const { loadingAllProducts, allProducts } = useMarketplace();

  // Sample featured products (would come from contracts)
  const featuredProducts = allProducts.slice(0, 6);

  const categories = [
    { name: 'Electronics', icon: '📱', count: 24 },
    { name: 'NFTs', icon: '🎨', count: 156 },
    { name: 'Fashion', icon: '👕', count: 89 },
    { name: 'Gaming', icon: '🎮', count: 67 },
    { name: 'Collectibles', icon: '🏆', count: 45 },
    { name: 'Digital Art', icon: '🖼️', count: 92 },
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Connect Wallet',
      description: 'Link your crypto wallet to start shopping securely',
      icon: '🔗'
    },
    {
      step: 2,
      title: 'Browse Products',
      description: 'Discover amazing items from verified sellers worldwide',
      icon: '🔍'
    },
    {
      step: 3,
      title: 'Pay with Crypto',
      description: 'Complete purchases using CELO and other cryptocurrencies',
      icon: '💰'
    },
  ];

  const formatPrice = (price: bigint) => {
    return (Number(price) / 1e18).toFixed(4);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Shop with Crypto<br />
              <span className="text-blue-100">Seamlessly</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Discover amazing products from trusted sellers. Pay with crypto, 
              enjoy secure escrow protection, and experience the future of e-commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/marketplace"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
              >
                Explore Marketplace
              </Link>
              <div className="flex items-center">
                <ConnectWallet className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Web3Commerce?
            </h2>
            <p className="text-gray-600 text-lg">
              The most trusted decentralized marketplace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Contract Protection
              </h3>
              <p className="text-gray-600">
                Every transaction is secured by audited smart contracts with escrow protection
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Transactions
              </h3>
              <p className="text-gray-600">
                Fast, secure payments on Celo blockchain with low fees
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Global Marketplace
              </h3>
              <p className="text-gray-600">
                Shop from verified sellers worldwide with complete transparency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-gray-600">
              Trending items from our marketplace
            </p>
          </div>

          {loadingAllProducts ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <span className="text-6xl mb-4 block">🛍️</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Coming Soon!
              </h3>
              <p className="text-gray-600 mb-6">
                Amazing products will appear here once sellers join our marketplace
              </p>
              <Link
                href="/seller/dashboard"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Become a Seller
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <div key={product.id.toString()} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <span className="text-4xl">📦</span>
                      </div>
                      <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Verified
                      </div>
                      {product.id.toString() % 3 === 0 && (
                        <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
                          NFT-Backed
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 truncate">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-blue-600">
                          {formatPrice(product.price)} CELO
                        </span>
                        <Link
                          href={`/product/${product.id.toString()}`}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <a
                  href="/marketplace"
                  className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
                >
                  View All Products
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 text-lg">
              Start shopping in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Layer */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built on Trust & Transparency
            </h2>
            <p className="text-gray-600 text-lg">
              Every transaction is secure and transparent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">✅</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Contract Verified</h3>
              <p className="text-gray-600 text-sm">Audited contracts ensure security</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Escrow</h3>
              <p className="text-gray-600 text-sm">Funds protected until delivery</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🌐</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Celo Network</h3>
              <p className="text-gray-600 text-sm">Fast, low-cost transactions</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">👥</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Verified Sellers</h3>
              <p className="text-gray-600 text-sm">Only trusted merchants</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-gray-600 text-lg">
              Find exactly what you&apos;re looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <div key={category.name} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-3xl mb-2">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                <p className="text-gray-500 text-xs">{category.count} items</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users already shopping on Web3Commerce
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/marketplace"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Explore Marketplace
            </a>
            <div className="flex items-center">
              <ConnectWallet className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
