'use client';

export default function StatsCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: 'orange' | 'purple' | 'lime' | 'pink';
}) {
  const accentColors = {
    orange: 'var(--orange)',
    purple: 'var(--purple)',
    lime: 'var(--lime)',
    pink: 'var(--pink)',
  };
  const color = accentColors[accent];

  return (
    <div style={{
      background: 'rgba(26,26,26,0.6)',
      border: '1px solid var(--line)',
      borderRadius: 10,
      padding: '24px 20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 3,
        height: '100%',
        background: color,
      }} />
      <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'rgba(247,247,247,0.4)',
        marginBottom: 8,
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Anton', sans-serif",
        fontSize: 36,
        lineHeight: 1,
        color,
      }}>
        {value}
      </div>
    </div>
  );
}
