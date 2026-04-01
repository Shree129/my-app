import React from 'react';

/**
 * SkeletonLoader — Reusable loading placeholders
 */

export function SkeletonCard({ height = 320 }) {
  return (
    <div style={{ ...cardStyle, height }}>
      <div className="skeleton" style={{ height: '60%' }}></div>
      <div style={{ padding: 16 }}>
        <div className="skeleton skeleton-title" style={{ width: '75%' }}></div>
        <div className="skeleton skeleton-text" style={{ width: '50%' }}></div>
        <div className="skeleton skeleton-text skeleton-text-sm" style={{ width: '35%', marginTop: 8 }}></div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3, width = '100%' }) {
  return (
    <div style={{ width }}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton skeleton-text"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonImage({ height = 200, borderRadius = 16 }) {
  return (
    <div
      className="skeleton"
      style={{ width: '100%', height, borderRadius }}
    ></div>
  );
}

export function SkeletonAvatar({ size = 48 }) {
  return (
    <div
      className="skeleton"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
      }}
    ></div>
  );
}

export function SkeletonGrid({ count = 6, columns = 3 }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: 20,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

const cardStyle = {
  background: '#fff',
  borderRadius: 18,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};
