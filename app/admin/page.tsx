'use client';

import { useEffect, useState } from 'react';
import StatsCard from '@/components/admin/StatsCard';

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
  competitionBreakdown: Record<string, number>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 32, height: 32, border: '3px solid var(--purple)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'dSpin 1s linear infinite' }} />
          <style>{`@keyframes dSpin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  const compEntries = Object.entries(stats.competitionBreakdown || {});

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(28px, 3vw, 36px)',
          letterSpacing: '0.01em',
          lineHeight: 1,
        }}>
          Admin <span style={{ color: 'var(--orange)' }}>Dashboard</span>
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(247,247,247,0.4)', marginTop: 8, fontFamily: "'Space Mono', monospace" }}>
          AYF 2026 — Overview
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: 14,
        marginBottom: 40,
      }}>
        <StatsCard label="Total Users" value={stats.totalUsers} accent="orange" />
        <StatsCard label="Registrations" value={stats.totalRegistrations} accent="purple" />
        <StatsCard label="Pending Auditions" value={stats.pendingAuditions} accent="orange" />
        <StatsCard label="Slot Allotted" value={stats.slotAllotted} accent="lime" />
        <StatsCard label="Confirmed" value={stats.confirmedComps} accent="lime" />
        <StatsCard label="Volunteers" value={stats.totalVolunteers} accent="purple" />
        <StatsCard label="Pending Review" value={stats.pendingReviews} accent="orange" />
        <StatsCard label="Shortlisted" value={stats.shortlisted} accent="lime" />
        <StatsCard label="Approved" value={stats.approvedVols} accent="lime" />
      </div>

      {/* Competition Breakdown */}
      <div style={{
        background: 'rgba(26,26,26,0.4)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        padding: 24,
      }}>
        <h2 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 20,
          letterSpacing: '0.02em',
          marginBottom: 20,
          color: 'var(--orange)',
        }}>
          Competition Breakdown
        </h2>

        {compEntries.length === 0 ? (
          <div style={{ fontSize: 13, color: 'rgba(247,247,247,0.3)', padding: '20px 0' }}>
            No registrations yet
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {compEntries.map(([name, count]) => {
              const maxCount = Math.max(...compEntries.map(([, c]) => c));
              const pct = (count / maxCount) * 100;
              return (
                <div key={name}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 4,
                    fontSize: 12,
                  }}>
                    <span style={{ fontWeight: 600 }}>{name}</span>
                    <span style={{ color: 'var(--orange)', fontFamily: "'Space Mono', monospace", fontWeight: 700 }}>
                      {count}
                    </span>
                  </div>
                  <div style={{
                    height: 8,
                    background: 'rgba(247,247,247,0.04)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: 'linear-gradient(90deg, var(--orange), var(--purple))',
                      borderRadius: 4,
                      transition: 'width 0.5s',
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
