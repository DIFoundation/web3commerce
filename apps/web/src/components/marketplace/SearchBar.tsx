'use client';

import { useState, useMemo } from 'react';
import { SearchParams, Product } from '@/types';

interface SearchBarProps {
  searchParams: SearchParams;
  onSearchChange: (params: SearchParams) => void;
  products?: Product[];
  placeholder?: string;
}

export function SearchBar({ searchParams, onSearchChange, products = [], placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState(searchParams.query || '');
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Generate real-time suggestions from actual product data
  const suggestions = useMemo(() => {
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    const matchedProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    return matchedProducts.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      sellerAddress: product.seller,
    }));
  }, [query, products]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowSuggestions(value.length > 0);
    onSearchChange({ ...searchParams, query: value });
  };

  const handleSuggestionClick = (suggestion: { name: string }) => {
    setQuery(suggestion.name);
    setShowSuggestions(false);
    onSearchChange({ ...searchParams, query: suggestion.name });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchChange({ ...searchParams, query });
  };

  const formatPrice = (price: bigint) => {
    return (Number(price) / 1e18).toFixed(4);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400 dark:text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={placeholder}
            className="block w-full pl-12 pr-10 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md text-gray-900 dark:text-gray-100"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => handleInputChange('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center group"
            >
              <svg
                className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Real-time Product Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="py-2">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
              Product Suggestions
            </div>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id.toString()}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-lg">
                    📦
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {suggestion.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Listed by {`${suggestion.sellerAddress.slice(0, 6)}...${suggestion.sellerAddress.slice(-4)}`}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900 dark:text-gray-100">
                    {formatPrice(suggestion.price)} CELO
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results State */}
      {showSuggestions && suggestions.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="py-8 text-center">
            <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No products found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try different keywords</p>
          </div>
        </div>
      )}
    </div>
  );
}