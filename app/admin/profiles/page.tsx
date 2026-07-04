'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';

const columns: Column[] = [
  { key: 'full_name', label: 'Full Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'whatsapp_number', label: 'WhatsApp', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'college', label: 'College', sortable: true },
  { key: 'stream', label: 'Stream', sortable: true },
  {
    key: 'role', label: 'Role', sortable: true,
    render: (val: string) => (
      <span style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '3px 8px',
        borderRadius: 4,
        background: val === 'admin' ? 'rgba(123,44,255,0.1)' : 'rgba(247,247,247,0.04)',
        color: val === 'admin' ? 'var(--purple)' : 'rgba(247,247,247,0.4)',
        border: val === 'admin' ? '1px solid rgba(123,44,255,0.2)' : '1px solid var(--line)',
      }}>
        {val}
      </span>
    ),
  },
  {
    key: 'created_at', label: 'Joined', sortable: true,
    render: (val: string) => new Date(val).toLocaleDateString('en-IN'),
  },
];

export default function AdminProfiles() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), perPage: '25',
      sort: sortKey, order: sortOrder,
    });
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/profiles?${params}`);
    const json = await res.json();
    if (id === fetchIdRef.current) {
      setData(json.data || []);
      setTotal(json.total || 0);
      setLoading(false);
    }
  }, [page, sortKey, sortOrder, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  function handleSort(key: string) {
    if (key === sortKey) {
      setSortOrder((o) => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
    setPage(1);
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(24px, 2.5vw, 30px)', letterSpacing: '0.01em', lineHeight: 1 }}>
          User <span style={{ color: 'var(--orange)' }}>Profiles</span>
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(247,247,247,0.4)', marginTop: 6, fontFamily: "'Space Mono', monospace" }}>
          All registered users
        </p>
      </div>

      <DataTable
        columns={columns}
        data={data}
        total={total}
        page={page}
        perPage={25}
        sortKey={sortKey}
        sortOrder={sortOrder}
        loading={loading}
        searchValue={search}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        onStatusFilter={() => {}}
        onSort={handleSort}
        onPageChange={setPage}
        onEdit={async () => {}}
        onBulkAction={async () => {}}
        onExportCSV={() => window.open('/api/admin/export?type=profiles&format=csv', '_blank')}
        onExportExcel={() => window.open('/api/admin/export?type=profiles&format=xlsx', '_blank')}
        filename="profiles"
      />
    </div>
  );
}
