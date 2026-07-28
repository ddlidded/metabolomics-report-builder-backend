import { useRef } from 'react';
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle, Settings } from 'lucide-react';
import type { DetectedGroup } from './CSVImportModal';

interface CsvGeneratorPanelProps {
  csvFile?: File | null;
  groups?: DetectedGroup[];
  isLoading?: boolean;
  onImportCSV: () => void;
  onCsvUpload: (file: File) => void;
}

export function CsvGeneratorPanel({
  csvFile,
  groups = [],
  isLoading,
  onImportCSV,
  onCsvUpload,
}: CsvGeneratorPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvLoaded = !!csvFile;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCsvUpload(file);
      e.target.value = '';
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8F9FC' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="mb-6">
        <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 16 }}>CSV Plot Generator</h2>
        <p style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>
          Import a CSV file to automatically generate individual metabolite bar plots.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* CSV Upload */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: '#17172A', fontSize: 14 }}>1. Import CSV File</h3>

          {!csvLoaded ? (
            <button
              onClick={openFilePicker}
              disabled={isLoading}
              className="w-full rounded-xl flex flex-col items-center justify-center gap-3 transition-all"
              style={{
                height: 180, border: '2px dashed #D9D9E3', backgroundColor: '#F8F9FC',
                cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.6 : 1,
              }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EEF0F9' }}>
                <Upload size={22} style={{ color: '#818cf8' }} />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>Click to import CSV</p>
                <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>Normalized peak area data (.csv)</p>
              </div>
            </button>
          ) : (
            <div
              className="rounded-xl flex items-center gap-3 p-4"
              style={{ backgroundColor: '#f0fdfa', border: '1.5px solid #99f6e4' }}
            >
              <CheckCircle2 size={20} style={{ color: '#17A398', flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13, fontWeight: 600, color: '#134e4a' }}>CSV loaded successfully</p>
                <p style={{ fontSize: 11, color: '#0d9488', marginTop: 1, fontFamily: 'DM Mono, monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {csvFile?.name}
                </p>
              </div>
              <button
                onClick={openFilePicker}
                disabled={isLoading}
                style={{ fontSize: 11, color: '#64748B', flexShrink: 0 }}
              >
                Replace
              </button>
            </div>
          )}

          <div
            className="rounded-lg p-3 mt-4 flex gap-2"
            style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
          >
            <AlertCircle size={14} style={{ color: '#92400e', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11, color: '#78350f', lineHeight: 1.5 }}>
              CSV must have samples as columns and metabolites as rows, with a "Name" column as the first column.
              Group names should be detectable from column headers.
            </p>
          </div>
        </div>

        {/* Group selection summary */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ color: '#17172A', fontSize: 14 }}>2. Select Groups</h3>
          {!csvLoaded ? (
            <div className="flex flex-col items-center justify-center h-36 gap-2">
              <FileSpreadsheet size={28} style={{ color: '#CBD5E1' }} />
              <p style={{ fontSize: 12, color: '#94a3b8' }}>Load a CSV file to detect groups</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-36 gap-2">
              <FileSpreadsheet size={28} style={{ color: '#CBD5E1' }} />
              <p style={{ fontSize: 12, color: '#94a3b8' }}>No groups detected</p>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
                {groups.length} group{groups.length === 1 ? '' : 's'} detected. Select which to include in plot generation.
              </p>
              <div className="max-h-40 overflow-y-auto pr-1">
                {groups.map(g => (
                  <div key={g.name} className="flex items-center justify-between py-1" style={{ fontSize: 13, color: '#334155', fontFamily: 'DM Mono, monospace' }}>
                    <span>{g.name}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{g.count} sample{g.count === 1 ? '' : 's'}</span>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 w-full py-2.5 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#17A398', color: 'white', fontSize: 13 }}
                onClick={onImportCSV}
              >
                Open Group Selection…
              </button>
            </div>
          )}
        </div>

        {/* Bar plot settings preview */}
        <div
          className="col-span-2 rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Settings size={15} style={{ color: '#1E1B4B' }} />
            <h3 className="font-semibold" style={{ color: '#17172A', fontSize: 14 }}>3. Bar Plot Configuration</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Y-axis Label', value: 'Peak Area', type: 'text' },
              { label: 'Font Size', value: 'Auto', type: 'select', opts: ['Auto', '14', '12', '10', '9', '8', '7', '6'] },
              { label: 'Label Rotation', value: 'Auto', type: 'select', opts: ['Auto', '0°', '30°', '45°', '60°', '90°'] },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>{f.label.toUpperCase()}</label>
                {f.type === 'select' ? (
                  <select
                    defaultValue={f.value}
                    className="w-full rounded-lg px-2.5 py-1.5 outline-none"
                    style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155' }}
                  >
                    {f.opts?.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input
                    defaultValue={f.value}
                    className="w-full rounded-lg px-2.5 py-1.5 outline-none"
                    style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155' }}
                  />
                )}
              </div>
            ))}
            <div className="flex flex-col gap-2 justify-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked style={{ accentColor: '#1E1B4B', width: 14, height: 14 }} />
                <span style={{ fontSize: 12, color: '#334155' }}>Show p-values</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked style={{ accentColor: '#1E1B4B', width: 14, height: 14 }} />
                <span style={{ fontSize: 12, color: '#334155' }}>Run ANOVA (&gt;2 groups)</span>
              </label>
            </div>
          </div>
          <div
            className="mt-3 rounded-lg px-3 py-2"
            style={{ backgroundColor: '#F8F9FC', border: '1px solid #E9EEF5' }}
          >
            <p style={{ fontSize: 11, color: '#64748B', lineHeight: 1.5 }}>
              <strong>Auto mode</strong> reduces font size and rotates x-axis group labels when group names are long or many groups are selected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
