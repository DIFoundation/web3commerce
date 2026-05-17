'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useCart } from '@/hooks/useCart';
import { Address } from 'viem';
import { Product } from '@/types';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { reads: { useProduct, useSeller } } = useMarketplace();
  const { addToCart, isInCart } = useCart();
  
  const productId = BigInt(params.id as string);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');

  const { data: product, isLoading: productLoading } = useProduct(productId);
  const { data: seller } = useSeller(product?.[1] || '0x' as Address);

  const formatPrice = (price: bigint) => {
    return (Number(price) / 1e18).toFixed(4);
  };

  const formatAddress = (address: Address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAddToCart = () => {
    if (product && product[5] >= quantity) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product[0]);
      }
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && product && newQuantity <= Number(product[5])) {
      setQuantity(newQuantity);
    }
  };

  if (productLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/marketplace')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Marketplace
          </button>
        </div>
      </div>
    );
  }

  const isInStock = product[7] === true;
  const itemInCart = isInCart(product[0]);
  const totalAmount = product[5] * BigInt(quantity);

  // Mock images for the product
  const images = [
    { id: 0, src: '📦', alt: product[2] },
    { id: 1, src: '🎁', alt: `${product[2]} - View 2` },
    { id: 2, src: '🛍️', alt: `${product[2]} - View 3` },
    { id: 3, src: '✨', alt: `${product[2]} - View 4` },
  ];

  // Mock reviews
  const reviews = [
    { id: 1, user: '0x1234...5678', rating: 5, comment: 'Excellent product! Fast shipping and great quality.', date: '2 days ago' },
    { id: 2, user: '0xabcd...efgh', rating: 4, comment: 'Good value for money. Would recommend.', date: '1 week ago' },
    { id: 3, user: '0x9876...5432', rating: 5, comment: 'Perfect! Exactly as described.', date: '2 weeks ago' },
  ];

  const averageRating = 4.7;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm">
            <button
              onClick={() => router.push('/marketplace')}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Marketplace
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600 dark:text-gray-400">{product[2]}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg aspect-square flex items-center justify-center">
              <span className="text-9xl">{images[selectedImage].src}</span>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md aspect-square flex items-center justify-center transition-all ${
                    selectedImage === index ? 'ring-2 ring-blue-600 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'
                  }`}
                >
                  <span className="text-4xl">{image.src}</span>
                </button>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-green-500 text-xl">🔗</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">On-chain Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-purple-500 text-xl">🛡️</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Escrow Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-500 text-xl">⚡</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">Instant Transfer</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Name & Rating */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{product[2]}</h1>
                <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{averageRating}</span>
                  <span className="text-gray-600 dark:text-gray-400">({reviews.length} reviews)</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">by {seller?.[1] || formatAddress(product[1])}</p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                  {formatPrice(product[4])} CELO
                </span>
                {Number(product[5]) > 0 && (
                  <span className="text-lg text-gray-600 dark:text-gray-400">
                    ({formatPrice(product[4])} / unit)
                  </span>
                )}
              </div>
              {!isInStock && (
                <div className="mt-2 flex items-center gap-2 text-red-600 dark:text-red-400">
                  <span>❌</span>
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
              {isInStock && Number(product[5]) < 10 && (
                <div className="mt-2 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <span>⚠️</span>
                  <span className="font-medium">Only {product[5]} left in stock!</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {isInStock && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Quantity
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= Number(product[6])}
                    className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xl"
                  >
                    +
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {product[6]} available
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Total:</span>
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(totalAmount)} CELO
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                  !isInStock
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : itemInCart
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {itemInCart ? '✓ In Cart' : isInStock ? 'Add to Cart' : 'Sold Out'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!isInStock}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold text-lg transition-all ${
                  !isInStock
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                }`}
              >
                Buy Now
              </button>
            </div>

            {/* Seller Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Seller Information (coming soon)</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {seller?.[1]?.[0] || 'S'}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {seller?.[1] || 'Unknown Seller'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {seller?.[2] || 'No description available'}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-gray-600 dark:text-gray-400">4.8 rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      <span className="text-gray-600 dark:text-gray-400">Verified Seller</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/seller/${product[1]}`)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
                >
                  View Store
                </button>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b dark:border-gray-700">
                {['description', 'specifications', 'shipping'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Product Description</h4>
                    {/* change description to info from IPFS */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{"IPFS not connected yet!!"}</p>
                  </div>
                )}
                {activeTab === 'specifications' && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Specifications</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">Product ID</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">#{(Number(product?.[0]) || 0).toString()}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">Created</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {new Date(Number(product[8]) * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b dark:border-gray-700">
                        <span className="text-gray-600 dark:text-gray-400">IPFS Hash</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {product[6].slice(0, 16)}...
                        </span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600 dark:text-gray-400">Blockchain</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Celo</span>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Shipping Information</h4>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Free shipping on orders over 100 CELO</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Express delivery available (2-3 business days)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>International shipping supported</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Tracking number provided for all orders</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Reviews</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Write a Review
              </button>
            </div>

            {/* Rating Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <div className="text-center">
                <div className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2">{averageRating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(averageRating) ? 'text-yellow-500' : 'text-gray-300'}>
                      ⭐
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{reviews.length} reviews</div>
              </div>
              <div className="col-span-2 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{stars} star</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: stars === 5 ? '70%' : stars === 4 ? '20%' : '10%' }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-10">
                      {stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Review List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b dark:border-gray-700 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {review.user.slice(2, 4)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{review.user}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}>
                              ⭐
                            </span>
                          ))}
                          <span>• {review.date}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                      Helpful ✓
                    </button>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => router.push(`/product/${BigInt(productId) + BigInt(i)}`)}
              >
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-xl flex items-center justify-center">
                  <span className="text-5xl text-gray-400 dark:text-gray-500">📦</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                    Related Product {i}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      {(Math.random() * 10).toFixed(2)} CELO
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">4.{i}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
