import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchProducts, getAutocompleteSuggestions, getTrendingSearches, parseSearchQuery } from '../../utils/searchEngine';
import { useUserActivity } from '../../context/UserActivityContext';
import masterCatalog from '../../buyer/masterCatalog';
import './SmartSearch.css';

/**
 * SmartSearch — Full-screen intelligent search overlay
 * Supports natural language queries, autocomplete, filters, and trending searches
 */
export default function SmartSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { trackEvent, getRecentSearches } = useUserActivity();

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
      setQuery('');
      setResults([]);
      setHasSearched(false);
      setActiveFilters({});
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Search on query change with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSuggestions([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      // Get autocomplete suggestions
      const autoSuggestions = getAutocompleteSuggestions(query, masterCatalog);
      setSuggestions(autoSuggestions);

      // Perform search if query len > 2
      if (query.length > 2) {
        const searchResults = searchProducts(masterCatalog, query);
        setResults(searchResults.slice(0, 20));
        setHasSearched(true);

        // Parse filters from query
        const parsed = parseSearchQuery(query);
        const newFilters = {};
        if (parsed.category) newFilters.category = parsed.category;
        if (parsed.color) newFilters.color = parsed.color;
        if (parsed.maxPrice) newFilters.price = `Under ₹${parsed.maxPrice}`;
        if (parsed.pattern) newFilters.pattern = parsed.pattern;
        setActiveFilters(newFilters);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = useCallback((searchText) => {
    const q = searchText || query;
    if (!q.trim()) return;

    trackEvent('search', { query: q });
    const searchResults = searchProducts(masterCatalog, q);
    setResults(searchResults.slice(0, 30));
    setHasSearched(true);
    setSuggestions([]);
  }, [query, trackEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleProductClick = (product) => {
    trackEvent('click', {
      productId: product.product_id,
      category: product.category,
    });

    const routes = {
      curtain: '/curtain/',
      bedsheet: '/bedsheets/',
      sofa: '/sofa-cover/',
      sofa_cover: '/sofa-cover/',
      pillow_cover: '/pillow-cover/',
      doormat: '/doormat/',
    };
    const base = routes[product.category] || '/product/';
    navigate(`${base}${product.product_id}`);
    onClose();
  };

  const removeFilter = (key) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const recentSearches = getRecentSearches();
  const trending = getTrendingSearches();

  if (!isOpen) return null;

  return (
    <div className="smart-search-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="smart-search-container">
        {/* Input */}
        <form onSubmit={handleSubmit} className="smart-search-input-wrap">
          <span className="smart-search-icon">🔍</span>
          <input
            ref={inputRef}
            className="smart-search-input"
            type="text"
            placeholder='Try "blue curtains under 1000" or "cotton bedsheets"...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            id="smart-search-input"
          />
          <button type="button" className="smart-search-close" onClick={onClose} aria-label="Close search">
            ESC
          </button>
        </form>

        {/* Body */}
        <div className="smart-search-body">
          {/* Active Filters */}
          {Object.keys(activeFilters).length > 0 && (
            <div className="search-filters">
              {Object.entries(activeFilters).map(([key, value]) => (
                <span key={key} className="search-filter-chip active" onClick={() => removeFilter(key)}>
                  {typeof value === 'string' ? value.replace(/_/g, ' ') : value}
                  <span className="remove">✕</span>
                </span>
              ))}
            </div>
          )}

          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && !hasSearched && (
            <>
              <div className="search-section-label">Suggestions</div>
              <ul className="search-suggestions">
                {suggestions.map((s, i) => (
                  <li key={i} className="search-suggestion-item" onClick={() => handleSuggestionClick(s)}>
                    <span className="icon">🔍</span>
                    {s}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Search Results */}
          {hasSearched && results.length > 0 && (
            <>
              <div className="search-section-label">
                {results.length} product{results.length > 1 ? 's' : ''} found
              </div>
              <div className="search-results-grid">
                {results.map((product, i) => (
                  <div
                    key={product.product_id || i}
                    className="search-result-card"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.image || product.main_image || '/image copy 2.png'}
                      alt={product.model_name}
                      className="search-result-image"
                      loading="lazy"
                      onError={(e) => { e.target.src = '/image copy 2.png'; }}
                    />
                    <div className="search-result-content">
                      <h4 className="search-result-name">{product.model_name}</h4>
                      <p className="search-result-meta">
                        {(product.category || '').replace(/_/g, ' ')}
                        {product.color ? ` • ${product.color}` : ''}
                      </p>
                      {(product.final_price || product.price) ? (
                        <p className="search-result-price">
                          ₹{(product.final_price || product.price).toLocaleString()}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* No Results */}
          {hasSearched && results.length === 0 && (
            <div className="search-no-results">
              <div className="emoji">🔍</div>
              <h3>No products found</h3>
              <p>Try different keywords or browse our categories</p>
            </div>
          )}

          {/* Empty State — Recent & Trending */}
          {!hasSearched && suggestions.length === 0 && (
            <>
              {recentSearches.length > 0 && (
                <>
                  <div className="search-section-label">Recent Searches</div>
                  <ul className="search-suggestions">
                    {recentSearches.map((s, i) => (
                      <li key={i} className="search-suggestion-item" onClick={() => handleSuggestionClick(s.query)}>
                        <span className="icon">🕒</span>
                        {s.query}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <div className="search-section-label">Trending Searches</div>
              <div className="trending-tags">
                {trending.map((term, i) => (
                  <button
                    key={i}
                    className="trending-tag"
                    onClick={() => handleSuggestionClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
