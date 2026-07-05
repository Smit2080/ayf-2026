'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending Review', value: 'Pending Review' },
  { label: 'Shortlisted', value: 'Shortlisted' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
];

const columns: Column[] = [
  { key: 'profiles.full_name', label: 'Name', sortable: true },
  { key: 'profiles.email', label: 'Email', sortable: true },
  { key: 'profiles.whatsapp_number', label: 'WhatsApp', sortable: true },
  { key: 'gender', label: 'Gender' },
  { key: 'city', label: 'City', sortable: true },
  { key: 'languages', label: 'Languages' },
  { key: 'experience', label: 'Experience' },
  {
    key: 'status', label: 'Status', sortable: true,
    editable: true, editType: 'select',
    editOptions: ['Pending Review', 'Shortlisted', 'Approved', 'Rejected'],
    render: (val: string) => <StatusBadge status={val} />,
  },
  {
    key: 'created_at', label: 'Applied', sortable: true,
    render: (val: string) => new Date(val).toLocaleDateString('en-IN'),
  },
];

export default function AdminVolunteers() {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(async () => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), perPage: '25',
      sort: sortKey, order: sortOrder,
      status: statusFilter,
    });
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/volunteers?${params}`);
    const json = await res.json();
    if (id === fetchIdRef.current) {
      setData(json.data || []);
      setTotal(json.total || 0);
      setLoading(false);
    }
  }, [page, sortKey, sortOrder, search, statusFilter]);

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

  async function handleEdit(id: string, key: string, value: any) {
    const res = await fetch('/api/admin/volunteers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: value }),
    });
    if (!res.ok) { console.error('Edit failed', await res.text()); return; }
    fetchData();
  }

  async function handleBulkAction(ids: string[], action: string) {
    const statusMap: Record<string, string> = {
      approve: 'Approved',
      pending: 'Pending Review',
      reject: 'Rejected',
    };
    const res = await fetch('/api/admin/volunteers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bulk: true, ids, status: statusMap[action] }),
    });
    if (!res.ok) { console.error('Bulk action failed', await res.text()); return; }
    fetchData();
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(24px, 2.5vw, 30px)', letterSpacing: '-0.01em', lineHeight: 1, color: 'var(--ink)' }}>
          Volunteer <span style={{ color: 'var(--orange)' }}>Applications</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginTop: 8, fontWeight: 500 }}>
          Review and manage volunteer candidates
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
        statusFilter={statusFilter}
        statusOptions={statusOptions}
        onSearch={(v) => { setSearch(v); setPage(1); }}
        onSort={handleSort}
        onPageChange={setPage}
        onStatusFilter={(v) => { setStatusFilter(v); setPage(1); }}
        onEdit={handleEdit}
        onBulkAction={handleBulkAction}
        onExportCSV={() => window.open('/api/admin/export?type=volunteers&format=csv', '_blank')}
        onExportExcel={() => window.open('/api/admin/export?type=volunteers&format=xlsx', '_blank')}
        filename="volunteers"
      />
    </div>
  );
}
