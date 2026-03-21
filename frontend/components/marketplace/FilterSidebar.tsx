'use client';

import { useState } from 'react';
import { ProductFilters, Category } from '@/types';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  isOpen: boolean;
  onToggle: () => void;
}

// Mock categories - would come from API
const mockCategories: Category[] = [
  { id: 'electronics', name: 'Electronics', description: 'Electronic devices', icon: '📱', productCount: 24, isActive: true },
  { id: 'fashion', name: 'Fashion', description: 'Clothing & accessories', icon: '👕', productCount: 89, isActive: true },
  { id: 'nfts', name: 'NFTs', description: 'Digital collectibles', icon: '🎨', productCount: 156, isActive: true },
  { id: 'gaming', name: 'Gaming', description: 'Game items & accounts', icon: '🎮', productCount: 67, isActive: true },
  { id: 'collectibles', name: 'Collectibles', description: 'Rare items', icon: '🏆', productCount: 45, isActive: true },
  { id: 'digital-art', name: 'Digital Art', description: 'Artworks', icon: '🖼️', productCount: 92, isActive: true },
];

export function FilterSidebar({ filters, onFiltersChange, isOpen, onToggle }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || '',
    max: filters.maxPrice || '',
  });

  const handleCategoryChange = (categoryId: string) => {
    const newCategory = filters.category === categoryId ? undefined : categoryId;
    onFiltersChange({ ...filters, category: newCategory });
  };

  const handlePriceRangeChange = (type: 'min' | 'max', value: string) => {
    const newPriceRange = { ...priceRange, [type]: value };
    setPriceRange(newPriceRange);
    
    onFiltersChange({
      ...filters,
      minPrice: newPriceRange.min || undefined,
      maxPrice: newPriceRange.max || undefined,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as 'name' | 'price' | 'createdAt' | 'stock',
      sortOrder,
    });
  };

  const handleClearFilters = () => {
    setPriceRange({ min: '', max: '' });
    onFiltersChange({});
  };

  const activeFiltersCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.inStock,
  ].filter(Boolean).length;

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={onToggle}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block lg:w-64 shrink-0`}>
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
            <div className="space-y-2">
              {mockCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={filters.category === category.id}
                    onChange={() => handleCategoryChange(category.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">({category.productCount})</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Price Range (CELO)</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min</label>
                <input
                  type="number"
                  placeholder="0"
                  value={priceRange.min}
                  onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Stock Status */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Availability</h4>
            <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="checkbox"
                checked={filters.inStock === true}
                onChange={(e) => onFiltersChange({ ...filters, inStock: e.target.checked ? true : undefined })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>

          {/* Seller Type */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Seller Type</h4>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="sellerType"
                  checked={!filters.seller}
                  onChange={() => onFiltersChange({ ...filters, seller: undefined })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">All Sellers</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="radio"
                  name="sellerType"
                  checked={filters.seller !== undefined}
                  onChange={() => onFiltersChange({ ...filters, seller: '0x0000000000000000000000000000000000000000' })}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Verified Only</span>
              </label>
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Sort By</h4>
            <select
              value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}