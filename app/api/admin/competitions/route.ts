import { NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { getCached, setCache } from '@/utils/cache';

const CACHE_TTL = 10_000;

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cached = getCached<any>('admin:competitions', CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  const supabase = await createClient();

  const { data: meta } = await supabase.from('competition_meta').select('*').order('name');

  const { data: registrations } = await supabase
    .from('competitions')
    .select('competition_name');

  const regCounts: Record<string, number> = {};
  for (const r of registrations || []) {
    regCounts[r.competition_name] = (regCounts[r.competition_name] || 0) + 1;
  }

  let result: any;
  if (meta && meta.length > 0) {
    result = {
      competitions: meta.map((c: any) => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        icon: c.icon || '',
        registration_open: c.registration_open ?? true,
        max_participants: c.max_participants || null,
        registration_count: regCounts[c.name] || 0,
      })),
      source: 'meta',
    };
  } else {
    const grouped: Record<string, number> = {};
    for (const r of registrations || []) {
      grouped[r.competition_name] = (grouped[r.competition_name] || 0) + 1;
    }
    result = {
      competitions: Object.entries(grouped).map(([name, count]) => ({ name, registration_count: count })),
      source: 'registrations',
    };
  }

  setCache('admin:competitions', result, CACHE_TTL);
  return NextResponse.json(result);
}
