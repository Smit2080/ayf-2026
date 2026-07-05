'use client';

import { useEffect, useState } from 'react';

interface Analytics {
  daily: { date: string; registrations: number }[];
  dailyVolunteers: { date: string; applications: number }[];
  dailyProfiles: { date: string; signups: number }[];
  competitionStatuses: { status: string; count: number }[];
  volunteerStatuses: { status: string; count: number }[];
  competitionBreakdown: { name: string; count: number }[];
  totals: { registrations: number; volunteers: number; profiles: number };
  period: { from: string; to: string };
}

const statusColors: Record<string, string> = {
  'Pending Audition': '#FF5A1F',
  'Slot Allotted': '#B5AEE3',
  'Confirmed': '#9C93D6',
  'Failed': '#E0567A',
  'Pending Review': '#FF5A1F',
  'Shortlisted': '#B5AEE3',
  'Approved': '#9C93D6',
  'Rejected': '#E0567A',
};

const compColors = ['#FF5A1F', '#B5AEE3', '#FFB199', '#9C93D6', '#D9D4F0'];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const w = 160;
  const h = 40;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * (h - 4) - 2}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: 32, height: 32, border: '3px solid var(--admin-orange)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'dSpin 1s linear infinite' }} />
        <style>{`@keyframes dSpin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const regValues = data.daily.map((d) => d.registrations);
  const volValues = data.dailyVolunteers.map((d) => d.applications);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(24px, 2.5vw, 30px)', letterSpacing: '-0.01em', lineHeight: 1, color: 'var(--ink)' }}>
          <span style={{ color: 'var(--orange)' }}>Analytics</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginTop: 8, fontWeight: 500 }}>
          Last 30 days &mdash; {data.period.from} to {data.period.to}
        </p>
      </div>

      {/* Totals row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Registrations', value: data.totals.registrations, color: '#9C93D6' },
          { label: 'Total Volunteers', value: data.totals.volunteers, color: '#FF5A1F' },
          { label: 'Total Users', value: data.totals.profiles, color: '#9C93D6' },
        ].map((stat) => (
          <div key={stat.label} className="admin-card" style={{
            background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.25rem 1.5rem',
            display: 'flex', flexDirection: 'column', gap: '0.5rem',
          }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', fontWeight: 600 }}>{stat.label}</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '2.4rem', lineHeight: 1, color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Registration trend */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="admin-card" style={{
          background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1rem', marginBottom: '1rem', color: 'var(--ink)' }}>
            Daily Registrations
          </div>
          <div style={{ overflowX: 'auto' }}>
            <MiniSparkline data={regValues} color="#9C93D6" />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--admin-faint)', fontWeight: 600 }}>
              <span>{data.period.from}</span>
              <span>{data.period.to}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 4,
              fontSize: '0.68rem', color: 'var(--admin-faint)', fontWeight: 600,
            }}>
              {data.daily.filter((_, i) => i % 7 === 0 || i === data.daily.length - 1).map((d) => (
                <span key={d.date}>{d.date.slice(5)}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card" style={{
          background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1rem', marginBottom: '1rem', color: 'var(--ink)' }}>
            Daily Volunteer Applications
          </div>
          <div style={{ overflowX: 'auto' }}>
            <MiniSparkline data={volValues} color="#FF5A1F" />
          </div>
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--admin-faint)', fontWeight: 600 }}>
              <span>{data.period.from}</span>
              <span>{data.period.to}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 4,
              fontSize: '0.68rem', color: 'var(--admin-faint)', fontWeight: 600,
            }}>
              {data.dailyVolunteers.filter((_, i) => i % 7 === 0 || i === data.dailyVolunteers.length - 1).map((d) => (
                <span key={d.date}>{d.date.slice(5)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status breakdowns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Competition statuses */}
        <div className="admin-card" style={{
          background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1rem', marginBottom: '1rem', color: 'var(--ink)' }}>
            Registration Status Breakdown
          </div>
          {data.competitionStatuses.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--admin-faint)', padding: '1rem 0' }}>No data</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.competitionStatuses.map((s) => {
                const total = data.competitionStatuses.reduce((a, b) => a + b.count, 0);
                const pct = total > 0 ? (s.count / total) * 100 : 0;
                return (
                  <div key={s.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.status}</span>
                      <span style={{ fontWeight: 700, color: statusColors[s.status] || 'var(--ink)' }}>{s.count}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(17,17,17,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: statusColors[s.status] || '#9C93D6', borderRadius: 9999,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Volunteer statuses */}
        <div className="admin-card" style={{
          background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1rem', marginBottom: '1rem', color: 'var(--ink)' }}>
            Volunteer Status Breakdown
          </div>
          {data.volunteerStatuses.length === 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'var(--admin-faint)', padding: '1rem 0' }}>No data</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.volunteerStatuses.map((s) => {
                const total = data.volunteerStatuses.reduce((a, b) => a + b.count, 0);
                const pct = total > 0 ? (s.count / total) * 100 : 0;
                return (
                  <div key={s.status}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--ink)' }}>{s.status}</span>
                      <span style={{ fontWeight: 700, color: statusColors[s.status] || 'var(--ink)' }}>{s.count}</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(17,17,17,0.06)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: statusColors[s.status] || '#FF5A1F', borderRadius: 9999,
                        transition: 'width 0.4s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
