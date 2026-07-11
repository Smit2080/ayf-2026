'use client';

import { useEffect, useState } from 'react';

const compIcons: Record<string, string> = {
  'Science Exhibition': '📚',
  'Youth Parliament': '🏛️',
  'Startup Competition': '🚀',
  "Amravati's Got Talent": '🎭',
  'Reel Competition': '🏆',
};

export default function AdminCompetitions() {
  const [comps, setComps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/competitions')
      .then(async (r) => { if (!r.ok) throw new Error('Competitions fetch failed'); return r.json(); })
      .then((d) => { setComps(d.competitions || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 200, height: 30, background: 'rgba(17,17,17,0.06)', borderRadius: 8, animation: 'skPulse 1.5s ease-in-out infinite' }} />
          <div style={{ width: 300, height: 16, background: 'rgba(17,17,17,0.04)', borderRadius: 6, marginTop: 10, animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: '0.1s' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="admin-card" style={{
              background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
              display: 'flex', flexDirection: 'column', gap: '1rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(17,17,17,0.06)', animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: '60%', height: 18, background: 'rgba(17,17,17,0.06)', borderRadius: 6, animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
                  <div style={{ width: '40%', height: 12, background: 'rgba(17,17,17,0.04)', borderRadius: 4, marginTop: 6, animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                </div>
              </div>
              <div style={{ width: 60, height: 22, borderRadius: 9999, background: 'rgba(17,17,17,0.06)', animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
              <div style={{ height: 30, width: '40%', background: 'rgba(17,17,17,0.04)', borderRadius: 6, animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
            </div>
          ))}
        </div>
        <style>{`@keyframes skPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(24px, 2.5vw, 30px)', letterSpacing: '-0.01em', lineHeight: 1, color: 'var(--ink)' }}>
          <span style={{ color: 'var(--orange)' }}>Competitions</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginTop: 8, fontWeight: 500 }}>
          Manage competition details, track registrations, and control availability
        </p>
      </div>

      {comps.length === 0 ? (
        <div className="admin-card" style={{
          background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22,
          padding: '3rem', textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--admin-faint)', fontWeight: 600 }}>
            No competitions found
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {comps.map((comp: any) => {
            const pct = comp.max_participants ? Math.round((comp.registration_count / comp.max_participants) * 100) : 0;
            return (
              <div key={comp.id || comp.name} className="admin-card" style={{
                background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
                display: 'flex', flexDirection: 'column', gap: '1rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <span style={{ fontSize: '2rem', lineHeight: 1 }}>{compIcons[comp.name] || '🏆'}</span>
                    <div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.2rem', color: 'var(--ink)' }}>{comp.name}</div>
                      {comp.description && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', marginTop: 2 }}>{comp.description}</div>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                  padding: '0.4rem 0.85rem', borderRadius: 9999,
                  alignSelf: 'flex-start',
                  background: comp.registration_open ? 'var(--admin-lavender-pale)' : 'var(--admin-orange-pale)',
                  color: comp.registration_open ? 'var(--admin-lavender)' : 'var(--admin-orange)',
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
                  {comp.registration_open ? 'Open' : 'Closed'}
                </div>

                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '2rem', color: 'var(--ink)', lineHeight: 1 }}>{comp.registration_count}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--admin-muted)', fontWeight: 600, marginTop: 2 }}>Registrations</div>
                  </div>
                  {comp.max_participants && (
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--admin-faint)', marginBottom: 4 }}>
                        <span>Capacity</span>
                        <span>{comp.registration_count}/{comp.max_participants}</span>
                      </div>
                      <div style={{
                        height: 6, background: 'rgba(17,17,17,0.06)', borderRadius: 9999, overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', width: `${Math.min(pct, 100)}%`,
                          background: 'var(--admin-lavender)', borderRadius: 9999,
                          transition: 'width 0.4s ease',
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
