import { NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayISO = todayStart.toISOString();

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayISO = yesterdayStart.toISOString();

  const [
    { count: totalUsers },
    { count: totalRegistrations },
    { count: totalVolunteers },
    { count: pendingAuditions },
    { count: slotAllotted },
    { count: confirmedComps },
    { count: pendingReviews },
    { count: shortlisted },
    { count: approvedVols },
    { count: todayRegistrations },
    { count: yesterdayRegistrations },
    { data: compBreakdown },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('competitions').select('*', { count: 'exact', head: true }),
    supabase.from('volunteers').select('*', { count: 'exact', head: true }),
    supabase.from('competitions').select('*', { count: 'exact', head: true }).eq('status', 'Pending Audition'),
    supabase.from('competitions').select('*', { count: 'exact', head: true }).eq('status', 'Slot Allotted'),
    supabase.from('competitions').select('*', { count: 'exact', head: true }).eq('status', 'Confirmed'),
    supabase.from('volunteers').select('*', { count: 'exact', head: true }).eq('status', 'Pending Review'),
    supabase.from('volunteers').select('*', { count: 'exact', head: true }).eq('status', 'Shortlisted'),
    supabase.from('volunteers').select('*', { count: 'exact', head: true }).eq('status', 'Approved'),
    supabase.from('competitions').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
    supabase.from('competitions').select('*', { count: 'exact', head: true }).gte('created_at', yesterdayISO).lt('created_at', todayISO),
    supabase.from('competitions').select('competition_name'),
  ]);

  const compCounts: Record<string, number> = {};
  compBreakdown?.forEach((c: any) => {
    compCounts[c.competition_name] = (compCounts[c.competition_name] || 0) + 1;
  });

  const yc = yesterdayRegistrations ?? 0;
  const tc = todayRegistrations ?? 0;
  const todayDelta = yc > 0
    ? `↑ ${((tc / yc) * 100).toFixed(0)}% from yesterday`
    : tc > 0 ? '↑ New today' : '—';

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    totalRegistrations: totalRegistrations ?? 0,
    totalVolunteers: totalVolunteers ?? 0,
    pendingAuditions: pendingAuditions ?? 0,
    slotAllotted: slotAllotted ?? 0,
    confirmedComps: confirmedComps ?? 0,
    pendingReviews: pendingReviews ?? 0,
    shortlisted: shortlisted ?? 0,
    approvedVols: approvedVols ?? 0,
    todayRegistrations: tc,
    todayDelta,
    competitionBreakdown: compCounts,
  });
}
