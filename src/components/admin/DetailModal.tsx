'use client';

import { useEffect } from 'react';

export default function DetailModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          zIndex: 1000,
          width: 'min(90vw, 600px)',
          maxHeight: '85vh',
          overflowY: 'auto',
          background: 'var(--card)',
          border: '1px solid var(--admin-line)',
          borderRadius: 22,
          padding: '32px 36px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', marginBottom: 24,
        }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900, fontSize: 'clamp(18px,2vw,24px)',
            letterSpacing: '-0.01em', color: 'var(--ink)',
          }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', padding: 4,
              color: 'var(--admin-faint)', fontSize: 22,
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
