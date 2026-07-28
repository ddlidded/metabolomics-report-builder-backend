import { BarChart3, Download, FileText, Info } from 'lucide-react';

interface StatisticsExportPanelProps {
  onExportStats: () => void;
  onExportMaven: () => void;
}

export function StatisticsExportPanel({ onExportStats, onExportMaven }: StatisticsExportPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="mb-6">
        <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 16 }}>Statistics Export</h2>
        <p style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>
          Export statistical analysis results and metabolite identification lists.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF0F9' }}>
              <BarChart3 size={16} style={{ color: '#1E1B4B' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ fontSize: 14, color: '#17172A' }}>Generated Plot Statistics</h3>
              <p style={{ fontSize: 11, color: '#64748B' }}>Per-metabolite fold change, p-values, ANOVA</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {['Metabolite Name', 'Mean ± SD per Group', 'Fold Change', 'p-value (t-test)', 'ANOVA F-statistic', 'ANOVA p-value', 'Significance Stars'].map(col => (
              <label key={col} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" defaultChecked style={{ accentColor: '#1E1B4B', width: 13, height: 13 }} />
                <span style={{ fontSize: 12, color: '#334155' }}>{col}</span>
              </label>
            ))}
          </div>

          <button
            onClick={onExportStats}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#1E1B4B', color: 'white', fontSize: 13 }}
          >
            <Download size={14} />
            Export Statistics CSV
          </button>
        </div>

        <div
          className="rounded-xl p-5"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#f0fdfa' }}>
              <FileText size={16} style={{ color: '#17A398' }} />
            </div>
            <div>
              <h3 className="font-semibold" style={{ fontSize: 14, color: '#17172A' }}>Maven Knowns-List CSV</h3>
              <p style={{ fontSize: 11, color: '#64748B' }}>Identified metabolites for El-MAVEN import</p>
            </div>
          </div>

          <div
            className="rounded-lg p-3 mb-4 flex gap-2"
            style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
          >
            <Info size={13} style={{ color: '#92400e', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11, color: '#78350f', lineHeight: 1.5 }}>
              The Maven knowns-list format is used by El-MAVEN for targeted peak integration.
              The exported CSV will contain compound name, m/z, retention time, and adduct columns.
            </p>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {['Compound Name', 'm/z (neutral mass)', 'Retention Time (min)', 'Adduct Type', 'Chemical Formula', 'InChI Key'].map(col => (
              <label key={col} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" defaultChecked={!col.includes('InChI')} style={{ accentColor: '#17A398', width: 13, height: 13 }} />
                <span style={{ fontSize: 12, color: '#334155' }}>{col}</span>
              </label>
            ))}
          </div>

          <button
            onClick={onExportMaven}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-colors"
            style={{ backgroundColor: '#17A398', color: 'white', fontSize: 13 }}
          >
            <Download size={14} />
            Export Maven Knowns-List
          </button>
        </div>
      </div>
    </div>
  );
}
