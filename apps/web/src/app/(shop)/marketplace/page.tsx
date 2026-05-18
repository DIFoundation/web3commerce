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
  const { reads: { useProductCount, useProducts } } = useMarketplace();
  const router = useRouter();

  const productCount = useProductCount();

  const featuredProductIds = productCount.data
    ? Array.from({ length: Number(productCount.data) }, (_, i) => BigInt(i + 1))
    : [];

  const { data: featuredProducts, isLoading } = useProducts(featuredProductIds);

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
    let filtered = [...(featuredProducts || [])];

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-4 py-5">
          <div className="flex flex-col lg:flex-row gap-5 items-center justify-between">
            {/* Search Bar with Real-time Suggestions */}
            <div className="flex flex-row flex-1 max-w-3xl w-full">
              <SearchBar
                searchParams={searchParams}
                onSearchChange={handleSearchChange}
                products={[...(featuredProducts || [])]}
                placeholder="Search products by name or description..."
              />
            </div>
            {/* Enhanced Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              <button
                onClick={() => handleFiltersChange({ ...filters, category: undefined })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 ${!filters.category
                    ? 'bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:bg-blue-800'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                  }`}
              >
                <span>🛍️</span>
                All Products
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleFiltersChange({ ...filters, category: category.id })}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 ${filters.category === category.id
                      ? 'bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:bg-blue-800'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                >
                  <span className="text-lg">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <SortDropdown
                sortBy={filters.sortBy || 'createdAt'}
                sortOrder={filters.sortOrder || 'desc'}
                onSortChange={handleSortChange}
              />
              <CartIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isSidebarOpen}
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            filteredProductsCount={filteredProducts.length}
            searchParams={searchParams}
            onSearchChange={handleSearchChange}
          />

          {/* Product Grid */}
          <div className="flex-1">
            {/* Products */}
            {isLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading marketplace...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  No products found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => handleFiltersChange({})}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
                  >
                    Clear All Filters
                  </button>
                  <button
                    onClick={() => handleSearchChange({ ...searchParams, query: '' })}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
                  >
                    Clear Search
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id.toString()}
                      product={product}
                      onViewDetails={handleProductView}
                    />
                  ))}
                </div>

                {/* Load More (for infinite scroll) */}
                {filteredProducts.length > 0 && (
                  <div className="text-center mt-12">
                    <button className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all font-medium shadow-sm hover:shadow-md">
                      Load More Products
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}