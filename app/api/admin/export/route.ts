import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  const admin = await getAdminUser();
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'csv';
  const type = searchParams.get('type') || 'registrations';

  let rows: any[] = [];
  let filename = type;

  if (type === 'registrations') {
    const { data } = await supabase
      .from('competitions')
      .select('*')
      .order('created_at', { ascending: false });

    const userIds = [...new Set((data || []).map(r => r.user_id).filter(Boolean))];
    const profileMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      for (const p of profiles || []) profileMap[p.id] = p;
    }

    rows = (data || []).map((r: any) => {
      const prof = profileMap[r.user_id] || {};
      return {
        'Full Name': prof.full_name || '',
        Email: prof.email || '',
        WhatsApp: prof.whatsapp_number || '',
        Age: prof.age || '',
        College: prof.college || '',
        Stream: prof.stream || '',
        Competition: r.competition_name,
        'Performance Details': r.performance_details,
        Status: r.status,
        'Audition Slot': r.audition_slot || '',
        'Registered At': new Date(r.created_at).toLocaleDateString('en-IN'),
      };
    });
    filename = 'registrations';
  } else if (type === 'volunteers') {
    const { data } = await supabase
      .from('volunteers')
      .select('*')
      .order('created_at', { ascending: false });

    const userIds = [...new Set((data || []).map(r => r.user_id).filter(Boolean))];
    const profileMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      for (const p of profiles || []) profileMap[p.id] = p;
    }

    rows = (data || []).map((r: any) => {
      const prof = profileMap[r.user_id] || {};
      return {
        'Full Name': prof.full_name || '',
        Email: prof.email || '',
        WhatsApp: prof.whatsapp_number || '',
        Gender: r.gender,
        City: r.city,
        Languages: r.languages,
        Experience: r.experience,
        'Why Volunteer': r.why_volunteer,
        'Instagram ID': r.instagram_id || '',
        Status: r.status,
        'Applied At': new Date(r.created_at).toLocaleDateString('en-IN'),
      };
    });
    filename = 'volunteers';
  } else if (type === 'profiles') {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    rows = (data || []).map((r: any) => ({
      'Full Name': r.full_name,
      Email: r.email,
      WhatsApp: r.whatsapp_number,
      Age: r.age,
      College: r.college,
      Stream: r.stream,
      Role: r.role,
      'Joined At': new Date(r.created_at).toLocaleDateString('en-IN'),
    }));
    filename = 'profiles';
  }

  if (format === 'xlsx') {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}-${Date.now()}.xlsx"`,
      },
    });
  }

  const csvRows = [Object.keys(rows[0] || {}).join(','), ...rows.map((r) => Object.values(r).map((v: any) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n');

  return new NextResponse(csvRows, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}-${Date.now()}.csv"`,
    },
  });
}