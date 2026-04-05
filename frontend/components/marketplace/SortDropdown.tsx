'use client';

import { useState } from 'react';
import { ProductSortBy } from '@/types';

interface SortDropdownProps {
  sortBy: ProductSortBy;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: ProductSortBy, sortOrder: 'asc' | 'desc') => void;
}

export function SortDropdown({ sortBy, sortOrder, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { value: 'name' as ProductSortBy, label: 'Name' },
    { value: 'price' as ProductSortBy, label: 'Price' },
    { value: 'createdAt' as ProductSortBy, label: 'Newest' },
    { value: 'stock' as ProductSortBy, label: 'Stock' },
  ];

  const currentOption = sortOptions.find(option => option.value === sortBy);

  const handleSortSelect = (value: ProductSortBy) => {
    if (value === sortBy) {
      // Toggle sort order if same option
      onSortChange(value, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort option, default to ascending for name/stock, descending for price/createdAt
      const defaultOrder = (value === 'price' || value === 'createdAt') ? 'desc' : 'asc';
      onSortChange(value, defaultOrder);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Sort: {currentOption?.label}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        {sortOrder === 'asc' ? (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${
                  sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {sortBy === option.value && (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}