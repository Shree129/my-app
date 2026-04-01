import React from 'react';

/**
 * ErrorBoundary — Catches React render errors and shows fallback UI
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.icon}>⚠️</div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.text}>
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            {this.state.error && (
              <p style={styles.errorDetail}>
                {this.state.error.message}
              </p>
            )}
            <div style={styles.actions}>
              <button style={styles.retryBtn} onClick={this.handleRetry}>
                Try Again
              </button>
              <button
                style={styles.homeBtn}
                onClick={() => window.location.href = '/'}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    minHeight: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: '#f7f4ef',
  },
  card: {
    textAlign: 'center',
    background: '#fff',
    padding: '48px 40px',
    borderRadius: 24,
    boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
    maxWidth: 480,
    width: '100%',
  },
  icon: {
    fontSize: '3.5rem',
    marginBottom: 16,
  },
  title: {
    fontSize: '1.5rem',
    color: '#3f2b20',
    marginBottom: 10,
    fontWeight: 700,
  },
  text: {
    color: '#78716c',
    fontSize: '1rem',
    marginBottom: 16,
    lineHeight: 1.6,
  },
  errorDetail: {
    padding: '10px 16px',
    background: '#fef2f2',
    borderRadius: 10,
    color: '#b91c1c',
    fontSize: '0.82rem',
    marginBottom: 24,
    fontFamily: 'monospace',
    wordBreak: 'break-word',
  },
  actions: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  retryBtn: {
    padding: '12px 28px',
    background: '#6b432c',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
  homeBtn: {
    padding: '12px 28px',
    background: '#fff',
    color: '#6b432c',
    border: '2px solid #6b432c',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: '0.95rem',
    cursor: 'pointer',
  },
};
