import { NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();

  const { data: meta } = await supabase.from('competition_meta').select('*').order('name');

  const { data: registrations } = await supabase
    .from('competitions')
    .select('competition_name');

  const regCounts: Record<string, number> = {};
  for (const r of registrations || []) {
    regCounts[r.competition_name] = (regCounts[r.competition_name] || 0) + 1;
  }

  if (meta && meta.length > 0) {
    const result = meta.map((c: any) => ({
      id: c.id,
      name: c.name,
      description: c.description || '',
      icon: c.icon || '',
      registration_open: c.registration_open ?? true,
      max_participants: c.max_participants || null,
      registration_count: regCounts[c.name] || 0,
    }));
    return NextResponse.json({ competitions: result, source: 'meta' });
  }

  const grouped: Record<string, number> = {};
  for (const r of registrations || []) {
    grouped[r.competition_name] = (grouped[r.competition_name] || 0) + 1;
  }
  const fallback = Object.entries(grouped).map(([name, count]) => ({
    name,
    registration_count: count,
  }));

  return NextResponse.json({ competitions: fallback, source: 'registrations' });
}
