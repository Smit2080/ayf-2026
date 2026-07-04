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
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid var(--purple)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'admSpin 1s linear infinite',
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
    }}>
      <Sidebar />
      <div style={{ flex: 1, overflow: 'auto', padding: '32px', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
