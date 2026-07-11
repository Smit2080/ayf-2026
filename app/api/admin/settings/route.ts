import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import { getCached, setCache, clearCache } from '@/utils/cache';

const CACHE_TTL = 10_000;

export async function GET() {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const cached = getCached<any>('admin:settings', CACHE_TTL);
  if (cached) return NextResponse.json(cached);

  const supabase = await createClient();

  const [{ data: settings }, { data: meta }] = await Promise.all([
    supabase.from('admin_settings').select('*').maybeSingle(),
    supabase.from('competition_meta').select('id, name, registration_open').order('name'),
  ]);

  const result = {
    settings: settings || { registration_open: true, maintenance_mode: false },
    competitions: meta || [],
  };

  setCache('admin:settings', result, CACHE_TTL);
  return NextResponse.json(result);
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();
  const body = await request.json();

  if (body.competition_id !== undefined && body.registration_open !== undefined) {
    const { error } = await supabase
      .from('competition_meta')
      .update({ registration_open: body.registration_open })
      .eq('id', body.competition_id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    clearCache('admin:settings');
    clearCache('admin:competitions');
    return NextResponse.json({ success: true });
  }

  if (body.key && body.value !== undefined) {
    const { data: existing } = await supabase
      .from('admin_settings')
      .select('id')
      .maybeSingle();

    if (existing) {
      await supabase.from('admin_settings').update({ [body.key]: body.value }).eq('id', existing.id);
    } else {
      await supabase.from('admin_settings').insert({ [body.key]: body.value });
    }
    clearCache('admin:settings');
    clearCache('admin:competitions');
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
}
