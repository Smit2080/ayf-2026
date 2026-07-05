'use client';

export default function StatsCard({
  label,
  value,
  icon,
  delta,
  deltaUp,
  sparkColor,
  iconBg,
  iconColor,
}: {
  label: string;
  value: string | number;
  icon: 'users' | 'calendar' | 'volunteers' | 'trophy';
  delta: string;
  deltaUp?: boolean;
  sparkColor?: string;
  iconBg?: string;
  iconColor?: string;
}) {
  const iconMap: Record<string, React.ReactNode> = {
    users: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    calendar: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    volunteers: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
      </svg>
    ),
    trophy: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4z" /><path d="M17 5h3a2 2 0 0 1-2 4M7 5H4a2 2 0 0 0 2 4" />
      </svg>
    ),
  };

  return (
    <div className="admin-card" style={{
      background: 'var(--card)',
      border: '1px solid var(--admin-line)',
      borderRadius: 22,
      padding: '1.25rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{
          width: 46,
          height: 46,
          borderRadius: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: iconBg || 'var(--admin-lavender-pale)',
          color: iconColor || 'var(--admin-lavender)',
        }}>
          {iconMap[icon]}
        </div>
      </div>
      <div>
        <div style={{
          fontSize: '0.78rem',
          color: 'var(--admin-muted)',
          fontWeight: 600,
          marginBottom: '0.35rem',
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'Playfair Display', serif",
          fontWeight: 900,
          fontSize: '2.1rem',
          lineHeight: 1,
          color: 'var(--ink)',
        }}>
          {value}
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: deltaUp ? '#5C8A5C' : 'var(--admin-orange)',
        }}>
          {delta}
        </span>
        <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
          <polyline
            points={deltaUp ? "0,18 12,14 24,16 36,7 48,10 60,3" : "0,16 12,18 24,9 36,13 48,6 60,10"}
            stroke={sparkColor || (deltaUp ? '#9C93D6' : '#FF5A1F')}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
