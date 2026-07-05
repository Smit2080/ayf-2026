'use client';

import { useEffect, useRef, useState } from 'react';

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

function AnalyticsChart({ data, color, label }: { data: { date: string; registrations?: number; applications?: number }[]; color: string; label: string }) {
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const svgRef = useRef<SVGSVGElement>(null);
  const values = data.map((d) => (d.registrations ?? d.applications ?? 0));
  const maxVal = Math.max(...values, 1);
  const pad = 20;
  const ch = 200;
  const n = data.length;
  if (n < 2) return <div style={{ height: ch, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-faint)', fontSize: '0.8rem' }}>Insufficient data</div>;
  const xStep = (620 - 40) / (n - 1);
  const linePoints = data.map((d, i) => {
    const x = 20 + i * xStep;
    const y = ch - pad - ((d.registrations ?? d.applications ?? 0) / maxVal) * (ch - 2 * pad);
    return `${x},${y}`;
  });
  const areaPath = linePoints.join(' ') + ` ${20 + (n - 1) * xStep},${ch - pad} 20,${ch - pad} Z`;
  const linePath = linePoints.join(' ');
  const gridYs = [25, 65, 105, 145, 185];

  function onMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 620;
    const rawIdx = (relX - 20) / xStep;
    const idx = Math.max(0, Math.min(n - 1, Math.round(rawIdx)));
    setHoveredIdx(idx);
  }

  const hoveredPoint = hoveredIdx >= 0 && hoveredIdx < n ? data[hoveredIdx] : null;
  const hoveredX = hoveredIdx >= 0 ? 20 + hoveredIdx * xStep : 0;
  const hoveredY = hoveredPoint
    ? ch - pad - ((hoveredPoint.registrations ?? hoveredPoint.applications ?? 0) / maxVal) * (ch - 2 * pad)
    : 0;

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* Tooltip */}
      {hoveredPoint && (
        <div style={{
          position: 'absolute', zIndex: 10, pointerEvents: 'none',
          left: `calc(${(hoveredX / 620) * 100}% - 45px)`,
          top: `calc(${(hoveredY / ch) * 100}% - 48px)`,
          background: 'var(--admin-black)',
          color: 'var(--cream)',
          borderRadius: 10,
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 600,
          textAlign: 'center',
          lineHeight: 1.4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          whiteSpace: 'nowrap',
        }}>
          <div>{hoveredPoint.registrations ?? hoveredPoint.applications ?? 0}</div>
          <div style={{ opacity: 0.6, fontWeight: 400, fontSize: '0.68rem' }}>{hoveredPoint.date}</div>
        </div>
      )}
      <svg ref={svgRef} viewBox="0 0 620 200" width="100%" height={ch} preserveAspectRatio="xMidYMid meet"
        onMouseMove={onMouseMove}
        onMouseLeave={() => setHoveredIdx(-1)}
        style={{ cursor: 'pointer' }}>
        <defs><linearGradient id={`areaF-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient></defs>
        <g stroke="#111111" strokeOpacity="0.06">
          {gridYs.map((y) => <line key={y} x1="0" y1={y} x2={620} y2={y} />)}
        </g>
        <path d={areaPath} fill={`url(#areaF-${label})`} />
        <polyline points={linePath} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {hoveredIdx >= 0 && (
          <line x1={hoveredX} y1={0} x2={hoveredX} y2={ch - pad}
            stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
        )}
        <g fill={color}>
          {data.map((d, i) => {
            const x = 20 + i * xStep;
            const y = ch - pad - ((d.registrations ?? d.applications ?? 0) / maxVal) * (ch - 2 * pad);
            const isHovered = i === hoveredIdx;
            return (
              <g key={d.date}>
                {isHovered && (
                  <circle cx={x} cy={y} r="7" fill="white" stroke={color} strokeWidth="3" opacity="0.9" />
                )}
                <circle cx={x} cy={y} r={isHovered ? 4.5 : 3}
                  fill={color} opacity={isHovered ? 1 : 0.5}
                  style={{ transition: 'r 0.12s, opacity 0.12s' }}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
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
      <div className="adm-an-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}>
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
      <div className="adm-an-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
        <div className="admin-card" style={{
          background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem',
        }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1rem', marginBottom: '1rem', color: 'var(--ink)' }}>
            Daily Registrations
          </div>
          <AnalyticsChart data={data.daily} color="#9C93D6" label="reg" />
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--admin-faint)', fontWeight: 600 }}>
              <span>{data.period.from}</span>
              <span>{data.period.to}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 4,
              fontSize: '0.65rem', color: 'var(--admin-faint)', fontWeight: 600,
            }}>
              {data.daily.filter((_, i) => {
                const step = Math.max(1, Math.floor(data.daily.length / 3));
                return i % step === 0 || i === data.daily.length - 1;
              }).map((d) => (
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
          <AnalyticsChart data={data.dailyVolunteers} color="#FF5A1F" label="vol" />
          <div style={{ marginTop: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--admin-faint)', fontWeight: 600 }}>
              <span>{data.period.from}</span>
              <span>{data.period.to}</span>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', marginTop: 4,
              fontSize: '0.65rem', color: 'var(--admin-faint)', fontWeight: 600,
            }}>
              {data.dailyVolunteers.filter((_, i) => {
                const step = Math.max(1, Math.floor(data.dailyVolunteers.length / 3));
                return i % step === 0 || i === data.dailyVolunteers.length - 1;
              }).map((d) => (
                <span key={d.date}>{d.date.slice(5)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status breakdowns */}
      <div className="adm-an-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
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
      <style>{`
        @media (max-width: 900px) {
          .adm-an-grid-3 { grid-template-columns: 1fr !important; }
          .adm-an-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
