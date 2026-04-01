import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UserActivityContext = createContext();

const STORAGE_KEY = 'jp_user_activity';
const API_BASE = ''; // Use relative paths for proxy/serverless compatibility

/**
 * Generate a simple anonymous user ID
 */
function getOrCreateUserId() {
  let id = localStorage.getItem('jp_user_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem('jp_user_id', id);
  }
  return id;
}

/**
 * Load activity from localStorage
 */
function loadActivity() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        views: parsed.views || [],
        clicks: parsed.clicks || [],
        cart: parsed.cart || [],
        wishlist: parsed.wishlist || [],
        searches: parsed.searches || [],
      };
    }
  } catch (e) {
    console.warn('Failed to load activity:', e);
  }
  return { views: [], clicks: [], cart: [], wishlist: [], searches: [] };
}

/**
 * Save activity to localStorage
 */
function saveActivity(activity) {
  try {
    // Keep only recent entries to avoid storage bloat
    const trimmed = {
      views: activity.views.slice(-50),
      clicks: activity.clicks.slice(-50),
      cart: activity.cart.slice(-30),
      wishlist: activity.wishlist.slice(-30),
      searches: activity.searches.slice(-20),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.warn('Failed to save activity:', e);
  }
}

export function UserActivityProvider({ children }) {
  const [userId] = useState(getOrCreateUserId);
  const [activity, setActivity] = useState(loadActivity);

  // Persist on change
  useEffect(() => {
    saveActivity(activity);
  }, [activity]);

  /**
   * Track a user event
   */
  const trackEvent = useCallback((event, data) => {
    const entry = {
      ...data,
      timestamp: Date.now(),
    };

    setActivity(prev => {
      const updated = { ...prev };

      switch (event) {
        case 'view':
          // Avoid duplicate consecutive views
          const lastView = updated.views[updated.views.length - 1];
          if (lastView?.productId !== data.productId) {
            updated.views = [...updated.views, entry];
          }
          break;
        case 'click':
          updated.clicks = [...updated.clicks, entry];
          break;
        case 'add_to_cart':
          updated.cart = [...updated.cart, entry];
          break;
        case 'wishlist':
          updated.wishlist = [...updated.wishlist, entry];
          break;
        case 'search':
          updated.searches = [...updated.searches, entry];
          break;
        default:
          break;
      }

      return updated;
    });

    // Also send to server (fire and forget)
    fetch(`${API_BASE}/api/recommendations/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, event, ...data }),
    }).catch(() => {}); // Silently fail — tracking is non-critical
  }, [userId]);

  /**
   * Get recently viewed products
   */
  const getRecentlyViewed = useCallback(() => {
    const seen = new Set();
    return activity.views
      .slice()
      .reverse()
      .filter(v => {
        if (seen.has(v.productId)) return false;
        seen.add(v.productId);
        return true;
      })
      .slice(0, 10);
  }, [activity.views]);

  /**
   * Get recent searches
   */
  const getRecentSearches = useCallback(() => {
    const seen = new Set();
    return activity.searches
      .slice()
      .reverse()
      .filter(s => {
        const q = s.query?.toLowerCase();
        if (!q || seen.has(q)) return false;
        seen.add(q);
        return true;
      })
      .slice(0, 5);
  }, [activity.searches]);

  /**
   * Get user's preferred categories (based on activity weight)
   */
  const getPreferredCategories = useCallback(() => {
    const weights = {};

    activity.views.forEach(v => {
      if (v.category) weights[v.category] = (weights[v.category] || 0) + 1;
    });
    activity.clicks.forEach(c => {
      if (c.category) weights[c.category] = (weights[c.category] || 0) + 2;
    });
    activity.cart.forEach(c => {
      if (c.category) weights[c.category] = (weights[c.category] || 0) + 5;
    });

    return Object.entries(weights)
      .sort((a, b) => b[1] - a[1])
      .map(([cat]) => cat);
  }, [activity]);

  const value = {
    userId,
    activity,
    trackEvent,
    getRecentlyViewed,
    getRecentSearches,
    getPreferredCategories,
  };

  return (
    <UserActivityContext.Provider value={value}>
      {children}
    </UserActivityContext.Provider>
  );
}

export const useUserActivity = () => {
  const context = useContext(UserActivityContext);
  if (!context) {
    // Return noop if used outside provider (graceful degradation)
    return {
      userId: null,
      activity: { views: [], clicks: [], cart: [], wishlist: [], searches: [] },
      trackEvent: () => {},
      getRecentlyViewed: () => [],
      getRecentSearches: () => [],
      getPreferredCategories: () => [],
    };
  }
  return context;
};
