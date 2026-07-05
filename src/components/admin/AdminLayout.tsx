'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AdminPeriodProvider } from './AdminPeriodContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const [state, setState] = useState<'loading' | 'admin' | 'unauthorized' | 'error'>('loading');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  if (state === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--cream)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 44,
            height: 44,
            border: '3px solid var(--admin-orange)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 18px',
            animation: 'admSpin 0.8s linear infinite',
          }} />
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: 20,
            color: 'rgba(17,17,17,0.5)',
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
    <AdminPeriodProvider>
      <div style={{
        ['--cream' as string]: '#E8DFC8',
        ['--cream-soft' as string]: '#F1EBDD',
        ['--card' as string]: '#FBF8F0',
        ['--lavender' as string]: '#9C93D6',
        ['--black' as string]: '#0A0A0A',
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--cream)',
        color: 'var(--ink)',
        position: 'relative',
      }}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 49,
            }}
          />
        )}

        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(v => !v)}
          isMobile={isMobile}
        />

        <div style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
        }}>
          <div className="adm-main-content" style={{
            padding: '2.25rem 2.5rem 3rem',
            flex: 1,
          }}>
            <TopBar onOpenSidebar={() => setSidebarOpen(v => !v)} />
            {children}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.adm-main-content{padding:1.25rem 1rem 2rem !important}}`}</style>
    </AdminPeriodProvider>
  );
}
