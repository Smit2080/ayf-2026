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
          <div style={{ width: 32, height: 32, border: '3px solid var(--orange)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 12px', animation: 'dSpin 1s linear infinite' }} />
          <style>{`@keyframes dSpin{to{transform:rotate(360deg)}}`}</style>
        </div>
      </div>
    );
  }

  const compEntries = Object.entries(stats.competitionBreakdown || {});

  return (
    <div style={{ position: 'relative' }}>
      {/* Stage glow spotlights */}
      <div style={{
        position: 'absolute', top: '-30%', left: '-10%', width: '50%', height: '100%',
        background: 'linear-gradient(180deg, rgba(123,44,255,0.12) 0%, rgba(123,44,255,0.04) 35%, transparent 70%)',
        filter: 'blur(30px)', pointerEvents: 'none', zIndex: 0,
      }} />
      <div style={{
        position: 'absolute', top: '-20%', right: '-5%', width: '40%', height: '80%',
        background: 'linear-gradient(180deg, rgba(255,184,0,0.08) 0%, transparent 60%)',
        filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Hero-style heading */}
        <div style={{
          marginBottom: 36,
          paddingBottom: 24,
          borderBottom: '1px solid var(--line)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', bottom: -1, left: 0, width: 80, height: 2,
            background: 'linear-gradient(90deg, var(--orange), transparent)',
          }} />
          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: 'clamp(28px, 3vw, 36px)',
            letterSpacing: '0.01em',
            lineHeight: 1,
          }}>
            Admin <span style={{ color: 'var(--orange)' }}>Dashboard</span>
          </h1>
          <p style={{
            fontSize: 13,
            color: 'rgba(247,247,247,0.35)',
            marginTop: 8,
            fontFamily: "'Space Mono', monospace",
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}>
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
          borderRadius: 12,
          padding: 28,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, var(--orange), var(--purple), transparent)',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{
              fontFamily: "'Anton', sans-serif",
              fontSize: 20,
              letterSpacing: '0.02em',
              color: 'var(--orange)',
            }}>
              Competition Breakdown
            </h2>
            <span style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'rgba(247,247,247,0.3)',
              padding: '4px 10px',
              border: '1px solid var(--line)',
              borderRadius: 4,
            }}>
              {stats.totalRegistrations} total
            </span>
          </div>

          {compEntries.length === 0 ? (
            <div style={{ fontSize: 13, color: 'rgba(247,247,247,0.2)', padding: '30px 0', textAlign: 'center', fontFamily: "'Space Mono', monospace", letterSpacing: '0.06em' }}>
              No registrations yet
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {compEntries.map(([name, count]) => {
                const maxCount = Math.max(...compEntries.map(([, c]) => c));
                const pct = (count / maxCount) * 100;
                return (
                  <div key={name}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 6,
                      fontSize: 12,
                    }}>
                      <span style={{
                        fontWeight: 600,
                        color: 'rgba(247,247,247,0.8)',
                      }}>{name}</span>
                      <span style={{
                        color: 'var(--orange)',
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: 700,
                        fontSize: 13,
                      }}>
                        {count}
                      </span>
                    </div>
                    <div style={{
                      height: 10,
                      background: 'rgba(247,247,247,0.04)',
                      borderRadius: 5,
                      overflow: 'hidden',
                      position: 'relative',
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'linear-gradient(90deg, var(--orange), var(--purple))',
                        borderRadius: 5,
                        transition: 'width 0.6s ease',
                        position: 'relative',
                      }}>
                        <div style={{
                          position: 'absolute', right: 0, top: 0, bottom: 0, width: 20,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1))',
                          borderRadius: '0 5px 5px 0',
                        }} />
                      </div>
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
