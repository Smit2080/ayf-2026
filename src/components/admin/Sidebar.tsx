'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard', icon: 'DA' },
  { href: '/admin/registrations', label: 'Registrations', icon: 'RG' },
  { href: '/admin/volunteers', label: 'Volunteers', icon: 'VO' },
  { href: '/admin/profiles', label: 'Profiles', icon: 'PR' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      background: 'rgba(26,26,26,0.8)',
      borderRight: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '20px 20px 16px',
        borderBottom: '1px solid var(--line)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src="/AYF_logo_clean.png" alt="AYF" style={{ height: 28, width: 'auto' }} />
          <span style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 16,
            letterSpacing: '0.04em',
            color: 'var(--orange)',
            textTransform: 'uppercase',
          }}>Admin</span>
        </Link>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {links.map((link) => {
          const active = path === link.href || (link.href !== '/admin' && path.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 14px',
                borderRadius: 6,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--orange)' : 'rgba(247,247,247,0.55)',
                background: active ? 'rgba(255,184,0,0.06)' : 'transparent',
                border: active ? '1px solid rgba(255,184,0,0.15)' : '1px solid transparent',
                transition: 'all 0.15s',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              <span style={{
                width: 26,
                height: 26,
                borderRadius: 4,
                background: active ? 'var(--orange)' : 'rgba(247,247,247,0.06)',
                color: active ? 'var(--ink)' : 'rgba(247,247,247,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Space Mono', monospace",
                fontSize: 9,
                fontWeight: 700,
                flexShrink: 0,
              }}>
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{
        padding: '12px 14px',
        borderTop: '1px solid var(--line)',
      }}>
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'Inter', sans-serif",
            fontSize: 12,
            color: 'rgba(247,247,247,0.35)',
            transition: 'color 0.15s',
            padding: '6px 0',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(247,247,247,0.7)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(247,247,247,0.35)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
