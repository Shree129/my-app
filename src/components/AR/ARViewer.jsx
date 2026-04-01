import React, { useState, useRef } from 'react';

/**
 * ARViewer — Product preview in user's room
 * Uses image overlay approach (no 3D models required)
 * User uploads room photo, then drags/resizes product image on top
 */
export default function ARViewer({ product, onClose }) {
  const [roomImage, setRoomImage] = useState(null);
  const [productPos, setProductPos] = useState({ x: 150, y: 150 });
  const [productScale, setProductScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const productImage = product?.image || product?.main_image || '/image copy 2.png';

  const handleRoomUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setRoomImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    setProductPos({
      x: e.clientX - container.left - dragOffset.x,
      y: e.clientY - container.top - dragOffset.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const touch = e.touches[0];
    const container = containerRef.current.getBoundingClientRect();
    setProductPos({
      x: touch.clientX - container.left - dragOffset.x,
      y: touch.clientY - container.top - dragOffset.y,
    });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h3 style={styles.title}>🏠 Preview in Your Room</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {!roomImage ? (
          /* Upload Room Photo */
          <div style={styles.uploadSection}>
            <div style={styles.uploadBox}>
              <span style={{ fontSize: '3rem' }}>📷</span>
              <h4 style={{ margin: '12px 0 6px', color: '#3f2b20' }}>Upload Your Room Photo</h4>
              <p style={{ color: '#78716c', fontSize: '0.9rem', marginBottom: 20 }}>
                Take a photo of your room and see how this product looks in your space
              </p>
              <label style={styles.uploadBtn}>
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleRoomUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Product Preview */}
            <div style={styles.productPreview}>
              <img src={productImage} alt={product?.model_name} style={styles.previewImg} />
              <p style={styles.previewName}>{product?.model_name || 'Selected Product'}</p>
            </div>
          </div>
        ) : (
          /* AR Preview Canvas */
          <div
            ref={containerRef}
            style={styles.canvas}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Room Background */}
            <img src={roomImage} alt="Your room" style={styles.roomImg} />

            {/* Draggable Product Overlay */}
            <img
              src={productImage}
              alt={product?.model_name}
              style={{
                ...styles.productOverlay,
                left: productPos.x,
                top: productPos.y,
                width: 180 * productScale,
                cursor: isDragging ? 'grabbing' : 'grab',
                opacity: isDragging ? 0.85 : 1,
              }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              draggable={false}
            />

            {/* Controls */}
            <div style={styles.controls}>
              <button
                style={styles.controlBtn}
                onClick={() => setProductScale(s => Math.max(0.3, s - 0.15))}
                aria-label="Decrease size"
              >
                ➖
              </button>
              <span style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>
                {Math.round(productScale * 100)}%
              </span>
              <button
                style={styles.controlBtn}
                onClick={() => setProductScale(s => Math.min(3, s + 0.15))}
                aria-label="Increase size"
              >
                ➕
              </button>
              <button
                style={{ ...styles.controlBtn, marginLeft: 12 }}
                onClick={() => setRoomImage(null)}
                aria-label="Change room photo"
              >
                🔄
              </button>
            </div>

            {/* Instructions */}
            <div style={styles.instructions}>
              Drag the product to position it • Use +/- to resize
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(8px)',
    zIndex: 1200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    animation: 'fadeIn 0.2s ease',
  },
  container: {
    width: '100%',
    maxWidth: 800,
    background: '#fff',
    borderRadius: 24,
    overflow: 'hidden',
    boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '18px 24px',
    borderBottom: '1px solid #ece7e0',
  },
  title: {
    margin: 0,
    fontSize: '1.15rem',
    color: '#3f2b20',
    fontWeight: 700,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    background: '#f5f5f4',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadSection: {
    padding: 32,
    textAlign: 'center',
  },
  uploadBox: {
    border: '2px dashed #d4b896',
    borderRadius: 20,
    padding: '40px 24px',
    marginBottom: 24,
  },
  uploadBtn: {
    display: 'inline-block',
    background: 'linear-gradient(135deg, #6b432c, #a07844)',
    color: '#fff',
    padding: '12px 28px',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  productPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    background: '#fdf8f3',
    borderRadius: 14,
    border: '1px solid #e8d5c0',
  },
  previewImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    objectFit: 'cover',
  },
  previewName: {
    fontWeight: 600,
    color: '#3f2b20',
    fontSize: '0.95rem',
    margin: 0,
  },
  canvas: {
    position: 'relative',
    height: '65vh',
    overflow: 'hidden',
    background: '#1c1917',
    userSelect: 'none',
  },
  roomImg: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  productOverlay: {
    position: 'absolute',
    borderRadius: 8,
    objectFit: 'contain',
    transition: 'opacity 0.15s',
    filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))',
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'rgba(0,0,0,0.6)',
    backdropFilter: 'blur(12px)',
    padding: '10px 20px',
    borderRadius: 30,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    position: 'absolute',
    bottom: 14,
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '0.78rem',
    whiteSpace: 'nowrap',
  },
};
