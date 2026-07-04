'use client';

import { useEffect, useState } from 'react';
import StatusBadge from './StatusBadge';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => React.ReactNode;
  editable?: boolean;
  editType?: 'select' | 'text';
  editOptions?: string[];
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  total: number;
  page: number;
  perPage: number;
  sortKey: string;
  sortOrder: 'asc' | 'desc';
  loading?: boolean;
  searchValue?: string;
  statusFilter?: string;
  statusOptions?: { label: string; value: string }[];
  onSearch: (value: string) => void;
  onSort: (key: string) => void;
  onPageChange: (page: number) => void;
  onStatusFilter: (value: string) => void;
  onEdit: (id: string, key: string, value: any) => Promise<void>;
  onBulkAction: (ids: string[], action: string) => Promise<void>;
  onExportCSV?: () => void;
  onExportExcel?: () => void;
  onSyncSheets?: () => void;
  filename: string;
}

export default function DataTable({
  columns, data, total, page, perPage,
  sortKey, sortOrder, loading,
  searchValue = '', statusFilter = '', statusOptions,
  onSearch, onSort, onPageChange, onStatusFilter,
  onEdit, onBulkAction,
  onExportCSV, onExportExcel, onSyncSheets,
  filename,
}: DataTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<{ id: string; key: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [bulkMode, setBulkMode] = useState<'none' | 'approve' | 'reject' | 'slot'>('none');
  const [showExport, setShowExport] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const totalPages = Math.ceil(total / perPage);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selected.size === data.length && data.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data.map((d: any) => d.id)));
    }
  }

  function getNestedValue(obj: any, path: string) {
    return path.split('.').reduce((acc, part) => acc?.[part], obj);
  }

  function renderSortIcon(key: string) {
    if (sortKey !== key) return <span style={{ opacity: 0.2, marginLeft: 6, fontSize: 10 }}>⇅</span>;
    return <span style={{ marginLeft: 6, fontSize: 10 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
  }

  async function handleInlineSave(id: string, key: string) {
    setSaving(true);
    try {
      await onEdit(id, key, editValue);
      setEditing(null);
      setEditValue('');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(id: string, key: string, currentValue: any) {
    if (loading || saving) return;
    setEditing({ id, key });
    setEditValue(String(currentValue ?? ''));
  }

  async function handleBulk(action: string) {
    if (selected.size === 0) return;
    await onBulkAction(Array.from(selected), action);
    setSelected(new Set());
    setBulkMode('none');
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: isMobile ? 10 : 14,
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 10, flexWrap: 'wrap', flex: 1 }}>
          <div style={{
            position: 'relative',
            flex: 1,
            minWidth: isMobile ? 140 : 200,
            maxWidth: isMobile ? '100%' : 360,
          }}>
            <svg style={{
              position: 'absolute',
              left: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              opacity: 0.3,
            }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(247,247,247,0.05)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                padding: '10px 12px 10px 36px',
                color: 'var(--white)',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--orange)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--line)'}
            />
          </div>

          {statusOptions && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              style={{
                background: 'rgba(247,247,247,0.05)',
                border: '1px solid var(--line)',
                borderRadius: 8,
                padding: '10px 32px 10px 12px',
                color: 'var(--white)',
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                outline: 'none',
                cursor: 'pointer',
                minWidth: 150,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23F7F7F7'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = 'var(--orange)'}
              onBlur={(e) => e.currentTarget.style.borderColor = 'var(--line)'}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#111' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Export button */}
        <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
          {(onExportCSV || onExportExcel) && (
            <>
              <button
                onClick={() => setShowExport(!showExport)}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--line)',
                  borderRadius: 8,
                  padding: '10px 16px',
                  color: 'rgba(247,247,247,0.65)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  transition: 'border-color 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--orange)'; e.currentTarget.style.color = 'var(--orange)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'rgba(247,247,247,0.65)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export
              </button>
              {showExport && (
                <>
                  <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99,
                  }} onClick={() => setShowExport(false)} />
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 6,
                    background: 'rgba(20,20,22,0.95)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid var(--line)',
                    borderRadius: 10,
                    padding: 6,
                    zIndex: 100,
                    minWidth: 190,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                  }}>
                    {onExportCSV && (
                      <button onClick={() => { onExportCSV(); setShowExport(false); }}
                        style={dropdownItemStyle}>
                        <span style={{ opacity: 0.3, width: 20, display: 'inline-flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                        </span>
                        Export as CSV
                      </button>
                    )}
                    {onExportExcel && (
                      <button onClick={() => { onExportExcel(); setShowExport(false); }}
                        style={dropdownItemStyle}>
                        <span style={{ opacity: 0.3, width: 20, display: 'inline-flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" /></svg>
                        </span>
                        Export as Excel (.xlsx)
                      </button>
                    )}
                    {onSyncSheets && (
                      <button onClick={() => { onSyncSheets(); setShowExport(false); }}
                        style={dropdownItemStyle}>
                        <span style={{ opacity: 0.3, width: 20, display: 'inline-flex', alignItems: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
                        </span>
                        Sync to Google Sheets
                      </button>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div style={{
          background: 'rgba(255,184,0,0.06)',
          border: '1px solid rgba(255,184,0,0.15)',
          borderRadius: 10,
          padding: '12px 18px',
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          backdropFilter: 'blur(8px)',
        }}>
          <span style={{ fontSize: 13, color: 'rgba(247,247,247,0.7)' }}>
            <strong style={{ color: 'var(--orange)', fontFamily: "'Space Mono', monospace", fontSize: 14 }}>{selected.size}</strong> row(s) selected
          </span>
          <div style={{ display: 'flex', gap: isMobile ? 4 : 8, flexWrap: 'wrap' }}>
            {filename === 'registrations' && (
              <button onClick={() => handleBulk('slot')} style={bulkBtnStyle}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ marginRight: 4, verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Assign Slot
              </button>
            )}
            <button onClick={() => handleBulk('approve')} style={{ ...bulkBtnStyle, borderColor: 'rgba(0,224,209,0.3)', color: 'var(--teal)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 4, verticalAlign: 'middle' }}><polyline points="20 6 9 17 4 12" /></svg>
              Approve
            </button>
            <button onClick={() => handleBulk('pending')} style={{ ...bulkBtnStyle, borderColor: 'rgba(255,184,0,0.3)', color: 'var(--orange)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ marginRight: 4, verticalAlign: 'middle' }}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Mark Pending
            </button>
            <button onClick={() => handleBulk('reject')} style={{ ...bulkBtnStyle, borderColor: 'rgba(255,46,138,0.3)', color: 'var(--pink)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" style={{ marginRight: 4, verticalAlign: 'middle' }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              Reject
            </button>
            <button onClick={() => setSelected(new Set())} style={{
              background: 'transparent',
              border: '1px solid var(--line)',
              borderRadius: 6,
              color: 'rgba(247,247,247,0.3)',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontSize: 11,
              padding: '6px 12px',
              transition: 'color 0.15s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(247,247,247,0.6)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(247,247,247,0.3)'}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table card */}
      <div style={{
        overflowX: 'auto',
        border: '1px solid var(--line)',
        borderRadius: 12,
        background: 'rgba(26,26,26,0.5)',
        backdropFilter: 'blur(4px)',
        position: 'relative',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: isMobile ? 12 : 13,
          fontFamily: "'Inter', sans-serif",
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--line)',
              background: 'rgba(13,13,15,0.6)',
            }}>
              <th style={{ ...thStyle, width: 36, textAlign: 'center', ...(isMobile ? { padding: '8px 6px' } : {}) }}>
                <input
                  type="checkbox"
                  checked={data.length > 0 && selected.size === data.length}
                  onChange={toggleSelectAll}
                  style={{ accentColor: 'var(--orange)', cursor: 'pointer', width: isMobile ? 13 : 15, height: isMobile ? 13 : 15 }}
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    ...thStyle,
                    width: col.width,
                    cursor: col.sortable ? 'pointer' : 'default',
                    userSelect: 'none',
                    ...(isMobile ? { padding: '8px 6px', fontSize: 9 } : {}),
                  }}
                  onClick={() => col.sortable && onSort(col.key)}
                >
                  {col.label}
                  {col.sortable && renderSortIcon(col.key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 60 }}>
                  <div>
                    <div style={{
                      width: 28,
                      height: 28,
                      border: '2px solid var(--orange)',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                      animation: 'dtSpin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes dtSpin{to{transform:rotate(360deg)}}`}</style>
                    <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 14, letterSpacing: '0.03em', color: 'rgba(247,247,247,0.4)' }}>Loading</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(247,247,247,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    border: '1px solid var(--line)',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(247,247,247,0.2)" strokeWidth={1.5} strokeLinecap="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg>
                  </div>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, color: 'rgba(247,247,247,0.2)', letterSpacing: '0.03em' }}>
                    No data found
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(247,247,247,0.15)', marginTop: 6 }}>
                    {searchValue || statusFilter ? 'Try adjusting your search or filters' : 'Nothing to show yet'}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row: any, idx: number) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: idx < data.length - 1 ? '1px solid rgba(247,247,247,0.04)' : 'none',
                    background: selected.has(row.id) ? 'rgba(255,184,0,0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(247,247,247,0.01)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => {
                    if (!selected.has(row.id)) e.currentTarget.style.background = 'rgba(255,184,0,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    if (!selected.has(row.id)) e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(247,247,247,0.01)';
                  }}
                >
                  <td style={{ ...tdStyle, width: 36, textAlign: 'center', ...(isMobile ? { padding: '7px 6px' } : {}) }}>
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      style={{ accentColor: 'var(--orange)', cursor: 'pointer', width: isMobile ? 13 : 15, height: isMobile ? 13 : 15 }}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} style={{ ...tdStyle, ...(isMobile ? { padding: '7px 6px', fontSize: 11 } : {}) }}>
                      {renderCell(col, row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 18,
          fontSize: 12,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <span style={{
            color: 'rgba(247,247,247,0.35)',
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              style={pageBtnStyle(page <= 1)}
            >
              ‹
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let p: number;
              if (totalPages <= 7) {
                p = i + 1;
              } else if (page <= 4) {
                p = i + 1;
              } else if (page >= totalPages - 3) {
                p = totalPages - 6 + i;
              } else {
                p = page - 3 + i;
              }
              return (
                <button
                  key={p}
                  onClick={() => onPageChange(p)}
                  style={{
                    ...pageBtnStyle(false),
                    background: p === page ? 'var(--orange)' : 'transparent',
                    color: p === page ? 'var(--ink)' : 'rgba(247,247,247,0.45)',
                    fontWeight: p === page ? 700 : 500,
                  }}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              style={pageBtnStyle(page >= totalPages)}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function renderCell(col: Column, row: any) {
    const value = getNestedValue(row, col.key);

    if (col.editable && editing?.id === row.id && editing?.key === col.key) {
      if (col.editType === 'select' && col.editOptions) {
        return (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleInlineSave(row.id, col.key)}
            autoFocus
            style={{
              background: 'rgba(13,13,15,0.9)',
              border: '1.5px solid var(--orange)',
              borderRadius: 6,
              padding: '6px 8px',
              color: 'var(--white)',
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
              width: '100%',
              cursor: 'pointer',
              boxShadow: '0 0 0 3px rgba(255,184,0,0.1)',
            }}
          >
            {col.editOptions.map((opt) => (
              <option key={opt} value={opt} style={{ background: '#111' }}>{opt}</option>
            ))}
          </select>
        );
      }
      return (
        <input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleInlineSave(row.id, col.key)}
          onKeyDown={(e) => e.key === 'Enter' && handleInlineSave(row.id, col.key)}
          autoFocus
          style={{
            background: 'rgba(13,13,15,0.9)',
            border: '1.5px solid var(--orange)',
            borderRadius: 6,
            padding: '6px 8px',
            color: 'var(--white)',
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            outline: 'none',
            width: '100%',
            boxShadow: '0 0 0 3px rgba(255,184,0,0.1)',
          }}
        />
      );
    }

    if (col.render) return col.render(value, row);

    if (col.editable) {
      const isStatus = col.editType === 'select';
      return (
        <div
          onClick={() => startEdit(row.id, col.key, value)}
          style={{
            cursor: 'pointer',
            padding: '3px 0',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'background 0.1s',
            borderBottom: '1px dashed transparent',
          }}
          title={isStatus ? 'Click to edit status' : 'Click to edit'}
          onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = 'rgba(255,184,0,0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
        >
          {isStatus ? <StatusBadge status={value} /> : <span>{value}</span>}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,184,0,0.3)" strokeWidth={2} strokeLinecap="round" style={{ flexShrink: 0 }}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </div>
      );
    }

    if (typeof value === 'string' && value.length > 80) {
      return <span title={value}>{value.slice(0, 80)}…</span>;
    }

    return <span>{value ?? '—'}</span>;
  }
}

const thStyle: React.CSSProperties = {
  padding: '11px 14px',
  textAlign: 'left',
  fontFamily: "'Space Mono', monospace",
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: 'rgba(247,247,247,0.35)',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  color: 'rgba(247,247,247,0.75)',
  fontSize: 12,
  lineHeight: 1.5,
  verticalAlign: 'middle',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  width: '100%',
  padding: '9px 12px',
  background: 'none',
  border: 'none',
  color: 'rgba(247,247,247,0.7)',
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  cursor: 'pointer',
  textAlign: 'left',
  borderRadius: 6,
  transition: 'background 0.1s',
};

const bulkBtnStyle: React.CSSProperties = {
  background: 'rgba(123,44,255,0.08)',
  border: '1px solid rgba(123,44,255,0.2)',
  borderRadius: 6,
  padding: '7px 14px',
  color: 'var(--purple)',
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  transition: 'all 0.15s',
};

function pageBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: 'transparent',
    border: '1px solid var(--line)',
    borderRadius: 6,
    padding: '7px 12px',
    color: disabled ? 'rgba(247,247,247,0.12)' : 'rgba(247,247,247,0.45)',
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.3 : 1,
    minWidth: 34,
    textAlign: 'center',
    transition: 'all 0.1s',
  };
}
