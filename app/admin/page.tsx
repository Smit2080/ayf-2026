'use client';

import { useEffect, useRef, useState } from 'react';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/admin/StatusBadge';
import { useAdminPeriod } from '@/components/admin/AdminPeriodContext';

interface Stats {
  totalUsers: number;
  totalRegistrations: number;
  totalVolunteers: number;
  pendingAuditions: number;
  slotAllotted: number;
  confirmedComps: number;
  pendingReviews: number;
  shortlisted: number;
  approvedVols: number;
  todayRegistrations: number;
  todayDelta: string;
  competitionBreakdown: Record<string, number>;
}

const sampleRegistrations = [
  { name: 'Navin Shanke', initials: 'NS', competition: 'Startup Competition', compColor: '#6C5CE7', college: 'PRMITR Amravati', phone: '+91 98765 43210', status: 'pending', date: '22 Jun 2026' },
  { name: 'Aman Deshmukh', initials: 'AD', competition: 'Science Exhibition', compColor: '#2EC4B6', college: 'SGBAU Amravati', phone: '+91 91234 56789', status: 'approved', date: '22 Jun 2026' },
  { name: 'Prachi Kale', initials: 'PK', competition: "Amravati's Got Talent", compColor: '#FF5A1F', college: 'Sipna COET', phone: '+91 99887 77665', status: 'pending', date: '21 Jun 2026' },
  { name: 'Rohan Kadu', initials: 'RK', competition: 'Youth Parliament', compColor: '#FFB347', college: 'HVPM College', phone: '+91 87654 32109', status: 'approved', date: '21 Jun 2026' },
  { name: 'Sakshi Bhoyar', initials: 'SB', competition: 'Reel Competition', compColor: '#FF6B6B', college: 'SGBAU Amravati', phone: '+91 93123 45678', status: 'rejected', date: '20 Jun 2026' },
];

const activities = [
  { icon: 'user-plus', color: 'var(--admin-orange)', bg: 'var(--admin-orange-pale)', title: 'New registration', time: '2m ago', desc: 'Aman Deshmukh registered for Science Exhibition' },
  { icon: 'check', color: 'var(--admin-lavender)', bg: 'var(--admin-lavender-pale)', title: 'Status updated', time: '8m ago', desc: "Prachi Kale's status changed to Approved" },
  { icon: 'users', color: 'var(--admin-orange)', bg: 'var(--admin-orange-pale)', title: 'New volunteer application', time: '16m ago', desc: 'Rohit Wankhade applied as Volunteer' },
  { icon: 'x-circle', color: 'var(--admin-reject)', bg: 'var(--admin-reject-pale)', title: 'Status updated', time: '22m ago', desc: "Sakshi Bhoyar's status changed to Rejected" },
];

function ActivityIcon({ type }: { type: string }) {
  const p = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'user-plus': return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>;
    case 'check': return <svg {...p}><polyline points="20 6 9 17 4 12" /></svg>;
    case 'users': return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
    case 'x-circle': return <svg {...p}><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>;
    default: return null;
  }
}

const compColors = ['#2EC4B6', '#FFB347', '#6C5CE7', '#FF5A1F', '#FF6B6B'];
const compNames = ['Science Exhibition', 'Youth Parliament', 'Startup Competition', "Amravati's Got Talent", 'Reel Competition'];

const compColorMap: Record<string, string> = {
  'Science Exhibition': '#2EC4B6',
  'Youth Parliament': '#FFB347',
  'Startup Competition': '#6C5CE7',
  "Amravati's Got Talent": '#FF5A1F',
  'Reel Competition': '#FF6B6B',
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
}

