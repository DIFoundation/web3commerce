'use client';

import { useState } from 'react';
import { useMarketplace } from '@/hooks/useMarketplace';
import { SearchParams, ProductFilters } from '@/types';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { FilterSidebar } from '@/components/marketplace/FilterSidebar';
import { SortDropdown } from '@/components/marketplace/SortDropdown';
import { ProductCard } from '@/components/marketplace/ProductCard';
import { CartIcon } from '@/components/cart/CartIcon';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {
  const { loadingAllProducts, allProducts } = useMarketplace();
  const router = useRouter();
  
  // Search and filter state
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    filters: {
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
  });
  
  const [filters, setFilters] = useState<ProductFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Derive filtered products directly from state
  const filteredProducts = (() => {
    let filtered = [...allProducts];

    // Apply search query
    if (searchParams.query) {
      const query = searchParams.query.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product =>
        // Mock category assignment - would come from product metadata
        product.id.toString() === filters.category
      );
    }

    // Apply price range filter
    if (filters.minPrice) {
      const minPrice = BigInt(parseFloat(filters.minPrice) * 1e18);
      filtered = filtered.filter(product => product.price >= minPrice);
    }
    if (filters.maxPrice) {
      const maxPrice = BigInt(parseFloat(filters.maxPrice) * 1e18);
      filtered = filtered.filter(product => product.price <= maxPrice);
    }

    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0;
        
        switch (filters.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'price':
            comparison = a.price > b.price ? 1 : a.price < b.price ? -1 : 0;
            break;
          case 'createdAt':
            comparison = a.createdAt > b.createdAt ? 1 : a.createdAt < b.createdAt ? -1 : 0;
            break;
          case 'stock':
            comparison = a.stock > b.stock ? 1 : a.stock < b.stock ? -1 : 0;
            break;
        }
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  })();

  const handleSearchChange = (params: SearchParams) => {
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortBy: 'name' | 'price' | 'createdAt' | 'stock', sortOrder: 'asc' | 'desc') => {
    setFilters({ ...filters, sortBy, sortOrder });
  };

  const handleProductView = (productId: bigint) => {
    router.push(`/product/${productId.toString()}`);
  };

  // Category pills for quick filtering
  const categories = [
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'nfts', name: 'NFTs', icon: '🎨' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-[1500px] mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl">
              <SearchBar
                searchParams={searchParams}
                onSearchChange={handleSearchChange}
              />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-4">
              <SortDropdown
                sortBy={filters.sortBy || 'createdAt'}
                sortOrder={filters.sortOrder || 'desc'}
                onSortChange={handleSortChange}
              />
              <CartIcon />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => handleFiltersChange({ ...filters, category: undefined })}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !filters.category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleFiltersChange({ ...filters, category: category.id })}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
                  filters.category === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1500px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
                <p className="text-gray-600 mt-1">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </p>
              </div>
            </div>

            {/* Products */}
            {loadingAllProducts ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading marketplace...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <span className="text-6xl mb-4 block">🔍</span>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={() => handleFiltersChange({})}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id.toString()}
                    product={product}
                    onViewDetails={handleProductView}
                  />
                ))}
              </div>
            )}

            {/* Load More (for infinite scroll) */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <button className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  Load More Products
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}