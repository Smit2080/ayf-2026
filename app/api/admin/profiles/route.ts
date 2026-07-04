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

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' });

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,college.ilike.%${search}%`
    );
  }

  query = query.order(sort, { ascending: order === 'asc' });
  query = query.range((page - 1) * perPage, page * perPage - 1);

  const { data, count, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data || [],
    total: count ?? 0,
    page,
    perPage,
  });
}