export default function AdminDashboard() {
  const { period } = useAdminPeriod();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentRegs, setRecentRegs] = useState<any[]>([]);
  const [dailyData, setDailyData] = useState<{ date: string; registrations: number }[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [donutFilter, setDonutFilter] = useState('All');
  const [showDonutDropdown, setShowDonutDropdown] = useState(false);
  const [hoveredComp, setHoveredComp] = useState<string | null>(null);
  const [regSearch, setRegSearch] = useState('');
  const [regCompetition, setRegCompetition] = useState('All');
  const [regStatus, setRegStatus] = useState('All');
  const [regPage, setRegPage] = useState(1);
  const [showRegCompDropdown, setShowRegCompDropdown] = useState(false);
  const [showRegStatusDropdown, setShowRegStatusDropdown] = useState(false);
  const [editStatusRow, setEditStatusRow] = useState<string | null>(null);

  function getPeriodParam(p: string) {
    switch (p) {
      case 'Today': return 'today';
      case 'This Week': return 'week';
      case 'This Month': return 'month';
      default: return 'all';
    }
  }

  function fetchAll(p: string) {
    const pp = getPeriodParam(p);
    Promise.all([
      fetch('/api/admin/stats').then((r) => r.json()),
      fetch(`/api/admin/registrations?perPage=5&sort=created_at&order=desc&period=${pp}`).then((r) => r.json()),
      fetch('/api/admin/analytics').then((r) => r.json()),
      fetch(`/api/admin/activity?period=${pp}`).then((r) => r.json()),
    ])
      .then(([s, r, a, ac]) => {
        setStats(s);
        setRecentRegs(r.data || []);
        setDailyData(a.daily || []);
        setRecentActivity(ac.activities || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }

  useEffect(() => { fetchAll(period); const id = setInterval(() => fetchAll(period), 30000); return () => clearInterval(id); }, [period]);

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--admin-orange)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'dSpin 1s linear infinite' }} />
          <style>{`@keyframes dSpin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  const compEntries = Object.entries(stats.competitionBreakdown || {});
  const totalCompReg = compEntries.reduce((s, [, c]) => s + c, 0);
  const allChartEntries = compEntries.length > 0
    ? compEntries
    : compNames.map((n, i) => [n, Math.floor(Math.random() * 50 + 10)] as [string, number]);
  const chartEntries = donutFilter === 'All'
    ? allChartEntries
    : allChartEntries.filter(([name]) => name === donutFilter);
  const circumference = 2 * Math.PI * 15.9;

  const allRegs = recentRegs.length > 0 ? recentRegs : sampleRegistrations;
  const regUniqueComps = [...new Set(allRegs.map((r: any) => r.competition_name || r.competition).filter(Boolean))];
  const filteredRegs = allRegs.filter((r: any) => {
    const name = ((r.profiles?.full_name || r.name || '') as string).toLowerCase();
    const college = ((r.profiles?.college || r.college || '') as string).toLowerCase();
    const phone = ((r.profiles?.whatsapp_number || r.phone || '') as string).toLowerCase();
    const q = regSearch.toLowerCase();
    if (q && !name.includes(q) && !college.includes(q) && !phone.includes(q)) return false;
    if (regCompetition !== 'All' && (r.competition_name || r.competition) !== regCompetition) return false;
    if (regStatus !== 'All' && (r.status || '').toLowerCase() !== regStatus.toLowerCase()) return false;
    return true;
  });
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(filteredRegs.length / perPage));
  const safePage = Math.min(regPage, totalPages);
  const pagedRegs = filteredRegs.slice((safePage - 1) * perPage, safePage * perPage);

  return (
    <div>
      {/* ============ STAT CARDS ============ */}
      <div className="adm-grid-4" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.25rem',
        marginBottom: '1.5rem',
      }}>
        <StatsCard
          label="Total Registrations"
          value={stats.totalRegistrations}
          icon="users"
          delta={`${stats.confirmedComps} confirmed`}
          deltaUp
        />
        <StatsCard
          label="Registrations Today"
          value={stats.todayRegistrations}
          icon="calendar"
          delta={stats.todayDelta}
          sparkColor="#FF5A1F"
          iconBg="var(--admin-orange-pale)"
          iconColor="var(--admin-orange)"
        />
        <StatsCard
          label="Volunteers"
          value={stats.totalVolunteers}
          icon="volunteers"
          delta={`${stats.approvedVols} approved`}
          deltaUp
        />
        <StatsCard
          label="Competitions"
          value={compEntries.length || 5}
          icon="trophy"
          delta="Active"
          sparkColor="#FF5A1F"
          iconBg="var(--admin-orange-pale)"
          iconColor="var(--admin-orange)"
        />
      </div>

      {/* ============ MID GRID ============ */}
      <div className="adm-grid-3" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.25rem',
        marginBottom: '1.5rem',
        alignItems: 'stretch',
        minWidth: 0,
      }}>
        {/* Trend Chart */}
        <div style={{ minWidth: 0 }}>
          <TrendChart dailyData={dailyData} period={period} />
        </div>

        {/* Donut Chart */}
        <div style={{ minWidth: 0 }}>
          <div className="admin-card" style={{ background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)' }}>Registrations by Competition</div>
              <div style={{ position: 'relative' }}>
                <div onClick={() => setShowDonutDropdown(!showDonutDropdown)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--admin-line)', borderRadius: 9999, padding: '0.45rem 0.9rem', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink)', cursor: 'pointer', userSelect: 'none' }}>
                  {donutFilter}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                </div>
                {showDonutDropdown && (
                  <>{/* overlay */}<div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowDonutDropdown(false)} />
                    <div className="adm-dropdown" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100, background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 16, padding: 6, minWidth: 160, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                      <div onClick={() => { setDonutFilter('All'); setShowDonutDropdown(false); }}
                        style={{ padding: '0.5rem 0.9rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.72rem', fontWeight: donutFilter === 'All' ? 700 : 500, background: donutFilter === 'All' ? 'var(--admin-lavender-pale)' : 'transparent', color: 'var(--ink)' }}>
                        All
                      </div>
                      {allChartEntries.map(([name]) => (
                        <div key={name} onClick={() => { setDonutFilter(name); setShowDonutDropdown(false); }}
                          style={{ padding: '0.5rem 0.9rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.72rem', fontWeight: donutFilter === name ? 700 : 500, background: donutFilter === name ? 'var(--admin-lavender-pale)' : 'transparent', color: 'var(--ink)' }}>
                          {name}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="adm-donut-flex" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', position: 'relative' }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                {/* Tooltip */}
                {hoveredComp && (() => {
                  const entry = allChartEntries.find(([n]) => n === hoveredComp);
                  if (!entry) return null;
                  const [, c] = entry;
                  const pct = totalCompReg > 0 ? ((c as number) / totalCompReg * 100).toFixed(1) : '0';
                  return (
                    <div style={{
                      position: 'absolute', zIndex: 10, pointerEvents: 'none',
                      top: -32, left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--admin-black)', color: 'var(--cream)',
                      borderRadius: 10, padding: '0.4rem 0.7rem',
                      fontSize: '0.72rem', fontWeight: 600, textAlign: 'center',
                      lineHeight: 1.3, whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    }}>
                      <div>{hoveredComp}</div>
                      <div style={{ opacity: 0.7, fontWeight: 400 }}>{c as number} ({pct}%)</div>
                    </div>
                  );
                })()}
                <svg width="140" height="140" viewBox="0 0 42 42">
                  {(() => {
                    let cumOffset = 0;
                    const total = chartEntries.reduce((s: number, [, c]: [string, number]) => s + (c as number), 0);
                    return chartEntries.map(([name, count]: [string, number], i: number) => {
                      const pct = (count as number) / total;
                      const dashLen = pct * circumference;
                      const offset = -cumOffset;
                      cumOffset += dashLen;
                      const isHovered = hoveredComp === name;
                      const color = compColorMap[name] || compColors[i % compColors.length];
                      return (
                        <g key={name}>
                          {/* Invisible wide hit target for hover */}
                          <circle cx="21" cy="21" r="15.9" fill="transparent"
                            stroke="transparent" strokeWidth="20"
                            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                            strokeDashoffset={offset}
                            transform="rotate(-90 21 21)"
                            style={{ cursor: 'pointer' }}
                            onMouseEnter={() => setHoveredComp(name)}
                            onMouseLeave={() => setHoveredComp(null)}
                          />
                          {isHovered && (
                            <circle cx="21" cy="21" r="17" fill="none" stroke={color} strokeWidth="11" opacity="0.2" transform="rotate(-90 21 21)" />
                          )}
                          <circle cx="21" cy="21" r="15.9" fill="transparent"
                            stroke={color}
                            strokeWidth={isHovered ? 9 : 7}
                            strokeDasharray={`${dashLen} ${circumference - dashLen}`}
                            strokeDashoffset={offset}
                            transform="rotate(-90 21 21)"
                            opacity={hoveredComp && !isHovered ? 0.25 : 1}
                            pointerEvents="none"
                            style={{ transition: 'stroke-width 0.15s, opacity 0.15s' }}
                          />
                        </g>
                      );
                    });
                  })()}
                </svg>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {chartEntries.map(([name, count]: [string, number], i: number) => {
                  const pct = totalCompReg > 0 ? ((count as number) / totalCompReg * 100).toFixed(1) : '0';
                  const isHovered = hoveredComp === name;
                  const color = compColorMap[name] || compColors[i % compColors.length];
                  return (
                    <div key={name}
                      onMouseEnter={() => setHoveredComp(name)}
                      onMouseLeave={() => setHoveredComp(null)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem',
                        padding: '0.3rem 0.5rem', borderRadius: 10, cursor: 'default',
                        background: isHovered ? 'rgba(0,0,0,0.03)' : 'transparent',
                        opacity: hoveredComp && !isHovered ? 0.4 : 1,
                        transition: 'background 0.15s, opacity 0.15s',
                      }}>
                      <span style={{ width: 9, height: 9, borderRadius: 9999, background: color, flexShrink: 0 }} />
                      <span style={{ fontWeight: 700, flex: 1, color: 'var(--ink)' }}>{name}</span>
                      <span style={{
                        color: 'var(--admin-muted)', fontWeight: 600, fontSize: '0.75rem',
                        background: isHovered ? 'var(--admin-lavender-pale)' : 'transparent',
                        padding: isHovered ? '0.15rem 0.5rem' : '0',
                        borderRadius: 9999,
                        transition: 'background 0.15s, padding 0.15s',
                      }}>{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ minWidth: 0 }}>
          <div className="admin-card" style={{ background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)' }}>Quick Actions</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                { icon: 'download', label: 'Export CSV', sub: 'Download as CSV', bg: 'var(--admin-lavender-pale)', color: 'var(--admin-lavender)', action: () => window.open('/api/admin/export?type=registrations&format=csv', '_blank') },
                { icon: 'file', label: 'Export Excel', sub: 'Download as Excel', bg: 'var(--admin-orange-pale)', color: 'var(--admin-orange)', action: () => window.open('/api/admin/export?type=registrations&format=xlsx', '_blank') },
                { icon: 'file-text', label: 'Export Volunteers', sub: 'Download as CSV', bg: 'var(--admin-lavender-pale)', color: 'var(--admin-lavender)', action: () => window.open('/api/admin/export?type=volunteers&format=csv', '_blank') },
                { icon: 'printer', label: 'Print Table', sub: 'Print current view', bg: 'var(--admin-orange-pale)', color: 'var(--admin-orange)', action: () => window.print() },
              ].map((action) => (
                <div key={action.label} onClick={action.action} style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  padding: '0.9rem', border: '1px solid var(--admin-line)',
                  borderRadius: 16, cursor: 'pointer', transition: 'border-color 0.2s ease',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--admin-lavender)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--admin-line)'}
                >
                  <div style={{
                    width: 38, height: 38, borderRadius: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: action.bg, color: action.color, flexShrink: 0,
                  }}>
                    <ActionSvg type={action.icon} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>{action.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--admin-muted)' }}>{action.sub}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', opacity: 0.35 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ============ BOTTOM GRID ============ */}
      <div className="adm-grid-2" style={{
        display: 'grid',
        gridTemplateColumns: '2.1fr 1fr',
        gap: '1.25rem',
        alignItems: 'start',
      }}>
        {/* Recent Registrations Table */}
        <div className="admin-card" style={{ background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)' }}>Recent Registrations</div>
          </div>

          {/* Table toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            marginBottom: '1.25rem', flexWrap: 'wrap',
          }}>
            <div style={{
              flex: 1, minWidth: 200,
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              border: '1px solid var(--admin-line)', borderRadius: 9999,
              padding: '0.65rem 1.1rem', fontSize: '0.8rem',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}>
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Search name, college, phone..."
                value={regSearch}
                onChange={(e) => { setRegSearch(e.target.value); setRegPage(1); }}
                style={{
                  border: 'none', outline: 'none', background: 'transparent',
                  fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', width: '100%',
                  color: 'var(--ink)',
                }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <div onClick={() => { setShowRegCompDropdown(!showRegCompDropdown); setShowRegStatusDropdown(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--admin-line)', borderRadius: 9999, padding: '0.45rem 0.9rem', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink)', cursor: 'pointer', userSelect: 'none' }}>
                {regCompetition === 'All' ? 'All Competitions' : regCompetition}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
              </div>
              {showRegCompDropdown && (
                <>{/* overlay */}<div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowRegCompDropdown(false)} />
                  <div className="adm-dropdown" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100, background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 16, padding: 6, minWidth: 160, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                    <div key="all" onClick={() => { setRegCompetition('All'); setRegPage(1); setShowRegCompDropdown(false); }}
                      style={{ padding: '0.5rem 0.9rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.72rem', fontWeight: regCompetition === 'All' ? 700 : 500, background: regCompetition === 'All' ? 'var(--admin-lavender-pale)' : 'transparent', color: 'var(--ink)' }}>
                      All Competitions
                    </div>
                    {regUniqueComps.map((comp) => (
                      <div key={comp as string} onClick={() => { setRegCompetition(comp as string); setRegPage(1); setShowRegCompDropdown(false); }}
                        style={{ padding: '0.5rem 0.9rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.72rem', fontWeight: regCompetition === comp ? 700 : 500, background: regCompetition === comp ? 'var(--admin-lavender-pale)' : 'transparent', color: 'var(--ink)' }}>
                        {comp as string}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <div onClick={() => { setShowRegStatusDropdown(!showRegStatusDropdown); setShowRegCompDropdown(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--admin-line)', borderRadius: 9999, padding: '0.45rem 0.9rem', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--ink)', cursor: 'pointer', userSelect: 'none' }}>
                {regStatus === 'All' ? 'All Status' : regStatus}
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
              </div>
              {showRegStatusDropdown && (
                <>{/* overlay */}<div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setShowRegStatusDropdown(false)} />
                  <div className="adm-dropdown" style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 100, background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 16, padding: 6, minWidth: 140, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                    {['All', 'Pending', 'Approved', 'Rejected'].map((s) => (
                      <div key={s} onClick={() => { setRegStatus(s); setRegPage(1); setShowRegStatusDropdown(false); }}
                        style={{ padding: '0.5rem 0.9rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.72rem', fontWeight: regStatus === s ? 700 : 500, background: regStatus === s ? 'var(--admin-lavender-pale)' : 'transparent', color: 'var(--ink)' }}>
                        {s === 'All' ? 'All Status' : s}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button onClick={() => window.location.href = '/admin/registrations'}
              style={{
                background: 'var(--ink)',
                color: 'var(--cream)',
                border: 'none',
                borderRadius: 9999,
                padding: '0.65rem 1.4rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontFamily: "'Inter', sans-serif",
              }}>View All</button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr>
                  {['Name', 'Competition', 'College', 'Phone', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} style={{
                      textAlign: 'left', fontSize: '0.68rem', letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: 'var(--admin-faint)', fontWeight: 700,
                      padding: '0 0.75rem 0.75rem', borderBottom: '1px solid var(--admin-line)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pagedRegs.map((row: any, idx: number) => {
                  const name = row.profiles?.full_name || row.name || 'Unknown';
                  const competition = row.competition_name || row.competition;
                  const college = row.profiles?.college || row.college || '—';
                  const phone = row.profiles?.whatsapp_number || row.phone || '—';
                  const status = row.status || 'unknown';
                  const date = row.created_at ? fmtDate(row.created_at) : row.date;
                  return (
                  <tr key={idx}>
                    <td style={{ padding: '0.9rem 0.75rem', borderBottom: '1px solid var(--admin-line)', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', fontWeight: 700, color: 'var(--ink)' }}>
                        <span style={{
                          width: 34, height: 34, borderRadius: 9999,
                          background: 'var(--admin-lavender-pale)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.7rem', fontWeight: 800, color: 'var(--admin-lavender)', flexShrink: 0,
                        }}>{getInitials(name)}</span>
                        {name}
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 0.75rem', borderBottom: '1px solid var(--admin-line)', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--ink)' }}>
                        <span style={{ width: 8, height: 8, borderRadius: 9999, background: compColorMap[competition] || '#9C93D6', flexShrink: 0 }} />
                        {competition}
                      </div>
                    </td>
                    <td style={{ padding: '0.9rem 0.75rem', borderBottom: '1px solid var(--admin-line)', verticalAlign: 'middle', color: 'var(--ink)' }}>{college}</td>
                    <td style={{ padding: '0.9rem 0.75rem', borderBottom: '1px solid var(--admin-line)', verticalAlign: 'middle', color: 'var(--ink)' }}>{phone}</td>
                    <td style={{ padding: '0.9rem 0.75rem', borderBottom: '1px solid var(--admin-line)', verticalAlign: 'middle', position: 'relative' }}>
                      <span onClick={() => setEditStatusRow(editStatusRow === row.id ? null : row.id)}
                        style={{ cursor: 'pointer' }}>
                        <StatusBadge status={status} />
                      </span>
                      {editStatusRow === row.id && (
                        <>{/* overlay */}<div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setEditStatusRow(null)} />
                          <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 100, background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 12, padding: 4, minWidth: 140, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
                            {['Pending Audition', 'Slot Allotted', 'Confirmed', 'Failed'].map((s) => (
                              <div key={s} onClick={async () => {
                                try {
                                  const res = await fetch('/api/admin/registrations', {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ id: row.id, status: s }),
                                  });
                                  if (!res.ok) console.error('Status update failed', await res.text());
                                } catch (e) { console.error('Status update error', e); }
                                setEditStatusRow(null);
                                fetchAll(period);
                              }}
                                style={{ padding: '0.4rem 0.7rem', borderRadius: 8, cursor: 'pointer', fontSize: '0.72rem', fontWeight: status === s ? 700 : 500, background: status === s ? 'var(--admin-lavender-pale)' : 'transparent', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                                <StatusBadge status={s} />
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                    <td style={{ padding: '0.9rem 0.75rem', borderBottom: '1px solid var(--admin-line)', verticalAlign: 'middle', color: 'var(--ink)' }}>{date}</td>
                    <td style={{ padding: '0.9rem 0.75rem', borderBottom: '1px solid var(--admin-line)', verticalAlign: 'middle' }}>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <IconBtn icon="eye" onClick={() => window.location.href = '/admin/registrations'} />
                        <IconBtn icon="edit" onClick={() => window.location.href = '/admin/registrations'} />
                      </div>
                    </td>
                  </tr>
                );
              })}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginTop: '1.25rem', fontSize: '0.78rem', color: 'var(--admin-muted)', flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <span>{filteredRegs.length === 0 ? 'No entries found' : `Showing ${((safePage - 1) * perPage) + 1} to ${Math.min(safePage * perPage, filteredRegs.length)} of ${filteredRegs.length} entries`}</span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {safePage > 1 && (
                <button onClick={() => setRegPage(safePage - 1)} style={{
                  minWidth: 32, height: 32, borderRadius: 9999,
                  border: '1px solid var(--admin-line)', background: 'transparent',
                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                  color: 'var(--ink)', padding: '0 0.5rem', fontFamily: "'Inter', sans-serif",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6" /></svg>
                </button>
              )}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = i + 1;
                return (
                  <button key={p} onClick={() => setRegPage(p)} style={{
                    minWidth: 32, height: 32, borderRadius: 9999,
                    border: p === safePage ? '1px solid var(--ink)' : '1px solid var(--admin-line)',
                    background: p === safePage ? 'var(--ink)' : 'transparent',
                    fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                    color: p === safePage ? 'var(--cream)' : 'var(--ink)',
                    padding: '0 0.5rem', fontFamily: "'Inter', sans-serif",
                  }}>{p}</button>
                );
              })}
              {safePage < totalPages && (
                <button onClick={() => setRegPage(safePage + 1)} style={{
                  minWidth: 32, height: 32, borderRadius: 9999,
                  border: '1px solid var(--admin-line)', background: 'transparent',
                  fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer',
                  color: 'var(--ink)', padding: '0 0.5rem', fontFamily: "'Inter', sans-serif",
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="admin-card" style={{ background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)' }}>Recent Activity</div>
            <a onClick={() => window.location.href = '/admin/registrations'} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--admin-orange)', cursor: 'pointer', textDecoration: 'none' }}>View All</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            {(recentActivity.length > 0 ? recentActivity : activities).map((act: any, i: number) => {
              const isNewReg = act.type === 'new-registration' || !act.type;
              const iconType = act.type === 'new-registration' ? 'user-plus' : act.type === 'new-volunteer' ? 'users' : 'check';
              const bgColor = act.type === 'new-registration' ? 'var(--admin-orange-pale)' : act.type === 'new-volunteer' ? 'var(--admin-orange-pale)' : 'var(--admin-lavender-pale)';
              const iconColor = act.type === 'new-registration' ? 'var(--admin-orange)' : act.type === 'new-volunteer' ? 'var(--admin-orange)' : 'var(--admin-lavender)';
              return (
              <div key={i} style={{ display: 'flex', gap: '0.85rem' }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: act.bg || bgColor, color: act.color || iconColor, flexShrink: 0,
                }}>
                  <ActivityIcon type={act.icon || iconType} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--ink)' }}>{act.title}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--admin-faint)', whiteSpace: 'nowrap', fontWeight: 600 }}>{act.time}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--admin-muted)', marginTop: '0.15rem', lineHeight: 1.4 }}>{act.desc}</div>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '2rem 0 0.5rem',
        fontSize: '0.75rem',
        color: 'var(--admin-faint)',
        letterSpacing: '0.04em',
      }}>
        &copy; 2026 Amravati Youth Festival. All rights reserved.
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .adm-grid-3 { grid-template-columns: 1fr !important; }
          .adm-grid-2 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .adm-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .adm-grid-4 { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .adm-donut-flex { flex-direction: column !important; align-items: center !important; }
          .adm-dropdown { right: auto !important; left: 0 !important; }
        }
      `}</style>
    </div>
  );
}

