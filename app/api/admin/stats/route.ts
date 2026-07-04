import { NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();

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
    supabase.from('competitions').select('competition_name', { count: 'exact' }),
  ]);

  const compCounts: Record<string, number> = {};
  compBreakdown?.forEach((c: any) => {
    compCounts[c.competition_name] = (compCounts[c.competition_name] || 0) + 1;
  });

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
    competitionBreakdown: compCounts,
  });
}
