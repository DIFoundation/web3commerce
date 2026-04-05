'use client';

import { useMarketplace } from '@/hooks/useMarketplace';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

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
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="bg-linear-to-l from-gray-950 to-gray-900 text-white rounded-4xl">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-sm font-medium text-gray-400 mb-4 tracking-wider uppercase">
                Number #1 Blockchain Marketplace
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Shop Seamlessly<br />
                <span className="text-gray-300">Across Blockchains.</span>
              </h1>
              <p className="text-lg mb-8 text-gray-400 max-w-lg">
                Discover amazing products from trusted sellers. Pay with crypto, 
                enjoy secure escrow protection, and experience the future of e-commerce.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/marketplace"
                  className="bg-white text-black px-8 py-4 rounded-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105 inline-flex items-center"
                >
                  Explore Marketplace <ArrowUpRight className="ml-2" />
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* <div className="w-full max-w-md h-96 bg-gray-900 rounded-lg flex items-center justify-center"> */}
                  <Image
                    src="/banner.png"
                    alt="Product"
                    width={400}
                    height={400}
                    className="object-cover"
                  />
                {/* </div> */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-purple-500 rounded-full animate-pulse delay-75"></div>
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
                      {Number(product.id) % 3 === 0 && (
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Web3Commerce</h3>
              <p className="text-gray-400 mb-4">
                The future of e-commerce powered by blockchain technology. 
                Shop securely with cryptocurrency.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/marketplace" className="text-gray-400 hover:text-white transition-colors">Marketplace</Link></li>
                <li><Link href="/orders" className="text-gray-400 hover:text-white transition-colors">My Orders</Link></li>
                <li><Link href="/cart" className="text-gray-400 hover:text-white transition-colors">Cart</Link></li>
                <li><Link href="/seller/dashboard" className="text-gray-400 hover:text-white transition-colors">Sell on Web3Commerce</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Safety & Security</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
              <p className="text-gray-400 mb-4">
                Subscribe to get updates on new products and exclusive offers.
              </p>
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Web3Commerce. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Terms</Link>
                <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy</Link>
                <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">Cookies</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
