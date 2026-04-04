import React, { useState, useRef, useEffect, useCallback } from 'react';
import './SearchableSelect.css';

/**
 * Searchable select dropdown — replaces the external search input + native select combo.
 * 
 * Props:
 * - options: array of objects  { value, label } or custom shape with getOptionValue/getOptionLabel
 * - value: currently selected value (string)
 * - onChange: (value) => void
 * - placeholder: string — shown when nothing selected
 * - searchPlaceholder: string — inside dropdown search input
 * - disabled: boolean
 */
const SearchableSelect = ({
  options = [],
  value = '',
  onChange,
  placeholder = '-- Pilih --',
  searchPlaceholder = 'Cari...',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Derived: selected option label
  const selectedOption = options.find((o) => o.value === value);

  // Filtered options based on search
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  // Open dropdown
  const openDropdown = () => {
    if (disabled) return;
    setIsOpen(true);
    setSearch('');
    // Focus search on next tick
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };

  // Close dropdown
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearch('');
  }, []);

  // Select an option
  const handleSelect = (option) => {
    onChange(option.value);
    closeDropdown();
  };

  // Clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, closeDropdown]);

  // Keyboard: Escape closes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeDropdown();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeDropdown]);

  return (
    <div
      className={`ss-container ${isOpen ? 'ss-open' : ''} ${disabled ? 'ss-disabled' : ''}`}
      ref={containerRef}
    >
      {/* Trigger — looks like an input */}
      <div
        className="ss-trigger"
        onClick={openDropdown}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => e.key === 'Enter' && openDropdown()}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={`ss-value ${!selectedOption ? 'ss-placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="ss-icons">
          {selectedOption && (
            <button
              type="button"
              className="ss-clear-btn"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Hapus pilihan"
            >
              ×
            </button>
          )}
          <svg
            className={`ss-chevron ${isOpen ? 'ss-chevron-up' : ''}`}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="m7 10 5 5 5-5" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="ss-dropdown" role="listbox">
          {/* Search input inside dropdown */}
          <div className="ss-search-wrap">
            <svg className="ss-search-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              className="ss-search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {search && (
              <button
                type="button"
                className="ss-search-clear"
                onClick={() => setSearch('')}
              >
                ×
              </button>
            )}
          </div>

          {/* Options list */}
          <div className="ss-options" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="ss-empty">Tidak ada hasil untuk "{search}"</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`ss-option ${option.value === value ? 'ss-option-selected' : ''}`}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.value === value && (
                    <svg className="ss-check" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                  <span>{option.label}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
