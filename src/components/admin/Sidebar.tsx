'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: 'DA' },
  { href: '/admin/registrations', label: 'Registrations', icon: 'PA' },
  { href: '/admin/volunteers', label: 'Volunteers', icon: 'VO' },
  { href: '/admin/profiles', label: 'Users', icon: 'US' },
  { href: '/admin/analytics', label: 'Analytics', icon: 'AN' },
  { href: '/admin/settings', label: 'Settings', icon: 'SE' },
];

function NavIcon({ type }: { type: string }) {
  const p = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'DA':
      return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>;
    case 'PA':
      return <svg {...p}><path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4" /><path d="M9 3v6H3" /><path d="M13 3l7 7" /></svg>;
    case 'VO':
      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case 'CO':
      return <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    case 'AN':
      return <svg {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
    case 'US':
      return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>;
    case 'SE':
      return <svg {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
    default:
      return null;
  }
}

export default function Sidebar({ isOpen, onToggle, isMobile }: { isOpen: boolean; onToggle: () => void; isMobile: boolean }) {
  const path = usePathname();
  const router = useRouter();
  const [adminName, setAdminName] = useState('Organizer');
  const [adminEmail, setAdminEmail] = useState('');

  useEffect(() => {
    fetch('/api/debug/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.user_metadata?.full_name) setAdminName(d.user.user_metadata.full_name);
        else if (d.user?.email) setAdminName(d.user.email.split('@')[0]);
        if (d.user?.email) setAdminEmail(d.user.email);
      })
      .catch(() => {});
  }, []);

  const initial = adminName.charAt(0).toUpperCase();

  async function handleLogout() {
    const client = createClient();
    await client.auth.signOut();
    router.push('/');
  }

  const sidebarStyle: React.CSSProperties = isMobile ? {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    zIndex: 50,
    width: 260,
    flexShrink: 0,
    background: 'var(--admin-black)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.25s ease',
  } : {
    width: 260,
    flexShrink: 0,
    background: 'var(--admin-black)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflow: 'hidden',
    zIndex: 2,
  };

  return (
    <aside style={sidebarStyle}>
      {/* Brand */}
      <div style={{ padding: '2rem 1.25rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, padding: '0 0.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'baseline', gap: 6, textDecoration: 'none' }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: '1.9rem',
              lineHeight: 1,
              textTransform: 'uppercase',
              color: 'var(--cream)',
            }}>AYF</span>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: '1.9rem',
              color: 'var(--admin-orange)',
              fontStyle: 'italic',
            }}>2026</span>
          </Link>
          {isMobile && (
            <button
              onClick={onToggle}
              aria-label="Close sidebar"
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(232,223,200,0.4)',
                cursor: 'pointer',
                fontSize: 20,
                padding: '4px 8px',
                marginLeft: 'auto',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              ✕
            </button>
          )}
        </div>
        <div style={{
          fontSize: '0.62rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(232,223,200,0.45)',
          padding: '0.35rem 0.5rem 0',
          fontWeight: 600,
        }}>Amravati Youth Festival</div>

        <div style={{
          fontSize: '0.68rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(232,223,200,0.35)',
          fontWeight: 700,
          padding: '0.5rem',
          marginTop: '2.5rem',
        }}>Admin Panel</div>
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        padding: '0 1.25rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.3rem',
      }}>
        {links.map((link) => {
          const active = path === link.href || (link.href !== '/admin' && path.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => isMobile && onToggle()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.85rem 1rem',
                borderRadius: 9999,
                fontSize: '0.85rem',
                fontWeight: 600,
                color: active ? 'var(--ink)' : 'rgba(232,223,200,0.65)',
                background: active ? 'var(--admin-lavender)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(232,223,200,0.06)';
                  e.currentTarget.style.color = 'var(--cream)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(232,223,200,0.65)';
                }
              }}
            >
              <NavIcon type={link.icon} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout Footer */}
      <div style={{
        borderTop: '1px solid rgba(232,223,200,0.12)',
        padding: '1.25rem',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          padding: '0.4rem',
        }}>
          <div style={{
            width: 38, height: 38,
            borderRadius: 9999,
            background: 'var(--admin-lavender)',
            color: 'var(--ink)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.85rem',
            flexShrink: 0,
          }}>
            {initial}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--cream)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminName}</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(232,223,200,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adminEmail || 'admin@ayf2026.in'}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 0.5rem 0.2rem',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'rgba(232,223,200,0.55)',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            fontFamily: "'Inter', sans-serif",
            width: '100%',
            textAlign: 'left',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--admin-orange)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(232,223,200,0.55)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
