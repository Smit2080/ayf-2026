import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get('perPage') || '25')));
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') || 'desc';
  const statusFilter = searchParams.get('status') || '';

  let query = supabase
    .from('volunteers')
    .select('*', { count: 'exact' });

  if (statusFilter) {
    query = query.eq('status', statusFilter);
  }

  if (search) {
    query = query.or(
      `city.ilike.%${search}%,why_volunteer.ilike.%${search}%`
    );
  }

  query = query.order(sort, { ascending: order === 'asc' });
  query = query.range((page - 1) * perPage, page * perPage - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = [...new Set((data || []).map(r => r.user_id).filter(Boolean))];
  const profileMap: Record<string, any> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
    for (const p of profiles || []) {
      profileMap[p.id] = p;
    }
  }

  const merged = (data || []).map(r => ({
    ...r,
    profiles: profileMap[r.user_id] || null,
  }));

  const filtered = search
    ? merged.filter(r => {
        const p = r.profiles || {};
        return (
          (p.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
          (p.email || '').toLowerCase().includes(search.toLowerCase())
        );
      })
    : merged;

  return NextResponse.json({
    data: filtered,
    total: count ?? 0,
    page,
    perPage,
  });
}

export async function PATCH(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();
  const body = await request.json();

  if (body.bulk) {
    const ids = body.ids as string[];
    if (!ids?.length) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }
    const updates: Record<string, any> = {};
    if (body.status) updates.status = body.status;

    const { data, error } = await supabase
      .from('volunteers')
      .update(updates)
      .in('id', ids)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ data });
  }

  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  const { data, error } = await supabase
    .from('volunteers')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}