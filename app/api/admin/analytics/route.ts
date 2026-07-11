import { NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { getCached, setCache } from '@/utils/cache';

const CACHE_TTL = 10_000;

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cached = getCached<any>('admin:analytics', CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  const supabase = await createClient();

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    { data: regs },
    { data: vols },
    { data: profiles },
    { count: totalRegs },
    { count: totalVols },
    { count: totalProfiles },
  ] = await Promise.all([
    supabase.from('competitions').select('competition_name, status, created_at').gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('volunteers').select('status, created_at').gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('profiles').select('created_at').gte('created_at', thirtyDaysAgo.toISOString()),
    supabase.from('competitions').select('*', { count: 'exact', head: true }),
    supabase.from('volunteers').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ]);

  const dailyRegs: Record<string, number> = {};
  const dailyVols: Record<string, number> = {};
  const dailyProfiles: Record<string, number> = {};

  for (let i = 0; i < 30; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    dailyRegs[key] = 0;
    dailyVols[key] = 0;
    dailyProfiles[key] = 0;
  }

  for (const r of regs || []) {
    const key = r.created_at?.slice(0, 10);
    if (key && dailyRegs[key] !== undefined) dailyRegs[key]++;
  }
  for (const v of vols || []) {
    const key = v.created_at?.slice(0, 10);
    if (key && dailyVols[key] !== undefined) dailyVols[key]++;
  }
  for (const p of profiles || []) {
    const key = p.created_at?.slice(0, 10);
    if (key && dailyProfiles[key] !== undefined) dailyProfiles[key]++;
  }

  const compStatuses: Record<string, number> = {};
  for (const r of regs || []) {
    compStatuses[r.status] = (compStatuses[r.status] || 0) + 1;
  }

  const volStatuses: Record<string, number> = {};
  for (const v of vols || []) {
    volStatuses[v.status] = (volStatuses[v.status] || 0) + 1;
  }

  const compBreakdown: Record<string, number> = {};
  for (const r of regs || []) {
    compBreakdown[r.competition_name] = (compBreakdown[r.competition_name] || 0) + 1;
  }

  const result = {
    daily: Object.entries(dailyRegs).map(([date, registrations]) => ({ date, registrations })),
    dailyVolunteers: Object.entries(dailyVols).map(([date, applications]) => ({ date, applications })),
    dailyProfiles: Object.entries(dailyProfiles).map(([date, signups]) => ({ date, signups })),
    competitionStatuses: Object.entries(compStatuses).map(([status, count]) => ({ status, count })),
    volunteerStatuses: Object.entries(volStatuses).map(([status, count]) => ({ status, count })),
    competitionBreakdown: Object.entries(compBreakdown).map(([name, count]) => ({ name, count })),
    totals: {
      registrations: totalRegs ?? 0,
      volunteers: totalVols ?? 0,
      profiles: totalProfiles ?? 0,
    },
    period: {
      from: thirtyDaysAgo.toISOString().slice(0, 10),
      to: now.toISOString().slice(0, 10),
    },
  };

  setCache('admin:analytics', result, CACHE_TTL);
  return NextResponse.json(result);
}
