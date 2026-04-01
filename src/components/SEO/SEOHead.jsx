import React from 'react';

/**
 * SEOHead — Dynamic meta tags for each page
 * Uses document.title and meta tag manipulation since we're on Vite (not SSR)
 * For SSR/Next.js migration, replace with next/head
 */
export default function SEOHead({
  title = 'JP Furnishing',
  description = 'Premium home furnishing — curtains, bedsheets, sofa covers and more.',
  keywords = '',
  image = '/home-bg.jpg',
  url = '',
  type = 'website',
  jsonLd = null,
}) {
  const fullTitle = title.includes('JP Furnishing') ? title : `${title} | JP Furnishing`;

  React.useEffect(() => {
    // Set page title
    document.title = fullTitle;

    // Helper to set/create meta tags
    const setMeta = (attr, key, content) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    setMeta('name', 'description', description);
    if (keywords) setMeta('name', 'keywords', keywords);

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', type);
    if (url) setMeta('property', 'og:url', url);

    // Twitter
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // JSON-LD structured data
    if (jsonLd) {
      let script = document.querySelector('#page-json-ld');
      if (!script) {
        script = document.createElement('script');
        script.id = 'page-json-ld';
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }

    // Cleanup
    return () => {
      const scriptEl = document.querySelector('#page-json-ld');
      if (scriptEl) scriptEl.remove();
    };
  }, [fullTitle, description, keywords, image, url, type, jsonLd]);

  return null; // This component only manages document.head
}
