'use client';

const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  'Pending Audition': { bg: 'rgba(255,184,0,0.1)', color: 'var(--orange)', border: 'rgba(255,184,0,0.2)' },
  'Pending Review': { bg: 'rgba(255,184,0,0.1)', color: 'var(--orange)', border: 'rgba(255,184,0,0.2)' },
  'Slot Allotted': { bg: 'rgba(198,255,0,0.1)', color: 'var(--lime)', border: 'rgba(198,255,0,0.25)' },
  'Shortlisted': { bg: 'rgba(198,255,0,0.1)', color: 'var(--lime)', border: 'rgba(198,255,0,0.25)' },
  'Confirmed': { bg: 'rgba(0,224,209,0.1)', color: 'var(--teal)', border: 'rgba(0,224,209,0.25)' },
  'Approved': { bg: 'rgba(0,224,209,0.1)', color: 'var(--teal)', border: 'rgba(0,224,209,0.25)' },
  'Failed': { bg: 'rgba(255,46,138,0.1)', color: 'var(--pink)', border: 'rgba(255,46,138,0.25)' },
  'Rejected': { bg: 'rgba(255,46,138,0.1)', color: 'var(--pink)', border: 'rgba(255,46,138,0.25)' },
};

function getColors(status: string) {
  for (const [key, colors] of Object.entries(statusColors)) {
    if (status.toLowerCase().includes(key.toLowerCase().split(' ')[0].toLowerCase())) {
      return colors;
    }
  }
  return { bg: 'rgba(247,247,247,0.06)', color: 'rgba(247,247,247,0.5)', border: 'var(--line)' };
}

export default function StatusBadge({ status }: { status: string }) {
  const c = getColors(status);
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: "'Space Mono', monospace",
      fontSize: 10,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      padding: '4px 10px',
      borderRadius: 4,
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  );
}
