import React, { useState, useEffect } from 'react';

/**
 * InstallPrompt — Premium and non-intrusive bottom banner for PWA installation
 * Only appears if the browser supports it and the app isn't already installed.
 */
export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the browser's default prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show custom UI after a small delay
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the browser's install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // We've used the prompt, so can't use it again
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div style={S.container}>
      <div style={S.content}>
        <div style={S.iconBox}>🏠</div>
        <div style={S.textBox}>
          <h4 style={S.title}>Install JP Furnishing</h4>
          <p style={S.subtitle}>Add to home screen for a premium offline experience.</p>
        </div>
      </div>
      <div style={S.actions}>
        <button style={S.dismissBtn} onClick={() => setShowPrompt(false)}>Later</button>
        <button style={S.installBtn} onClick={handleInstallClick}>Install Now</button>
      </div>
    </div>
  );
}

const S = {
  container: {
    position: 'fixed',
    bottom: '24px',
    left: '24px',
    right: '24px',
    maxWidth: '420px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    zIndex: 10000,
    animation: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
    border: '1px solid rgba(255,255,255,0.4)',
  },
  content: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #6b432c, #a07844)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: '#fff',
    boxShadow: '0 4px 12px rgba(107, 67, 44, 0.2)',
  },
  textBox: {
    flex: 1,
  },
  title: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#333',
  },
  subtitle: {
    margin: '2px 0 0',
    fontSize: '0.85rem',
    color: '#666',
    lineHeight: 1.4,
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
  },
  dismissBtn: {
    padding: '10px 18px',
    background: 'transparent',
    border: 'none',
    color: '#777',
    fontWeight: 600,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  installBtn: {
    padding: '10px 22px',
    background: '#6b432c',
    color: '#fff',
    borderRadius: '12px',
    border: 'none',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(107, 67, 44, 0.15)',
  }
};

// Add global slide up animation if not already existing
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { transform: translateY(100px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.append(style);
}
