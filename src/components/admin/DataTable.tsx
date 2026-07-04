'use client';

import { useState } from 'react';
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
    if (sortKey !== key) return <span style={{ opacity: 0.2, marginLeft: 4 }}>↕</span>;
    return <span style={{ marginLeft: 4 }}>{sortOrder === 'asc' ? '↑' : '↓'}</span>;
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
        gap: 12,
        marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
          <div style={{
            position: 'relative',
            flex: 1,
            minWidth: 200,
            maxWidth: 360,
          }}>
            <svg style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              opacity: 0.3,
            }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(247,247,247,0.04)',
                border: '1px solid var(--line)',
                borderRadius: 6,
                padding: '9px 12px 9px 34px',
                color: 'var(--white)',
                fontFamily: "'Inter', sans-serif",
                fontSize: 13,
                outline: 'none',
              }}
            />
          </div>

          {statusOptions && (
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilter(e.target.value)}
              style={{
                background: 'rgba(247,247,247,0.04)',
                border: '1px solid var(--line)',
                borderRadius: 6,
                padding: '9px 12px',
                color: 'var(--white)',
                fontFamily: "'Inter', sans-serif",
                fontSize: 12,
                outline: 'none',
                cursor: 'pointer',
                minWidth: 140,
              }}
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ background: '#111' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Export buttons */}
        <div style={{ position: 'relative', display: 'flex', gap: 8 }}>
          {(onExportCSV || onExportExcel) && (
            <>
              <button
                onClick={() => setShowExport(!showExport)}
                style={{
                  background: 'rgba(247,247,247,0.04)',
                  border: '1px solid var(--line)',
                  borderRadius: 6,
                  padding: '9px 14px',
                  color: 'rgba(247,247,247,0.7)',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
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
                    marginTop: 4,
                    background: 'var(--ink2)',
                    border: '1px solid var(--line)',
                    borderRadius: 8,
                    padding: 6,
                    zIndex: 100,
                    minWidth: 180,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  }}>
                    {onExportCSV && (
                      <button onClick={() => { onExportCSV(); setShowExport(false); }}
                        style={dropdownItemStyle}>
                        <span style={{ opacity: 0.4, width: 20, display: 'inline-block' }}>📄</span>
                        Export as CSV
                      </button>
                    )}
                    {onExportExcel && (
                      <button onClick={() => { onExportExcel(); setShowExport(false); }}
                        style={dropdownItemStyle}>
                        <span style={{ opacity: 0.4, width: 20, display: 'inline-block' }}>📊</span>
                        Export as Excel (.xlsx)
                      </button>
                    )}
                    {onSyncSheets && (
                      <button onClick={() => { onSyncSheets(); setShowExport(false); }}
                        style={dropdownItemStyle}>
                        <span style={{ opacity: 0.4, width: 20, display: 'inline-block' }}>☁️</span>
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
          borderRadius: 8,
          padding: '10px 16px',
          marginBottom: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <span style={{ fontSize: 13, color: 'rgba(247,247,247,0.7)' }}>
            <strong style={{ color: 'var(--orange)' }}>{selected.size}</strong> row(s) selected
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {filename === 'registrations' && (
              <button onClick={() => handleBulk('slot')} style={bulkBtnStyle}>
                Assign Slot
              </button>
            )}
            <button onClick={() => handleBulk('approve')} style={{ ...bulkBhBtnStyle, borderColor: 'rgba(0,224,209,0.3)', color: 'var(--teal)' }}>
              Approve
            </button>
            <button onClick={() => handleBulk('pending')} style={{ ...bulkBhdBtnStyle, borderColor: 'rgba(255,184,0,0.3)', color: 'var(--orange)' }}>
              Mark Pending
            </button>
            <button onClick={() => handleBulk('reject')} style={{ ...bulkBhdBtnStyle, borderColor: 'rgba(255,46,138,0.3)', color: 'var(--pink)' }}>
              Reject
            </button>
            <button onClick={() => setSelected(new Set())} style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(247,247,247,0.3)',
              cursor: 'pointer',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12,
              padding: '6px 10px',
            }}>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{
        overflowX: 'auto',
        border: '1px solid var(--line)',
        borderRadius: 10,
        background: 'rgba(26,26,26,0.4)',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 13,
          fontFamily: "'Inter', sans-serif",
        }}>
          <thead>
            <tr style={{
              borderBottom: '1px solid var(--line)',
              background: 'rgba(13,13,15,0.5)',
            }}>
              <th style={{ ...thStyle, width: 36, textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={data.length > 0 && selected.size === data.length}
                  onChange={toggleSelectAll}
                  style={{ accentColor: 'var(--orange)', cursor: 'pointer' }}
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
                      border: '2px solid var(--purple)',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      margin: '0 auto 12px',
                      animation: 'dtSpin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes dtSpin{to{transform:rotate(360deg)}}`}</style>
                    <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 14, color: 'rgba(247,247,247,0.4)' }}>Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 18, color: 'rgba(247,247,247,0.2)', letterSpacing: '0.03em' }}>
                    No data found
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(247,247,247,0.2)', marginTop: 6 }}>
                    {searchValue || statusFilter ? 'Try adjusting your search or filters' : 'Nothing to show yet'}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row: any, idx: number) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: '1px solid rgba(247,247,247,0.04)',
                    background: idx % 2 === 0 ? 'transparent' : 'rgba(247,247,247,0.015)',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,184,0,0.03)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(247,247,247,0.015)'}
                >
                  <td style={{ ...tdStyle, width: 36, textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selected.has(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      style={{ accentColor: 'var(--orange)', cursor: 'pointer' }}
                    />
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} style={tdStyle}>
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
          marginTop: 16,
          fontSize: 12,
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <span style={{ color: 'rgba(247,247,247,0.4)' }}>
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
                    color: p === page ? 'var(--ink)' : 'rgba(247,247,247,0.5)',
                    fontWeight: p === page ? 700 : 400,
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
              background: 'rgba(13,13,15,0.8)',
              border: '1px solid var(--orange)',
              borderRadius: 4,
              padding: '4px 6px',
              color: 'var(--white)',
              fontSize: 12,
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
              width: '100%',
              cursor: 'pointer',
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
            background: 'rgba(13,13,15,0.8)',
            border: '1px solid var(--orange)',
            borderRadius: 4,
            padding: '4px 6px',
            color: 'var(--white)',
            fontSize: 12,
            fontFamily: "'Inter', sans-serif",
            outline: 'none',
            width: '100%',
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
            padding: '2px 0',
            borderRadius: 4,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            transition: 'background 0.1s',
          }}
          title={isStatus ? 'Click to edit status' : 'Click to edit'}
        >
          {isStatus ? <StatusBadge status={value} /> : <span>{value}</span>}
          {saving && editing?.id === row.id && editing?.key === col.key && (
            <span style={{ fontSize: 10, color: 'var(--orange)' }}>...</span>
          )}
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
  padding: '10px 14px',
  textAlign: 'left',
  fontFamily: "'Space Mono', monospace",
  fontSize: 10,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: 'rgba(247,247,247,0.4)',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '10px 14px',
  color: 'rgba(247,247,247,0.8)',
  fontSize: 12,
  lineHeight: 1.4,
  verticalAlign: 'middle',
};

const dropdownItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 12px',
  background: 'none',
  border: 'none',
  color: 'rgba(247,247,247,0.7)',
  fontFamily: "'Inter', sans-serif",
  fontSize: 12,
  cursor: 'pointer',
  textAlign: 'left',
  borderRadius: 4,
};

const bulkBtnStyle: React.CSSProperties = {
  background: 'rgba(123,44,255,0.1)',
  border: '1px solid rgba(123,44,255,0.25)',
  borderRadius: 6,
  padding: '6px 14px',
  color: 'var(--purple)',
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
};

const bulkBhBtnStyle: React.CSSProperties = {
  background: 'rgba(0,224,209,0.06)',
  border: '1px solid rgba(0,224,209,0.3)',
  borderRadius: 6,
  padding: '6px 14px',
  color: 'var(--teal)',
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
};

const bulkBhdBtnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--line)',
  borderRadius: 6,
  padding: '6px 14px',
  color: 'rgba(247,247,247,0.5)',
  fontFamily: "'Inter', sans-serif",
  fontSize: 11,
  fontWeight: 600,
  cursor: 'pointer',
};

function pageBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    background: 'transparent',
    border: '1px solid var(--line)',
    borderRadius: 4,
    padding: '6px 10px',
    color: disabled ? 'rgba(247,247,247,0.15)' : 'rgba(247,247,247,0.5)',
    fontFamily: "'Inter', sans-serif",
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.3 : 1,
    minWidth: 30,
    textAlign: 'center',
  };
}
