'use client';

type StatusVariant = {
  bg: string;
  color: string;
  label: string;
};

const variantByKey: Record<string, StatusVariant> = {
  pending:    { bg: 'var(--admin-orange-pale)',  color: 'var(--admin-orange)',  label: 'Pending' },
  waitlisted: { bg: 'var(--admin-lavender-pale)',color: 'var(--lavender)',     label: 'Waitlisted' },
  approved:   { bg: 'var(--admin-lavender-pale)',color: 'var(--lavender)',     label: 'Approved' },
  rejected:   { bg: 'var(--admin-reject-pale)',  color: 'var(--admin-reject)', label: 'Rejected' },
  shortlisted:{ bg: 'var(--admin-lavender-pale)',color: 'var(--lavender)',     label: 'Shortlisted' },
  selected:   { bg: 'var(--admin-lavender-pale)',color: 'var(--lavender)',     label: 'Selected' },
};

function resolveVariant(status: string): StatusVariant {
  const s = (status || '').toLowerCase().trim();

  const direct = variantByKey[s];
  if (direct) return direct;

  if (s.includes('waitlist')) return variantByKey.waitlisted;
  if (s.includes('shortlist')) return variantByKey.shortlisted;
  if (s.includes('select')) return variantByKey.selected;
  if (s.includes('approve') || s.includes('confirm')) return variantByKey.approved;
  if (s.includes('reject') || s.includes('fail')) return variantByKey.rejected;
  if (s.includes('pending') || s.includes('slot') || s.includes('review') || s.includes('audition')) {
    return variantByKey.pending;
  }

  return { bg: 'rgba(17,17,17,0.06)', color: 'rgba(17,17,17,0.5)', label: status || 'Unknown' };
}

export default function StatusBadge({ status }: { status: string }) {
  const v = resolveVariant(status);
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.35rem 0.85rem',
      borderRadius: 9999,
      fontSize: '0.7rem',
      fontWeight: 700,
      background: v.bg,
      color: v.color,
      whiteSpace: 'nowrap',
    }}>
      {v.label}
    </span>
  );
}
