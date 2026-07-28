import { Download, Upload, Save, Trash2, Clock, FileJson } from 'lucide-react';

const PRESETS = [
  { name: 'Lipidomics Standard', date: 'May 28, 2026', plots: 14, desc: 'RPLC C18 · Positive mode · 4-group comparison' },
  { name: 'Metabolomics Plasma', date: 'May 15, 2026', plots: 22, desc: 'HILIC · Both modes · Normalized peak areas' },
  { name: 'TCA Cycle Focus', date: 'Apr 30, 2026', plots: 8, desc: 'Targeted TCA cycle metabolites · KO vs WT' },
];

export function SettingsPresetsPanel() {
  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="mb-6">
        <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 16 }}>Settings Presets</h2>
        <p style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>
          Save and load full report configurations as JSON presets.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Save/Load */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ fontSize: 14, color: '#17172A' }}>Save / Load Settings</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>PRESET NAME</label>
              <input
                defaultValue="My Report Config"
                className="w-full rounded-lg px-2.5 py-1.5 outline-none"
                style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155' }}
              />
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold"
              style={{ backgroundColor: '#1E1B4B', color: 'white', fontSize: 13 }}
            >
              <Save size={14} />
              Save Current Settings as Preset
            </button>
            <div
              className="flex items-center gap-2 py-1"
              style={{ color: '#94a3b8' }}
            >
              <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
              <span style={{ fontSize: 11 }}>or</span>
              <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
            </div>
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold"
              style={{ backgroundColor: '#EEF0F9', color: '#1E1B4B', fontSize: 13, border: '1.5px solid #c7d2fe' }}
            >
              <Upload size={14} />
              Import Settings from JSON File
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold"
              style={{ backgroundColor: '#F8F9FC', color: '#64748B', fontSize: 13, border: '1px solid #E2E8F0' }}
            >
              <Download size={14} />
              Export Current Settings as JSON
            </button>
          </div>
        </div>

        {/* Saved presets */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ fontSize: 14, color: '#17172A' }}>Saved Presets</h3>
          <div className="flex flex-col gap-3">
            {PRESETS.map(preset => (
              <div
                key={preset.name}
                className="rounded-lg p-3 flex gap-3"
                style={{ backgroundColor: '#F8F9FC', border: '1px solid #E9EEF5' }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#EEF0F9' }}>
                  <FileJson size={16} style={{ color: '#818cf8' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#17172A' }}>{preset.name}</div>
                  <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{preset.desc}</div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1" style={{ fontSize: 10, color: '#94a3b8' }}>
                      <Clock size={10} /> {preset.date}
                    </span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>·</span>
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>{preset.plots} figures</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 shrink-0">
                  <button
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                    style={{ backgroundColor: '#1E1B4B', color: 'white' }}
                  >
                    Load
                  </button>
                  <button
                    className="w-6 h-6 flex items-center justify-center rounded-lg"
                    style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))}
            {PRESETS.length === 0 && (
              <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', padding: '16px 0' }}>
                No saved presets yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
