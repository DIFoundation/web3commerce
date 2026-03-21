'use client';

import { useState } from 'react';
import { SearchParams } from '@/types';

interface SearchBarProps {
  searchParams: SearchParams;
  onSearchChange: (params: SearchParams) => void;
  placeholder?: string;
}

export function SearchBar({ searchParams, onSearchChange, placeholder = "Search products..." }: SearchBarProps) {
  const [query, setQuery] = useState(searchParams.query || '');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock suggestions - would come from API/contract
  const mockSuggestions = [
    'iPhone 15 Pro',
    'Gaming Laptop',
    'NFT Art Collection',
    'Designer Watch',
    'Crypto Merch',
  ];

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Filter suggestions based on input
    if (value.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }

    onSearchChange({ ...searchParams, query: value });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearchChange({ ...searchParams, query: suggestion });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    onSearchChange({ ...searchParams, query });
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
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
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => handleInputChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg
                className="h-5 w-5 text-gray-400 hover:text-gray-600"
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

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-2">
            <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
              Suggestions
            </div>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg
                  className="h-4 w-4 text-gray-400"
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
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Searches (when no query) */}
      {showSuggestions && suggestions.length === 0 && query.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-2">
            <div className="px-3 py-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
              Recent Searches
            </div>
            <div className="px-3 py-2 text-sm text-gray-500">
              No recent searches
            </div>
          </div>
        </div>
      )}
    </div>
  );
}