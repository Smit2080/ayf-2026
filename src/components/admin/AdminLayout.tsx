'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Sidebar from './Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [state, setState] = useState<'loading' | 'admin' | 'unauthorized' | 'error'>('loading');

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        setState('unauthorized');
        return;
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (profile?.role === 'admin') {
        setState('admin');
      } else {
        setState('unauthorized');
      }
    }).catch(() => setState('error'));
  }, []);

  if (state === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          opacity: 0.04, mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
        <div style={{
          position: 'absolute', top: '-30%', left: '-20%', width: '80%', height: '100%',
          background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(123,44,255,0.15), transparent 60%)',
          pointerEvents: 'none', zIndex: 0,
        }} />
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 44,
            height: 44,
            border: '3px solid var(--orange)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 18px',
            animation: 'admSpin 0.8s linear infinite',
          }} />
          <div style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 20,
            letterSpacing: '0.05em',
            color: 'rgba(247,247,247,0.6)',
          }}>Loading Admin Panel...</div>
          <style>{`@keyframes admSpin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  if (state === 'unauthorized') {
    window.location.href = '/register';
    return null;
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--ink)',
      color: 'var(--white)',
      position: 'relative',
    }}>
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        opacity: 0.04, mixBlendMode: 'overlay',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
      <div style={{
        position: 'fixed', top: '-40%', left: '-30%', width: '160%', height: '200%',
        zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 50% 40% at 30% 40%, rgba(123,44,255,0.25), transparent 60%),
          radial-gradient(ellipse 40% 50% at 70% 60%, rgba(123,44,255,0.12), transparent 50%),
          radial-gradient(ellipse 30% 40% at 50% 20%, rgba(160,80,255,0.15), transparent 50%)
        `,
        filter: 'blur(80px)',
      }} />
      <Sidebar />
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '32px',
        minWidth: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        {children}
      </div>
    </div>
  );
}
