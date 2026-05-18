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
    { value: 'createdAt' as ProductSortBy, label: 'Newest', icon: '🕐' },
    { value: 'price' as ProductSortBy, label: 'Price', icon: '💰' },
    { value: 'name' as ProductSortBy, label: 'Name', icon: '🔤' },
    { value: 'stock' as ProductSortBy, label: 'Stock', icon: '📦' },
  ];

  const currentOption = sortOptions.find(option => option.value === sortBy);

  const handleSortSelect = (value: ProductSortBy) => {
    if (value === sortBy) {
      // Toggle sort order if same option
      onSortChange(value, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New sort option, default to descending for price/createdAt, ascending for name/stock
      const defaultOrder = (value === 'price' || value === 'createdAt') ? 'desc' : 'asc';
      onSortChange(value, defaultOrder);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm hover:shadow-md"
      >
        <span className="text-lg">{currentOption?.icon}</span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {currentOption?.label}
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
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl z-20 overflow-hidden">
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-700/50">
                Sort By
              </div>
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option.value)}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between group ${
                    sortBy === option.value ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{option.icon}</span>
                    <span className={`text-sm font-medium ${
                      sortBy === option.value 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  {sortBy === option.value && (
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}