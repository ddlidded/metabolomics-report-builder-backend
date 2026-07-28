import { useState } from 'react';
import type { SectionLayout } from './types';

const PER_PAGE_OPTIONS = [1, 2, 4, 6, 8, 9, 12];

function GridPreview({ count }: { count: number }) {
  const cfg: Record<number, { cols: number; rows: number }> = {
    1: { cols: 1, rows: 1 }, 2: { cols: 2, rows: 1 }, 4: { cols: 2, rows: 2 },
    6: { cols: 3, rows: 2 }, 8: { cols: 4, rows: 2 }, 9: { cols: 3, rows: 3 }, 12: { cols: 4, rows: 3 }
  };
  const { cols, rows } = cfg[count] || { cols: 1, rows: 1 };
  const cells = Array(cols * rows).fill(null);
  const w = 44 / cols;
  const h = 34 / rows;
  return (
    <svg viewBox="0 0 48 38" width="48" height="38">
      <rect x="0" y="0" width="48" height="38" rx="3" fill="#F4F6FA" stroke="#E2E8F0" strokeWidth="1"/>
      {cells.map((_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <rect
            key={i}
            x={2 + col * w}
            y={2 + row * h}
            width={w - 1}
            height={h - 1}
            rx="1"
            fill="#818cf8"
            opacity="0.35"
          />
        );
      })}
    </svg>
  );
}

interface PageLayoutPanelProps {
  layout: SectionLayout;
  setLayout: React.Dispatch<React.SetStateAction<SectionLayout>>;
}

export function PageLayoutPanel({ layout, setLayout }: PageLayoutPanelProps) {
  const sections: { key: keyof SectionLayout; label: string; color: string }[] = [
    { key: 'summaryPerPage', label: 'Summary / Global', color: '#7c3aed' },
    { key: 'heatmapPerPage', label: 'Heatmap', color: '#be185d' },
    { key: 'pcaPerPage', label: 'PCA / PLSDA', color: '#2563EB' },
    { key: 'volcanoPerPage', label: 'Volcano', color: '#b45309' },
    { key: 'barPlotsPerPage', label: 'Individual Bar Plots', color: '#17A398' },
    { key: 'otherPerPage', label: 'Other Plots', color: '#64748B' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="mb-6">
        <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 16 }}>Page Layout Configuration</h2>
        <p style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>
          Control how many plots appear per page for each section type.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Combined section layouts */}
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ fontSize: 14, color: '#17172A' }}>Combined Section Layouts</h3>
          <div className="flex flex-col gap-4">
            {sections.map(({ key, label, color }) => (
              <div key={key} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span style={{ fontSize: 13, color: '#334155' }}>{label}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <GridPreview count={layout[key]} />
                  <select
                    value={layout[key]}
                    onChange={e => setLayout(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                    className="rounded-lg px-2 py-1.5 outline-none"
                    style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155', width: 64 }}
                  >
                    {PER_PAGE_OPTIONS.map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Page layout visual */}
        <div
          className="rounded-xl p-5 flex flex-col"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ fontSize: 14, color: '#17172A' }}>PDF Page Preview</h3>
          <div className="flex-1 flex items-center justify-center">
            {/* Simulated PDF page */}
            <div
              className="rounded-lg relative overflow-hidden"
              style={{ width: 200, height: 280, backgroundColor: 'white', border: '1.5px solid #D9D9E3', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
            >
              {/* Header */}
              <div
                className="flex items-center px-3 py-1.5"
                style={{ backgroundColor: '#1E1B4B', height: 28 }}
              >
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              </div>
              {/* Page content area with grid preview */}
              <div className="p-3 grid gap-2" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', height: 'calc(100% - 56px)' }}>
                {[0,1,2,3].map(i => (
                  <div key={i} className="rounded" style={{ backgroundColor: '#EEF0F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: 6, color: '#818cf8', textAlign: 'center', lineHeight: 1.3 }}>
                      Plot {i+1}
                    </div>
                  </div>
                ))}
              </div>
              {/* Footer */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3"
                style={{ height: 28, backgroundColor: '#F8F9FC', borderTop: '1px solid #E2E8F0' }}
              >
                <div className="h-1 rounded-full flex-1" style={{ backgroundColor: '#D9D9E3' }} />
                <span style={{ fontSize: 6, color: '#94a3b8', padding: '0 6px' }}>Page 1 of 12</span>
                <div className="h-1 rounded-full flex-1" style={{ backgroundColor: '#D9D9E3' }} />
              </div>
            </div>
          </div>
          <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
            Preview based on current layout settings
          </p>
        </div>

        {/* Spacing settings */}
        <div
          className="col-span-2 rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-4" style={{ fontSize: 14, color: '#17172A' }}>Spacing &amp; Sizing</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: 'Margin', unit: 'in', defaultVal: '0.5' },
              { label: 'Header Height', unit: 'in', defaultVal: '0.6' },
              { label: 'Footer Height', unit: 'in', defaultVal: '0.4' },
              { label: 'Card Gap', unit: 'in', defaultVal: '0.15' },
              { label: 'Image Padding', unit: 'in', defaultVal: '0.05' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>
                  {f.label.toUpperCase()}
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.05"
                    defaultValue={f.defaultVal}
                    className="w-full rounded-lg px-2.5 py-1.5 outline-none"
                    style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155' }}
                  />
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{f.unit}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[
              { label: 'Header Title Font', defaultVal: 'Inter' },
              { label: 'Header Subtitle Font', defaultVal: 'Inter' },
              { label: 'Image Title Font', defaultVal: 'Inter' },
              { label: 'Footer Font', defaultVal: 'DM Mono' },
            ].map(f => (
              <div key={f.label}>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>
                  {f.label.toUpperCase()}
                </label>
                <select
                  defaultValue={f.defaultVal}
                  className="w-full rounded-lg px-2.5 py-1.5 outline-none"
                  style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155' }}
                >
                  {['Inter', 'DM Mono', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia'].map(font => (
                    <option key={font}>{font}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
