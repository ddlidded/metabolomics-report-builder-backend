import { useState, useMemo } from 'react';
import { X, FileSpreadsheet, CheckSquare, Square, AlertCircle, ChevronRight } from 'lucide-react';

export interface DetectedGroup {
  name: string;
  count: number;
  isQC: boolean;
}

interface CSVImportModalProps {
  onClose: () => void;
  onGenerate: (selectedGroups: string[]) => void;
  groups: DetectedGroup[];
  fileName: string;
  metabolites: number;
  isLoading?: boolean;
}

export function CSVImportModal({
  onClose,
  onGenerate,
  groups,
  fileName,
  metabolites,
  isLoading = false,
}: CSVImportModalProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map(g => [g.name, !g.isQC]))
  );

  const toggle = (name: string) => setChecked(p => ({ ...p, [name]: !p[name] }));
  const selectAll = () => setChecked(Object.fromEntries(groups.map(g => [g.name, true])));
  const selectNone = () => setChecked(Object.fromEntries(groups.map(g => [g.name, false])));

  const selectedCount = Object.values(checked).filter(Boolean).length;
  const selectedGroups = useMemo(
    () => groups.filter(g => checked[g.name]).map(g => g.name),
    [groups, checked]
  );

  const handleGenerate = () => {
    if (selectedGroups.length === 0 || isLoading) return;
    onGenerate(selectedGroups);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(17,17,42,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{ width: 520, maxHeight: '85vh', backgroundColor: 'white', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between px-6 py-5"
          style={{ borderBottom: '1px solid #E2E8F0' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#f0fdfa' }}
            >
              <FileSpreadsheet size={18} style={{ color: '#17A398' }} />
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#17172A' }}>
                Choose groups for bar plot generation
              </h2>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                CSV detected: <span style={{ fontFamily: 'DM Mono, monospace', color: '#334155' }}>{fileName}</span>
              </p>
              <div className="flex items-center gap-3 mt-1.5">
                <span style={{ fontSize: 11, color: '#64748B' }}>
                  {groups.length} groups · {metabolites || '—'} metabolites · {groups.reduce((s, g) => s + g.count, 0)} samples
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: '#F4F6FA', color: '#64748B' }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Helper text */}
        <div
          className="mx-6 mt-4 rounded-lg p-3 flex gap-2.5"
          style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
        >
          <AlertCircle size={14} style={{ color: '#92400e', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.6 }}>
            Unchecked groups will be excluded before plots are generated. This is useful for removing
            blanks, QC samples, media controls, or unrelated groups.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-3">
          <div style={{ fontSize: 12, color: '#64748B' }}>
            <strong style={{ color: '#17172A' }}>{selectedCount}</strong> of {groups.length} groups selected
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: '#EEF0F9', color: '#1E1B4B', fontSize: 12, fontWeight: 500 }}
            >
              <CheckSquare size={13} /> Select All
            </button>
            <button
              onClick={selectNone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: '#F4F6FA', color: '#64748B', fontSize: 12, fontWeight: 500 }}
            >
              <Square size={13} /> Select None
            </button>
          </div>
        </div>

        {/* Group list */}
        <div className="overflow-y-auto flex-1 px-6">
          <div className="flex flex-col gap-1 pb-4">
            {groups.map(group => (
              <label
                key={group.name}
                className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all"
                style={{
                  backgroundColor: checked[group.name] ? '#f3f1ff' : '#F8F9FC',
                  border: `1.5px solid ${checked[group.name] ? '#c4b5fd' : '#F1F3F9'}`,
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checked[group.name]}
                  onChange={() => toggle(group.name)}
                  style={{ accentColor: '#1E1B4B', width: 15, height: 15 }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#17172A', fontFamily: 'DM Mono, monospace' }}>
                      {group.name}
                    </span>
                    {group.isQC && (
                      <span
                        className="rounded-full px-2 py-0.5"
                        style={{ backgroundColor: '#fef3c7', color: '#92400e', fontSize: 10, fontWeight: 600 }}
                      >
                        QC
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 11, color: '#64748B' }}>{group.count} samples</span>
                </div>
                <div
                  className="rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: checked[group.name] ? '#ede9fe' : '#F1F3F9',
                    color: checked[group.name] ? '#5b21b6' : '#94a3b8',
                    fontSize: 11, fontWeight: 600
                  }}
                >
                  {checked[group.name] ? 'Included' : 'Excluded'}
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#F8F9FC' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-medium transition-colors"
            style={{ backgroundColor: '#F4F6FA', color: '#64748B', fontSize: 13, border: '1px solid #E2E8F0' }}
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 12, color: '#64748B' }}>
              Will generate <strong style={{ color: '#17172A' }}>{metabolites || '—'} plots</strong>
            </span>
            <button
              onClick={handleGenerate}
              disabled={selectedCount === 0 || isLoading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all"
              style={{
                backgroundColor: selectedCount > 0 && !isLoading ? '#17A398' : '#cbd5e1',
                color: 'white', fontSize: 13,
                cursor: selectedCount > 0 && !isLoading ? 'pointer' : 'not-allowed',
              }}
            >
              {isLoading ? 'Generating…' : 'Generate Plots'}
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
