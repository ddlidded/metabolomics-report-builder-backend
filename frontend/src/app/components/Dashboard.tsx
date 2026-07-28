import type { ElementType } from 'react';
import { Image, FileSpreadsheet, Layout, BookOpen, FileOutput, ArrowRight, CheckCircle2, Circle, Sparkles, TrendingUp, Files, Layers } from 'lucide-react';
import type { NavSection, PlotItem } from './types';

interface DashboardProps {
  plots: PlotItem[];
  onNavigate: (section: NavSection) => void;
}

const steps: { icon: ElementType; label: string; desc: string; section: NavSection; color: string }[] = [
  { icon: Image, label: 'Add Images & Figures', desc: 'Import plot images: PCA, volcano, heatmap, pathway', section: 'Images & Figures', color: '#6d28d9' },
  { icon: FileSpreadsheet, label: 'CSV Plot Generator', desc: 'Import CSV data and auto-generate bar plots per metabolite', section: 'CSV Plot Generator', color: '#17A398' },
  { icon: Layout, label: 'Configure Page Layout', desc: 'Set grid layout, fonts, spacing, headers and footers', section: 'Page Layout', color: '#2563EB' },
  { icon: BookOpen, label: 'Design Cover Page', desc: 'Select a cover style and fill in study metadata', section: 'Cover Page', color: '#FFB703' },
  { icon: FileOutput, label: 'Preview & Export PDF', desc: 'Review the full report and export to PDF', section: 'Preview & Export', color: '#059669' },
];

const sectionColors: Record<string, string> = {
  'Summary / Global': '#6d28d9',
  'PCA / PLSDA': '#2563EB',
  'Heatmap': '#be185d',
  'Volcano': '#b45309',
  'Individual Bar Plots': '#17A398',
  'Other': '#64748B',
};

export function Dashboard({ plots, onNavigate }: DashboardProps) {
  const singlePage = plots.filter(p => p.pageMode === 'SINGLE_PAGE').length;
  const combinedGrid = plots.filter(p => p.pageMode === 'COMBINED_GRID').length;
  const sections = Array.from(new Set(plots.map(p => p.section)));

  const stats: { label: string; value: number; icon: ElementType; color: string; bg: string }[] = [
    { label: 'Total Figures', value: plots.length, icon: Files, color: '#1E1B4B', bg: '#EEF0F9' },
    { label: 'Single-Page', value: singlePage, icon: Layers, color: '#6d28d9', bg: '#f3f0ff' },
    { label: 'Combined Grid', value: combinedGrid, icon: TrendingUp, color: '#17A398', bg: '#f0fdfa' },
    { label: 'Sections', value: sections.length, icon: Sparkles, color: '#b45309', bg: '#fffbeb' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8F9FC' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="rounded px-2 py-0.5 text-xs font-semibold tracking-widest"
            style={{ backgroundColor: '#EEF0F9', color: '#1E1B4B' }}
          >
            METABOLOMICS CORE
          </div>
        </div>
        <h1 className="text-2xl font-bold" style={{ color: '#17172A' }}>Report Builder Dashboard</h1>
        <p className="mt-1" style={{ color: '#64748B', fontSize: 13 }}>
          Build polished LC-MS metabolomics &amp; lipidomics PDF reports from plot images and CSV data.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="rounded-lg p-2.5" style={{ backgroundColor: bg }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#17172A', lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Workflow steps */}
        <div className="col-span-3">
          <div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F3F9' }}>
              <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 14 }}>Workflow Guide</h2>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Follow these steps to build your report</p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {steps.map(({ icon: Icon, label, desc, section, color }, i) => {
                const done = section === 'Images & Figures' ? plots.length > 0 : false;
                return (
                  <button
                    key={label}
                    onClick={() => onNavigate(section)}
                    className="flex items-center gap-3.5 rounded-lg p-3 text-left transition-all duration-150 group w-full"
                    style={{ backgroundColor: '#F8F9FC', border: '1px solid #E9EEF5' }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: color + '15', color }}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>
                          STEP {i + 1}
                        </span>
                        {done && <CheckCircle2 size={12} style={{ color: '#17A398' }} />}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#17172A' }}>{label}</div>
                      <div style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>{desc}</div>
                    </div>
                    <ArrowRight
                      size={14}
                      style={{ color: '#94a3b8', flexShrink: 0 }}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Figure breakdown */}
          <div
            className="rounded-xl"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <div className="px-5 py-4" style={{ borderBottom: '1px solid #F1F3F9' }}>
              <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 14 }}>Figure Breakdown</h2>
            </div>
            <div className="p-4">
              {plots.length === 0 ? (
                <div className="py-6 text-center">
                  <Circle size={32} style={{ color: '#E2E8F0', margin: '0 auto' }} />
                  <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 8 }}>No figures loaded yet</p>
                  <button
                    onClick={() => onNavigate('Images & Figures')}
                    className="mt-3 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                    style={{ backgroundColor: '#EEF0F9', color: '#1E1B4B' }}
                  >
                    Add Images →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {(['Summary / Global', 'PCA / PLSDA', 'Heatmap', 'Volcano', 'Individual Bar Plots', 'Other'] as const).map(sec => {
                    const count = plots.filter(p => p.section === sec).length;
                    const pct = plots.length > 0 ? Math.round((count / plots.length) * 100) : 0;
                    if (count === 0) return null;
                    return (
                      <div key={sec}>
                        <div className="flex items-center justify-between mb-1">
                          <span style={{ fontSize: 11, color: '#334155', fontWeight: 500 }}>{sec}</span>
                          <span style={{ fontSize: 11, color: '#64748B' }}>{count} plots</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#F1F3F9' }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${pct}%`, backgroundColor: sectionColors[sec] || '#64748B' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick tips */}
          <div
            className="rounded-xl flex-1"
            style={{ backgroundColor: '#1E1B4B', border: '1px solid #2d2a5e' }}
          >
            <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="font-semibold" style={{ color: 'white', fontSize: 14 }}>Quick Tips</h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[
                { dot: '#17A398', text: 'Assign COMBINED GRID to bar plots so multiple metabolites share one PDF page' },
                { dot: '#FFB703', text: 'Use CSV import to auto-generate individual bar plots with p-values and ANOVA' },
                { dot: '#818cf8', text: 'Save your settings as a JSON preset to reuse across projects' },
                { dot: '#f472b6', text: 'Enable cover page for client-facing polished report delivery' },
              ].map(({ dot, text }, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: dot }} />
                  <p style={{ fontSize: 11, color: '#a5b4fc', lineHeight: 1.5 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
