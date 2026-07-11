import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { getCached, setCache } from '@/utils/cache';

const CACHE_TTL = 10_000;

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'all';
  const cacheKey = `admin:activity:${period}`;

  const cached = getCached<any>(cacheKey, CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  const supabase = await createClient();

  let regQuery = supabase
    .from('competitions')
    .select('id, user_id, competition_name, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  let volQuery = supabase
    .from('volunteers')
    .select('id, user_id, status, created_at')
    .order('created_at', { ascending: false })
    .limit(10);

  if (period && period !== 'all') {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    let periodStart: Date;
    switch (period) {
      case 'today': periodStart = todayStart; break;
      case 'week': { const d = new Date(todayStart); d.setDate(d.getDate() - 6); periodStart = d; break; }
      case 'month': { const d = new Date(todayStart); d.setDate(d.getDate() - 29); periodStart = d; break; }
      default: periodStart = todayStart;
    }
    const iso = periodStart.toISOString();
    regQuery = regQuery.gte('created_at', iso);
    volQuery = volQuery.gte('created_at', iso);
  }

  const [recentRegs, recentVols] = await Promise.all([regQuery, volQuery]);

  const userIds = new Set<string>();
  for (const r of recentRegs.data || []) if (r.user_id) userIds.add(r.user_id);
  for (const v of recentVols.data || []) if (v.user_id) userIds.add(v.user_id);

  const profileMap: Record<string, any> = {};
  if (userIds.size > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', [...userIds]);
    for (const p of profiles || []) {
      profileMap[p.id] = p;
    }
  }

  const activities: {
    type: string;
    title: string;
    desc: string;
    time: string;
    created_at: string;
  }[] = [];

  for (const r of recentRegs.data || []) {
    const name = profileMap[r.user_id]?.full_name || 'Someone';
    const rel = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 60000);
    const timeStr = rel < 1 ? 'just now' : rel < 60 ? `${rel}m ago` : `${Math.floor(rel / 60)}h ago`;
    activities.push({
      type: 'new-registration',
      title: 'New registration',
      desc: `${name} registered for ${r.competition_name}`,
      time: timeStr,
      created_at: r.created_at,
    });
  }

  for (const v of recentVols.data || []) {
    const name = profileMap[v.user_id]?.full_name || 'Someone';
    const rel = Math.floor((Date.now() - new Date(v.created_at).getTime()) / 60000);
    const timeStr = rel < 1 ? 'just now' : rel < 60 ? `${rel}m ago` : `${Math.floor(rel / 60)}h ago`;
    activities.push({
      type: 'new-volunteer',
      title: 'New volunteer application',
      desc: `${name} applied as Volunteer`,
      time: timeStr,
      created_at: v.created_at,
    });
  }

  activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const result = { activities: activities.slice(0, 10) };
  setCache(cacheKey, result, CACHE_TTL);
  return NextResponse.json(result);
}
