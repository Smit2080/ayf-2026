'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'Dashboard', icon: 'DA' },
  { href: '/admin/registrations', label: 'Registrations', icon: 'RG' },
  { href: '/admin/volunteers', label: 'Volunteers', icon: 'VO' },
  { href: '/admin/profiles', label: 'Profiles', icon: 'PR' },
];

function NavIcon({ type }: { type: string }) {
  const props = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'DA':
      return <svg {...props}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>;
    case 'RG':
      return <svg {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
    case 'VO':
      return <svg {...props}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case 'PR':
      return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
    default:
      return null;
  }
}

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside style={{
      width: 220,
      flexShrink: 0,
      background: 'rgba(13,13,15,0.85)',
      borderRight: '1px solid var(--line)',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflow: 'hidden',
      zIndex: 2,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        padding: '22px 20px 18px',
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

      <nav style={{
        flex: 1,
        padding: '16px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}>
        {links.map((link) => {
          const active = path === link.href || (link.href !== '/admin' && path.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 14px',
                borderRadius: 8,
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                color: active ? 'var(--orange)' : 'rgba(247,247,247,0.5)',
                textDecoration: 'none',
                position: 'relative',
                overflow: 'hidden',
                transition: 'color 0.15s, background 0.15s',
                background: active ? 'rgba(255,184,0,0.07)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'rgba(247,247,247,0.03)';
                  e.currentTarget.style.color = 'rgba(247,247,247,0.7)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'rgba(247,247,247,0.5)';
                }
              }}
            >
              {active && (
                <div style={{
                  position: 'absolute',
                  left: -4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 3,
                  height: 20,
                  borderRadius: 2,
                  background: 'var(--orange)',
                  boxShadow: '0 0 8px var(--orange)',
                }} />
              )}
              <span style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: active ? 'rgba(255,184,0,0.12)' : 'rgba(247,247,247,0.04)',
                color: active ? 'var(--orange)' : 'rgba(247,247,247,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative',
                transition: 'all 0.15s',
              }}>
                {active && (
                  <div style={{
                    position: 'absolute', inset: -4,
                    background: 'radial-gradient(50% 50% at 50% 50%, rgba(255,184,0,0.15), transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                  }} />
                )}
                <NavIcon type={link.icon} />
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
            padding: '6px 14px',
            borderRadius: 6,
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(247,247,247,0.7)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(247,247,247,0.35)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
