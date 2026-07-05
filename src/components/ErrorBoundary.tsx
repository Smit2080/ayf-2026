'use client';

import { Component } from 'react';

export default class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, background: '#0D0D0F', color: '#F7F7F7', fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ fontSize: 28, fontFamily: 'monospace' }}>:(</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Something went wrong</div>
          <button onClick={() => window.location.reload()} style={{ marginTop: 8, padding: '8px 24px', borderRadius: 9999, border: '1px solid rgba(247,247,247,0.3)', background: 'transparent', color: '#F7F7F7', cursor: 'pointer', fontSize: 14 }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
