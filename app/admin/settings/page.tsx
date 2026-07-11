'use client';

import { useEffect, useState } from 'react';

export default function AdminSettings() {
  const [comps, setComps] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(async (r) => { if (!r.ok) throw new Error('Settings fetch failed'); return r.json(); })
      .then((d) => { setComps(d.competitions || []); setSettings(d.settings || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function toggleCompetition(id: string, current: boolean) {
    setSaving(id);
    try {
      await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competition_id: id, registration_open: !current }),
      });
      setComps((prev) => prev.map((c) => c.id === id ? { ...c, registration_open: !current } : c));
    } finally {
      setSaving(null);
    }
  }

  if (loading) {
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 140, height: 30, background: 'rgba(17,17,17,0.06)', borderRadius: 8, animation: 'skPulse 1.5s ease-in-out infinite' }} />
          <div style={{ width: 260, height: 16, background: 'rgba(17,17,17,0.04)', borderRadius: 6, marginTop: 10, animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: '0.1s' }} />
        </div>
        <div className="admin-card" style={{
          background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <div style={{ width: '50%', height: 20, background: 'rgba(17,17,17,0.06)', borderRadius: 6, animation: 'skPulse 1.5s ease-in-out infinite' }} />
          <div style={{ width: '70%', height: 14, background: 'rgba(17,17,17,0.04)', borderRadius: 4, marginTop: 8, marginBottom: 20, animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: '0.1s' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1rem', border: '1px solid var(--admin-line)', borderRadius: 16,
              }}>
                <div>
                  <div style={{ width: 160, height: 16, background: 'rgba(17,17,17,0.06)', borderRadius: 6, animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
                  <div style={{ width: 60, height: 12, background: 'rgba(17,17,17,0.04)', borderRadius: 4, marginTop: 6, animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.15}s` }} />
                </div>
                <div style={{ width: 48, height: 26, borderRadius: 9999, background: 'rgba(17,17,17,0.06)', animation: 'skPulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }} />
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes skPulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(24px, 2.5vw, 30px)', letterSpacing: '-0.01em', lineHeight: 1, color: 'var(--ink)' }}>
          <span style={{ color: 'var(--orange)' }}>Settings</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginTop: 8, fontWeight: 500 }}>
          Manage system configuration and competition availability
        </p>
      </div>

      {/* Competition Registration Toggles */}
      <div className="admin-card" style={{
        background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
        marginBottom: '1.5rem',
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.15rem', marginBottom: '0.25rem', color: 'var(--ink)' }}>
          Competition Registration
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--admin-muted)', marginBottom: '1.25rem' }}>
          Toggle whether each competition is accepting new registrations
        </div>

        {comps.length === 0 ? (
          <div style={{ fontSize: '0.8rem', color: 'var(--admin-faint)', padding: '1rem 0' }}>
            No competitions configured yet. Run the database migration to seed competition data.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {comps.map((comp: any) => (
              <div key={comp.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1rem', border: '1px solid var(--admin-line)', borderRadius: 16,
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--ink)' }}>{comp.name}</div>
                  <div style={{ fontSize: '0.72rem', color: comp.registration_open ? 'var(--admin-lavender)' : 'var(--admin-orange)', fontWeight: 600 }}>
                    {comp.registration_open ? 'Open' : 'Closed'}
                  </div>
                </div>
                <button
                  onClick={() => toggleCompetition(comp.id, comp.registration_open)}
                  disabled={saving === comp.id}
                  style={{
                    position: 'relative',
                    width: 48, height: 26,
                    borderRadius: 9999,
                    border: 'none',
                    cursor: 'pointer',
                    background: comp.registration_open ? 'var(--admin-lavender)' : 'rgba(17,17,17,0.12)',
                    transition: 'background 0.2s',
                    padding: 0,
                  }}
                >
                  <span style={{
                    position: 'absolute',
                    top: 3, left: comp.registration_open ? 24 : 3,
                    width: 20, height: 20,
                    borderRadius: '50%',
                    background: 'var(--card)',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* System Info */}
      <div className="admin-card" style={{
        background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
      }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--ink)' }}>
          System Information
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { label: 'Application', value: 'AYF 2026 Admin Panel' },
            { label: 'Status', value: 'Active' },
            { label: 'Competitions Configured', value: String(comps.length) },
          ].map((row) => (
            <div key={row.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.65rem 0', borderBottom: '1px solid var(--admin-line)',
              fontSize: '0.85rem',
            }}>
              <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{row.label}</span>
              <span style={{ color: 'var(--admin-muted)' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
