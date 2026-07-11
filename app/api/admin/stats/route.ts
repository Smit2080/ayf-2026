import { NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { getCached, setCache } from '@/utils/cache';

const CACHE_TTL = 10_000;

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cached = getCached<any>('admin:stats', CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayISO = yesterdayStart.toISOString();

  const [profiles, competitions, volunteers, compMeta] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('competitions').select('status, competition_name, created_at'),
    supabase.from('volunteers').select('status, created_at'),
    supabase.from('competition_meta').select('id', { count: 'exact', head: true }),
  ]);

  const allComps = competitions.data || [];
  const allVols = volunteers.data || [];
  const totalCompetitions = compMeta.count ?? 5;

  const pendingAuditions = allComps.filter(c => c.status === 'Pending Audition').length;
  const slotAllotted = allComps.filter(c => c.status === 'Slot Allotted').length;
  const confirmedComps = allComps.filter(c => c.status === 'Confirmed').length;
  const todayRegistrations = allComps.filter(c => c.created_at >= todayISO).length;
  const yesterdayRegistrations = allComps.filter(c => c.created_at >= yesterdayISO && c.created_at < todayISO).length;

  const pendingReviews = allVols.filter(v => v.status === 'Pending Review').length;
  const shortlisted = allVols.filter(v => v.status === 'Shortlisted').length;
  const approvedVols = allVols.filter(v => v.status === 'Approved').length;

  const compCounts: Record<string, number> = {};
  for (const c of allComps) {
    compCounts[c.competition_name] = (compCounts[c.competition_name] || 0) + 1;
  }

  const yc = yesterdayRegistrations;
  const tc = todayRegistrations;
  const todayDelta = yc > 0
    ? `↑ ${((tc / yc) * 100).toFixed(0)}% from yesterday`
    : tc > 0 ? '↑ New today' : '—';

  const result = {
    totalUsers: profiles.count ?? 0,
    totalRegistrations: allComps.length,
    totalVolunteers: allVols.length,
    pendingAuditions,
    slotAllotted,
    confirmedComps,
    pendingReviews,
    shortlisted,
    approvedVols,
    todayRegistrations: tc,
    todayDelta,
    competitionBreakdown: compCounts,
    totalCompetitions,
  };

  setCache('admin:stats', result, CACHE_TTL);
  return NextResponse.json(result);
}
