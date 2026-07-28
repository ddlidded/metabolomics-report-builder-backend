import { Eye, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface PreviewExportPanelProps {
  onPreview: () => void;
  onExport: () => void;
}

export function PreviewExportPanel({ onPreview, onExport }: PreviewExportPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="mb-6">
        <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 16 }}>Preview &amp; Export</h2>
        <p style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>
          Review your complete PDF report and export the final document.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* PDF Preview card */}
        <div
          className="col-span-2 rounded-xl overflow-hidden flex flex-col"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', minHeight: 420 }}
        >
          {/* Viewer toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8F9FC' }}>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF0F9', color: '#1E1B4B' }}>
                <ChevronLeft size={14} />
              </button>
              <span style={{ fontSize: 12, color: '#64748B', minWidth: 80, textAlign: 'center' }}>Page 1 of 12</span>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF0F9', color: '#1E1B4B' }}>
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F1F3F9', color: '#64748B' }}>
                <ZoomOut size={13} />
              </button>
              <span style={{ fontSize: 12, color: '#64748B', minWidth: 40, textAlign: 'center' }}>100%</span>
              <button className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F1F3F9', color: '#64748B' }}>
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          {/* Simulated PDF page */}
          <div className="flex-1 flex items-center justify-center p-8" style={{ backgroundColor: '#6b7280' }}>
            <div
              className="rounded-sm overflow-hidden flex flex-col"
              style={{ width: 280, height: 380, backgroundColor: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: '#1E1B4B' }}>
                <span style={{ color: 'white', fontSize: 8, fontWeight: 600 }}>Untargeted Metabolomics Study — 2026</span>
                <span style={{ color: '#818cf8', fontSize: 7 }}>METABOLOMICS CORE</span>
              </div>
              {/* Content */}
              <div className="flex-1 p-4">
                <div className="rounded mb-3 flex items-center justify-center" style={{ height: 140, backgroundColor: '#EEF0F9', border: '1px solid #D9D9E3' }}>
                  <div className="text-center">
                    <div style={{ fontSize: 7, color: '#818cf8', fontWeight: 600 }}>PCA Score Plot (PC1 vs PC2)</div>
                    <div style={{ fontSize: 6, color: '#94a3b8', marginTop: 2 }}>pca_scores_pc1_pc2.png</div>
                    {/* Mini PCA chart */}
                    <svg viewBox="0 0 80 60" width="80" height="60" style={{ marginTop: 4 }}>
                      {[[15,40],[22,32],[18,46],[12,36],[26,28],[20,42]].map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r="3" fill="#2563EB" opacity="0.7"/>
                      ))}
                      {[[50,20],[56,16],[48,26],[54,14],[60,22],[52,18]].map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r="3" fill="#17A398" opacity="0.7"/>
                      ))}
                      <line x1="0" y1="55" x2="80" y2="55" stroke="#E2E8F0" strokeWidth="0.5"/>
                      <line x1="2" y1="0" x2="2" y2="55" stroke="#E2E8F0" strokeWidth="0.5"/>
                    </svg>
                  </div>
                </div>
                <div style={{ fontSize: 7, color: '#64748B', textAlign: 'center', marginTop: 4 }}>Figure 2 · PCA / PLSDA</div>
              </div>
              {/* Footer */}
              <div className="flex items-center justify-between px-4 py-2" style={{ borderTop: '1px solid #F1F3F9' }}>
                <span style={{ fontSize: 6, color: '#94a3b8' }}>University Metabolomics Core — Confidential</span>
                <span style={{ fontSize: 6, color: '#94a3b8' }}>2 / 12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions column */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-5"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-semibold mb-3" style={{ fontSize: 14, color: '#17172A' }}>Export Actions</h3>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={onPreview}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#EEF0F9', color: '#1E1B4B', fontSize: 13, border: '1.5px solid #c7d2fe' }}
              >
                <Eye size={15} />
                Preview Full PDF
              </button>
              <button
                onClick={onExport}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors"
                style={{ backgroundColor: '#1E1B4B', color: 'white', fontSize: 14 }}
              >
                <Download size={16} />
                Export PDF Report
              </button>
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-semibold mb-3" style={{ fontSize: 13, color: '#17172A' }}>Output Options</h3>
            <div className="flex flex-col gap-2">
              {[
                'Show section break pages',
                'Show header',
                'Show footer',
                'Add page numbers',
                'Show extra titles for all image cards',
                'Use file names if title is blank',
              ].map(label => (
                <label key={label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked style={{ accentColor: '#1E1B4B', width: 13, height: 13 }} />
                  <span style={{ fontSize: 12, color: '#334155' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-semibold mb-3" style={{ fontSize: 13, color: '#17172A' }}>Also Export</h3>
            <div className="flex flex-col gap-2 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked style={{ accentColor: '#17A398', width: 13, height: 13 }} />
                <span style={{ fontSize: 12, color: '#334155' }}>Statistics CSV</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" style={{ accentColor: '#17A398', width: 13, height: 13 }} />
                <span style={{ fontSize: 12, color: '#334155' }}>Maven knowns-list CSV</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