function IconBtn({ icon, onClick }: { icon: string; onClick?: () => void }) {
  const p = { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <button onClick={onClick} style={{
      width: 32, height: 32, borderRadius: 9999,
      border: '1px solid var(--admin-line)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', background: 'transparent', color: 'var(--ink)',
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--admin-lavender)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--admin-line)'}
    >
      {icon === 'eye' ? (
        <svg {...p}><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
      ) : (
        <svg {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
      )}
    </button>
  );
}

function TrendChart({ dailyData, period }: { dailyData: { date: string; registrations: number }[]; period: string }) {
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const svgRef = useRef<SVGSVGElement>(null);

  const periodDays: Record<string, number> = { 'Today': 1, 'This Week': 7, 'This Month': 30, 'All Time': 30 };
  const days = periodDays[period] || 7;
  const filtered = dailyData.length > days ? dailyData.slice(-days) : dailyData;

  if (filtered.length === 0) {
    return (
      <div className="admin-card" style={{ background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem' }}>
        <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', marginBottom: '1rem' }}>Registration Trend</div>
        <div style={{ height: 210, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-faint)', fontSize: '0.82rem' }}>No data for this period</div>
      </div>
    );
  }

  const values = filtered.map((d) => d.registrations);
  const maxVal = Math.max(...values, 1);
  const pad = 20;
  const ch = 210;
  const cw = 620;
  const n = filtered.length;
  const xStep = (cw - 40) / (n - 1 || 1);

  const linePoints = filtered.map((d, i) => {
    const x = 20 + i * xStep;
    const y = ch - pad - ((d.registrations / maxVal) * (ch - 2 * pad));
    return `${x},${y}`;
  });

  const areaPath = linePoints.join(' ') + ` ${20 + (n - 1) * xStep},${ch - pad} 20,${ch - pad} Z`;
  const linePath = linePoints.join(' ');
  const gridYs = [10, 50, 90, 130, 170];

  function onSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * cw;
    const rawIdx = (relX - 20) / xStep;
    const idx = Math.max(0, Math.min(n - 1, Math.round(rawIdx)));
    setHoveredIdx(idx);
  }

  const hoveredPoint = hoveredIdx >= 0 && hoveredIdx < n ? filtered[hoveredIdx] : null;
  const hoveredX = hoveredIdx >= 0 ? 20 + hoveredIdx * xStep : 0;
  const hoveredY = hoveredPoint
    ? ch - pad - ((hoveredPoint.registrations / maxVal) * (ch - 2 * pad))
    : 0;

  return (
    <div className="admin-card" style={{ background: 'var(--card)', border: '1px solid var(--admin-line)', borderRadius: 22, padding: '1.5rem', position: 'relative', minWidth: 0 }}>
      <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.15rem', color: 'var(--ink)', marginBottom: '1.25rem' }}>Registration Trend</div>
      <div style={{ width: '100%', height: 210, position: 'relative' }}>
        {/* Tooltip */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute', zIndex: 10, pointerEvents: 'none',
            left: `calc(${(hoveredX / cw) * 100}% - 45px)`,
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
            <div>{hoveredPoint.registrations}</div>
            <div style={{ opacity: 0.6, fontWeight: 400, fontSize: '0.68rem' }}>{hoveredPoint.date}</div>
          </div>
        )}
        <svg ref={svgRef} viewBox={`0 0 ${cw} ${ch}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
          onMouseMove={onSvgMouseMove}
          onMouseLeave={() => setHoveredIdx(-1)}
          style={{ cursor: 'pointer' }}>
          <defs><linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9C93D6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#9C93D6" stopOpacity="0" />
          </linearGradient></defs>
          <g stroke="#111111" strokeOpacity="0.06">
            {gridYs.map((y) => <line key={y} x1="0" y1={y} x2={cw} y2={y} />)}
          </g>
          <path d={areaPath} fill="url(#areaFill)" />
          <polyline points={linePath} fill="none" stroke="#9C93D6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {/* Vertical guide line */}
          {hoveredIdx >= 0 && (
            <line x1={hoveredX} y1={0} x2={hoveredX} y2={ch - pad}
              stroke="#9C93D6" strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
          )}

          {/* Data points */}
          <g fill="#9C93D6">
            {filtered.map((d, i) => {
              const x = 20 + i * xStep;
              const y = ch - pad - ((d.registrations / maxVal) * (ch - 2 * pad));
              const isHovered = i === hoveredIdx;
              return (
                <g key={d.date}>
                  {isHovered && (
                    <circle cx={x} cy={y} r="8" fill="white" stroke="#9C93D6" strokeWidth="3" opacity="0.9" />
                  )}
                  <circle cx={x} cy={y} r={isHovered ? 5 : 4}
                    fill={isHovered ? '#9C93D6' : '#9C93D6'}
                    opacity={isHovered ? 1 : 0.7}
                    style={{ transition: 'r 0.12s, opacity 0.12s' }}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        fontSize: '0.68rem', color: 'var(--admin-faint)', marginTop: '0.5rem', fontWeight: 600,
      }}>
        {filtered.filter((_, i) => {
          const step = filtered.length > 14 ? Math.ceil(filtered.length / 6) : 1;
          return i % step === 0 || i === filtered.length - 1;
        }).map((d) => (
          <span key={d.date}>{d.date.slice(5)}</span>
        ))}
      </div>
    </div>
  );
}

function ActionSvg({ type }: { type: string }) {
  const p = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'download': return <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>;
    case 'file': return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>;
    case 'file-text': return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M9 13h6M9 17h6" /></svg>;
    case 'printer': return <svg {...p}><path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" /></svg>;
    default: return null;
  }
}
