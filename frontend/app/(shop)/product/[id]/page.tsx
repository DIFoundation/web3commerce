'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useProduct } from '@/hooks/useMarketplace';
import { useConnection } from 'wagmi';
import { ConnectWallet } from '@/components/auth/ConnectWallet';
import Image from 'next/image';
import Link from 'next/link';

export default function ProductPage() {
  const params = useParams();
  const { isConnected } = useConnection();
  const { addToCart } = useCart();
  
  const productId = params.id ? BigInt(params.id as string) : undefined;
  const { product: productData, isLoading: productLoading } = useProduct(productId);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContractInfo, setShowContractInfo] = useState(false);

  const formatPrice = (price: bigint) => {
    return (Number(price) / 1e18).toFixed(4);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const isInStock = productData ? productData.stock > 0 : false;

  const handleQuantityChange = (value: number) => {
    if (productData && value >= 1 && value <= Number(productData.stock)) {
      setQuantity(value);
    }
  };

  // Mock images - would come from IPFS
  const productImages = [
    'https://via.placeholder.com/400x300/4287f0/4287f0.png',
    'https://via.placeholder.com/400x300/4287f1/4287f1.png',
    'https://via.placeholder.com/400x300/4287f2/4287f2.png',
  ];

  if (!productData || productLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/marketplace" className="text-gray-500 hover:text-gray-700">
              Marketplace
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">
              {productData.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                <Image
                  src={productImages[activeImageIndex] || '/logo.png'}
                  alt={productData.name}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === activeImageIndex
                          ? 'bg-blue-600'
                          : 'bg-white bg-opacity-60 hover:bg-opacity-80'
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-2 p-4">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-20 bg-gray-100 rounded overflow-hidden border-2 transition-colors ${
                      index === activeImageIndex
                        ? 'border-blue-600'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={image || '/logo.png'}
                      alt={`Thumbnail ${index + 1}`}
                      width={500}
                      height={500}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Price */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {productData.name}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Product #{productData.id.toString()}</span>
                    <span>•</span>
                    <span>Created {new Date(Number(productData.createdAt) * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(productData.price)} CELO
                  </div>
                  <div className="text-sm text-gray-500">
                    Stock: {productData.stock.toString()}
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-4">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  ✅ Verified Seller
                </div>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  🔗 On-Chain
                </div>
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                  🛡️ Escrow Protected
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {productData.description}
                </p>
              </div>

              {/* Seller Info */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Seller Information</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatAddress(productData.seller)}
                      </p>
                      <p className="text-sm text-gray-600">Verified Seller</p>
                    </div>
                  </div>
                  <a
                    href={`/seller/${productData.seller}`}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Store →
                  </a>
                </div>
              </div>
            </div>

            {/* Purchase Options */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Options</h3>
              
              {!isConnected ? (
                <div className="text-center py-8">
                  <ConnectWallet />
                  <p className="text-sm text-gray-600 mt-4">
                    Connect your wallet to purchase this product
                  </p>
                </div>
              ) : !isInStock ? (
                <div className="text-center py-8">
                  <span className="text-6xl mb-4 block">😞</span>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Out of Stock
                  </h3>
                  <p className="text-gray-600">
                    This product is currently unavailable. Check back later.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= 1}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={productData.stock.toString()}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                        className="w-20 text-center border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= Number(productData.stock)}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (productId) {
                          addToCart(productId);
                        }
                      }}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      Save for Later
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contract Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Smart Contract Info</h3>
                <button
                  onClick={() => setShowContractInfo(!showContractInfo)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  {showContractInfo ? 'Hide' : 'Show'} Details
                </button>
              </div>
              
              {showContractInfo && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contract Address:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '0x0000...0000'}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Product ID:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      #{productData.id.toString()}
                    </code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Token Standard:</span>
                    <span className="font-medium">CELO</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Escrow Status:</span>
                    <span className="font-medium text-green-600">
                      Available
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}