'use client';

import { useEffect, useRef, useState } from 'react';
import { useAdminPeriod } from './AdminPeriodContext';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const periods = ['Today', 'This Week', 'This Month', 'All Time'];

export default function TopBar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [adminName, setAdminName] = useState('Organizer');
  const { period, setPeriod } = useAdminPeriod();
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/debug/me')
      .then((r) => r.json())
      .then((d) => {
        if (d.user?.user_metadata?.full_name) {
          setAdminName(d.user.user_metadata.full_name);
        } else if (d.user?.email) {
          setAdminName(d.user.email.split('@')[0]);
        }
      })
      .catch(() => {});
  }, []);

  function toggleBell() {
    const opening = !showBellDropdown;
    setShowBellDropdown(opening);
    setShowDateDropdown(false);
    if (opening) {
      setActivityLoading(true);
      fetch('/api/admin/activity')
        .then((r) => r.json())
        .then((d) => { setActivities(d.activities || []); setActivityLoading(false); })
        .catch(() => setActivityLoading(false));
    }
  }

  function toggleDate() {
    setShowDateDropdown(!showDateDropdown);
    setShowBellDropdown(false);
  }

  return (
    <>
      {/* Global overlay for all dropdowns */}
      {(showDateDropdown || showBellDropdown) && (
        <div
          onClick={() => { setShowDateDropdown(false); setShowBellDropdown(false); }}
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
        />
      )}

      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Mobile hamburger */}
          <button
            onClick={onOpenSidebar}
            aria-label="Open sidebar menu"
            className="admin-hamburger"
            style={{
              display: 'none',
              background: 'none',
              border: '1px solid var(--admin-line)',
              borderRadius: 9999,
              width: 44,
              height: 44,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 4,
              cursor: 'pointer',
              padding: 0,
              color: 'var(--ink)',
            }}
          >
            <span style={{ display: 'block', width: 16, height: 2, background: 'var(--ink)', borderRadius: 1 }} />
            <span style={{ display: 'block', width: 16, height: 2, background: 'var(--ink)', borderRadius: 1 }} />
            <span style={{ display: 'block', width: 16, height: 2, background: 'var(--ink)', borderRadius: 1 }} />
          </button>

          <div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: 'clamp(1.6rem, 2.4vw, 2.1rem)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--ink)',
            }}>
              {getGreeting()}, <span style={{ color: 'var(--admin-orange)', fontStyle: 'italic' }}>{adminName}</span> ☀
            </div>
            <div style={{
              color: 'var(--admin-muted)',
              fontSize: '0.9rem',
              marginTop: '0.4rem',
              fontWeight: 500,
            }}>
              Here's what's happening with AYF 2026.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
          {/* Date pill */}
          <div ref={dateRef} style={{ position: 'relative' }}>
            <div
              onClick={toggleDate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'var(--card)',
                border: '1px solid var(--admin-line)',
                borderRadius: 9999,
                padding: '0.7rem 1.25rem',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--ink)',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {period === 'Today' ? `Today, ${formatDate()}` : period}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>

            {showDateDropdown && (
              <div className="adm-dropdown-right" style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100,
                background: 'var(--card)', border: '1px solid var(--admin-line)',
                borderRadius: 16, padding: 6, minWidth: 160,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              }}>
                {periods.map((p) => (
                  <div key={p}
                    onClick={() => { setPeriod(p); setShowDateDropdown(false); }}
                    style={{
                      padding: '0.6rem 1rem', borderRadius: 10, cursor: 'pointer',
                      fontSize: '0.8rem', fontWeight: p === period ? 700 : 500,
                      background: p === period ? 'var(--admin-lavender-pale)' : 'transparent',
                      color: 'var(--ink)',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={(e) => { if (p !== period) e.currentTarget.style.background = 'rgba(17,17,17,0.04)'; }}
                    onMouseLeave={(e) => { if (p !== period) e.currentTarget.style.background = 'transparent'; }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Notification bell */}
          <div ref={bellRef} style={{ position: 'relative' }}>
            <div
              onClick={toggleBell}
              className="admin-bell"
              style={{
                width: 44,
                height: 44,
                borderRadius: 9999,
                background: 'var(--card)',
                border: '1px solid var(--admin-line)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                cursor: 'pointer',
                color: 'var(--ink)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>

            {showBellDropdown && (
              <div className="adm-dropdown-right" style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100,
                background: 'var(--card)', border: '1px solid var(--admin-line)',
                borderRadius: 16, padding: 12, minWidth: 300,
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 8, padding: '0 4px' }}>
                  Notifications
                </div>
                {activityLoading ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-faint)', padding: '12px 4px', textAlign: 'center' }}>
                    Loading...
                  </div>
                ) : activities.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--admin-faint)', padding: '12px 4px', textAlign: 'center' }}>
                    No recent activity
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {activities.slice(0, 5).map((act: any, i: number) => (
                      <div key={i} style={{
                        display: 'flex', gap: '0.65rem', padding: '0.5rem 0.5rem',
                        borderRadius: 10, transition: 'background 0.1s',
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(17,17,17,0.03)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{
                          width: 28, height: 28, borderRadius: 9999, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem',
                          background: act.type === 'new-registration' ? 'var(--admin-orange-pale)' : 'var(--admin-lavender-pale)',
                          color: act.type === 'new-registration' ? 'var(--admin-orange)' : 'var(--admin-lavender)',
                        }}>
                          {act.type === 'new-registration' ? '👤' : act.type === 'new-volunteer' ? '👥' : '✓'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--ink)' }}>{act.title}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--admin-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.desc}</div>
                        </div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--admin-faint)', whiteSpace: 'nowrap', alignSelf: 'center' }}>{act.time}</div>
                      </div>
                    ))}
                  </div>
                )}
                {activities.length > 0 && (
                  <div style={{
                    marginTop: 6, paddingTop: 8, borderTop: '1px solid var(--admin-line)',
                    textAlign: 'center', fontSize: '0.72rem', fontWeight: 600, color: 'var(--admin-orange)',
                    cursor: 'pointer',
                  }}
                    onClick={() => { window.location.href = '/admin/registrations'; }}
                  >
                    View all activity
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          button[aria-label="Open sidebar menu"] { display: flex !important; }
          .adm-dropdown-right { right: auto !important; left: 0 !important; min-width: 160px !important; max-width: min(calc(100vw - 32px), 340px) !important; }
        }
        .admin-bell::after {
          content: '';
          position: absolute;
          top: 10px; right: 11px;
          width: 8px; height: 8px;
          border-radius: 9999px;
          background: var(--admin-orange);
          border: 2px solid var(--cream);
        }
      `}</style>
    </>
  );
}
