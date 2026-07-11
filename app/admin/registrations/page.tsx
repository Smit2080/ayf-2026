'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DataTable, { Column } from '@/components/admin/DataTable';
import StatusBadge from '@/components/admin/StatusBadge';
import DetailModal from '@/components/admin/DetailModal';

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Pending Audition', value: 'Pending Audition' },
  { label: 'Slot Allotted', value: 'Slot Allotted' },
  { label: 'Confirmed', value: 'Confirmed' },
  { label: 'Failed', value: 'Failed' },
];

const columns: Column[] = [
  { key: 'profiles.full_name', label: 'Name', sortable: true },
  { key: 'profiles.email', label: 'Email', sortable: true },
  { key: 'profiles.whatsapp_number', label: 'WhatsApp', sortable: true },
  { key: 'profiles.college', label: 'College' },
  { key: 'competition_name', label: 'Competition', sortable: true },
  {
    key: 'status', label: 'Status', sortable: true,
    editable: true, editType: 'select',
    editOptions: ['Pending Audition', 'Slot Allotted', 'Confirmed', 'Failed'],
    render: (val: string) => <StatusBadge status={val} />,
  },
  {
    key: 'audition_slot', label: 'Audition Slot', sortable: true,
    editable: true, editType: 'text',
    render: (val: string) => val || '—',
  },
  {
    key: 'created_at', label: 'Registered', sortable: true,
    render: (val: string) => new Date(val).toLocaleDateString('en-IN'),
  },
];

const statusActions = [
  { label: 'Pending Audition', icon: '⏳', color: 'var(--admin-orange)' },
  { label: 'Slot Allotted', icon: '🕐', color: '#8B5CF6' },
  { label: 'Confirmed', icon: '✓', color: '#22C55E' },
  { label: 'Failed', icon: '✕', color: '#EF4444' },
];

export default function AdminRegistrations() {
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
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userEntries, setUserEntries] = useState<any[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);

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
      const res = await fetch(`/api/admin/registrations?${params}`);
      if (!res.ok) throw new Error('Registrations fetch failed');
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
    const updateKey = key === 'status' ? 'status' : key === 'audition_slot' ? 'audition_slot' : key;
    const res = await fetch('/api/admin/registrations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [updateKey]: value }),
    });
    if (!res.ok) { console.error('Edit failed', await res.text()); return; }
    fetchData();
    if (modalOpen && selectedUser) refreshUserEntries(selectedUser.id);
  }

  async function handleBulkAction(ids: string[], action: string) {
    const statusMap: Record<string, string> = {
      approve: 'Confirmed',
      pending: 'Pending Audition',
      reject: 'Failed',
      slot: 'Slot Allotted',
    };
    const res = await fetch('/api/admin/registrations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bulk: true, ids, status: statusMap[action] }),
    });
    if (!res.ok) { console.error('Bulk action failed', await res.text()); return; }
    fetchData();
  }

  async function openDetail(row: any) {
    const profile = row.profiles || {};
    setSelectedUser(profile);
    setModalOpen(true);
    setEntriesLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations?user_id=${row.user_id}&perPage=100`);
      const json = await res.json();
      setUserEntries(json.data || []);
    } catch { setUserEntries([]); }
    setEntriesLoading(false);
  }

  async function refreshUserEntries(userId: string) {
    try {
      const res = await fetch(`/api/admin/registrations?user_id=${userId}&perPage=100`);
      const json = await res.json();
      setUserEntries(json.data || []);
    } catch { /* ignore */ }
  }

  async function handleStatusChange(entryId: string, newStatus: string) {
    const prevEntries = userEntries;
    setUserEntries((prev) =>
      prev.map((e) => (e.id === entryId ? { ...e, status: newStatus } : e))
    );
    try {
      const res = await fetch('/api/admin/registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: entryId, status: newStatus }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fetchData();
    } catch (e) {
      console.error('Status update failed:', e);
      setUserEntries(prevEntries);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: 'clamp(24px, 2.5vw, 30px)', letterSpacing: '-0.01em', lineHeight: 1, color: 'var(--ink)' }}>
          Competition <span style={{ color: 'var(--orange)' }}>Registrations</span>
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--admin-muted)', marginTop: 8, fontWeight: 500 }}>
          Manage audition slots, approve entries, track statuses
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
        onExportCSV={() => window.open('/api/admin/export?type=registrations&format=csv', '_blank')}
        onExportExcel={() => window.open('/api/admin/export?type=registrations&format=xlsx', '_blank')}
        filename="registrations"
        onRowClick={openDetail}
      />

      <DetailModal open={modalOpen} onClose={() => setModalOpen(false)} title="Participant Details">
        {selectedUser && (
          <>
            <div style={{
              background: 'var(--cream)',
              borderRadius: 14, padding: '18px 22px',
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '8px 28px', fontSize: 13, marginBottom: 24,
            }}>
              <Row label="Name" value={selectedUser.full_name} />
              <Row label="Email" value={selectedUser.email} />
              <Row label="WhatsApp" value={selectedUser.whatsapp_number} />
              <Row label="Age" value={selectedUser.age} />
              <Row label="College" value={selectedUser.college} />
              <Row label="Stream" value={selectedUser.stream} />
            </div>

            <h3 style={{
              fontFamily: "'Playfair Display', serif", fontWeight: 700,
              fontSize: 16, color: 'var(--ink)', marginBottom: 14,
            }}>
              Competition Entries
            </h3>

            {entriesLoading ? (
              <p style={{ fontSize: 13, color: 'var(--admin-faint)', padding: '20px 0', textAlign: 'center' }}>Loading entries...</p>
            ) : userEntries.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--admin-faint)', padding: '20px 0', textAlign: 'center' }}>No entries found</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {userEntries.map((entry: any) => (
                  <div key={entry.id} style={{
                    border: '1px solid var(--admin-line)',
                    borderRadius: 14, padding: '16px 20px',
                  }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      alignItems: 'flex-start', marginBottom: 8,
                      flexWrap: 'wrap', gap: 8,
                    }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)' }}>
                          {entry.competition_name}
                        </div>
                        {entry.audition_slot && (
                          <div style={{ fontSize: 12, color: 'var(--admin-faint)', marginTop: 2 }}>
                            Slot: {entry.audition_slot}
                          </div>
                        )}
                      </div>
                      <StatusBadge status={entry.status} showIcon />
                    </div>

                    <div style={{
                      fontSize: 12, color: 'var(--admin-muted)',
                      lineHeight: 1.6, marginBottom: 12,
                      background: 'var(--cream)', borderRadius: 8,
                      padding: '10px 14px',
                    }}>
                      {entry.performance_details}
                    </div>

                    <div style={{
                      display: 'flex', gap: 6, flexWrap: 'wrap',
                    }}>
                      {statusActions.map((action) => {
                        const active = entry.status === action.label;
                        return (
                          <button
                            key={action.label}
                            onClick={() => handleStatusChange(entry.id, action.label)}
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
                            {action.label === 'Pending Audition' ? 'Pending' : action.label === 'Slot Allotted' ? 'Slot' : action.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
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
