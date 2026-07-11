'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import DetailModal from '@/components/admin/DetailModal';

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

const volStatusActions = [
  { label: 'Pending Review', icon: '⏳', color: 'var(--admin-orange)' },
  { label: 'Shortlisted', icon: '⭐', color: '#8B5CF6' },
  { label: 'Approved', icon: '✓', color: '#22C55E' },
  { label: 'Rejected', icon: '✕', color: '#EF4444' },
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

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const fetchData = useCallback(async () => {
    const id = ++fetchIdRef.current;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page), perPage: '25',
      sort: sortKey, order: sortOrder,
      status: statusFilter,
    });
    if (search) params.set('search', search);

    let json: any = { data: [], total: 0 };
    try {
      const res = await fetch(`/api/admin/volunteers?${params}`);
      if (!res.ok) throw new Error('Volunteers fetch failed');
      json = await res.json();
    } catch (e) { setLoading(false); return; }
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
    if (modalOpen && selectedRow) refreshRow(id);
  }

  async function refreshRow(id: string) {
    const res = await fetch(`/api/admin/volunteers?perPage=1&sort=created_at&order=desc`);
    if (res.ok) {
      const json = await res.json();
      const found = json.data?.find((r: any) => r.id === id);
      if (found) setSelectedRow(found);
    }
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

  async function handleStatusChange(id: string, newStatus: string) {
    setSelectedRow((prev: any) => prev?.id === id ? { ...prev, status: newStatus } : prev);
    const res = await fetch('/api/admin/volunteers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (!res.ok) {
      console.error('Status update failed', await res.text());
      fetchData();
      return;
    }
    fetchData();
  }

  function openDetail(row: any) {
    setSelectedRow(row);
    setModalOpen(true);
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
        onRowClick={openDetail}
      />

      <DetailModal open={modalOpen} onClose={() => setModalOpen(false)} title="Volunteer Application">
        {selectedRow && (() => {
          const p = selectedRow.profiles || {};
          return (
            <>
              <div style={{
                background: 'var(--cream)',
                borderRadius: 14, padding: '18px 22px',
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '8px 28px', fontSize: 13, marginBottom: 24,
              }}>
                <Row label="Name" value={p.full_name} />
                <Row label="Email" value={p.email} />
                <Row label="WhatsApp" value={p.whatsapp_number} />
                <Row label="Age" value={p.age} />
                <Row label="Gender" value={selectedRow.gender} />
                <Row label="College" value={p.college} />
                <Row label="Stream" value={p.stream} />
                <Row label="City" value={selectedRow.city} />
                <Row label="Languages" value={selectedRow.languages} />
              </div>

              <div style={{
                marginBottom: 20,
              }}>
                <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--admin-faint)', marginBottom: 6 }}>
                  Previous Event Experience
                </h4>
                <div style={{
                  fontSize: 13, color: 'var(--admin-muted)',
                  lineHeight: 1.6, background: 'var(--cream)',
                  borderRadius: 8, padding: '10px 14px',
                }}>
                  {selectedRow.experience}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--admin-faint)', marginBottom: 6 }}>
                  Why Volunteer
                </h4>
                <div style={{
                  fontSize: 13, color: 'var(--admin-muted)',
                  lineHeight: 1.6, background: 'var(--cream)',
                  borderRadius: 8, padding: '10px 14px',
                }}>
                  {selectedRow.why_volunteer}
                </div>
              </div>

              {selectedRow.instagram_id && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--admin-faint)', marginBottom: 6 }}>
                    Instagram
                  </h4>
                  <div style={{ fontSize: 13, color: 'var(--admin-muted)' }}>
                    {selectedRow.instagram_id}
                  </div>
                </div>
              )}

              <div style={{
                display: 'flex', gap: 6, flexWrap: 'wrap',
                paddingTop: 16, borderTop: '1px solid var(--admin-line)',
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '0.06em', color: 'var(--admin-faint)',
                  width: '100%', marginBottom: 4,
                }}>
                  Change Status
                </span>
                {volStatusActions.map((action) => {
                  const active = selectedRow.status === action.label;
                  return (
                    <button
                      key={action.label}
                      onClick={() => handleStatusChange(selectedRow.id, action.label)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '6px 12px', borderRadius: 9999,
                        border: `1.5px solid ${active ? action.color : 'var(--admin-line)'}`,
                        background: active ? `${action.color}18` : 'transparent',
                        color: active ? action.color : 'var(--admin-faint)',
                        fontWeight: 600, fontSize: 11,
                        fontFamily: "'Inter', sans-serif",
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{action.icon}</span>
                      {action.label}
                    </button>
                  );
                })}
              </div>
            </>
          );
        })()}
      </DetailModal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <span style={{ color: 'var(--admin-faint)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</span>
      <div style={{ color: 'var(--ink)', fontWeight: 500, marginTop: 1 }}>{value ?? '—'}</div>
    </div>
  );
}
