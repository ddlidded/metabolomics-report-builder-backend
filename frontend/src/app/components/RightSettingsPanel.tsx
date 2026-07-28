import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, Download, Upload, FileOutput, Info } from 'lucide-react';
import type { ReportSettings, PlotSettings, SectionLayout, SpacingSettings, CoverSettings, ExportSettings } from './types';

interface RightSettingsPanelProps {
  reportSettings: ReportSettings;
  setReportSettings: React.Dispatch<React.SetStateAction<ReportSettings>>;
  plotSettings: PlotSettings;
  setPlotSettings: React.Dispatch<React.SetStateAction<PlotSettings>>;
  layout: SectionLayout;
  setLayout: React.Dispatch<React.SetStateAction<SectionLayout>>;
  spacing: SpacingSettings;
  setSpacing: React.Dispatch<React.SetStateAction<SpacingSettings>>;
  coverSettings: CoverSettings;
  setCoverSettings: React.Dispatch<React.SetStateAction<CoverSettings>>;
  exportSettings: ExportSettings;
  setExportSettings: React.Dispatch<React.SetStateAction<ExportSettings>>;
  onPreview: () => void;
  onExport: () => void;
}

function AccordionSection({
  title, children, defaultOpen = false, accent
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean; accent?: string
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderBottom: '1px solid #F1F3F9' }}>
      <button
        className="w-full flex items-center justify-between px-4 py-3 transition-colors"
        style={{ backgroundColor: open ? '#FAFBFD' : 'transparent', cursor: 'pointer' }}
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2">
          {accent && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />}
          <span style={{ fontSize: 12, fontWeight: 600, color: '#17172A', letterSpacing: '0.02em' }}>{title}</span>
        </div>
        {open ? <ChevronDown size={13} style={{ color: '#94a3b8' }} /> : <ChevronRight size={13} style={{ color: '#94a3b8' }} />}
      </button>
      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

const ColorInput = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 3, letterSpacing: '0.05em' }}>
      {label.toUpperCase()}
    </label>
    <div className="flex items-center gap-1.5">
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width: 24, height: 24, borderRadius: 4, border: '1px solid #E2E8F0', cursor: 'pointer', padding: 1 }}
      />
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        className="flex-1 rounded px-2 py-1 outline-none"
        style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 11, color: '#334155', fontFamily: 'DM Mono, monospace' }}
      />
    </div>
  </div>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 3, letterSpacing: '0.05em' }}>
    {children}
  </label>
);

const TextInput = ({ label, value, onChange, placeholder = '' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
  <div>
    <FieldLabel>{label.toUpperCase()}</FieldLabel>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg px-2.5 py-1.5 outline-none"
      style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 12, color: '#334155' }}
    />
  </div>
);

const SelectInput = ({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) => (
  <div>
    <FieldLabel>{label.toUpperCase()}</FieldLabel>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg px-2 py-1.5 outline-none"
      style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 12, color: '#334155' }}
    >
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  </div>
);

function GridPreviewSmall({ count }: { count: number }) {
  const cfg: Record<number, { cols: number; rows: number }> = {
    1: { cols: 1, rows: 1 }, 2: { cols: 2, rows: 1 }, 4: { cols: 2, rows: 2 },
    6: { cols: 3, rows: 2 }, 8: { cols: 4, rows: 2 }, 9: { cols: 3, rows: 3 }, 12: { cols: 4, rows: 3 }
  };
  const { cols, rows } = cfg[count] || { cols: 1, rows: 1 };
  const cells = Array(cols * rows).fill(null);
  const w = 30 / cols;
  const h = 24 / rows;
  return (
    <svg viewBox="0 0 34 28" width="34" height="28">
      <rect x="0" y="0" width="34" height="28" rx="2" fill="#F4F6FA" stroke="#E2E8F0" strokeWidth="0.8"/>
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
            opacity="0.4"
          />
        );
      })}
    </svg>
  );
}

export function RightSettingsPanel({
  reportSettings, setReportSettings,
  plotSettings, setPlotSettings,
  layout, setLayout,
  spacing, setSpacing,
  coverSettings, setCoverSettings,
  exportSettings, setExportSettings,
  onPreview, onExport,
}: RightSettingsPanelProps) {
  const rs = reportSettings;
  const setRS = <K extends keyof ReportSettings>(k: K, v: ReportSettings[K]) =>
    setReportSettings(p => ({ ...p, [k]: v }));

  const ps = plotSettings;
  const setPS = <K extends keyof PlotSettings>(k: K, v: PlotSettings[K]) =>
    setPlotSettings(p => ({ ...p, [k]: v }));

  const es = exportSettings;
  const setES = <K extends keyof ExportSettings>(k: K, v: ExportSettings[K]) =>
    setExportSettings(p => ({ ...p, [k]: v }));

  const sectionLayouts: { key: keyof SectionLayout; label: string }[] = [
    { key: 'summaryPerPage', label: 'Summary / Global' },
    { key: 'heatmapPerPage', label: 'Heatmap' },
    { key: 'pcaPerPage', label: 'PCA / PLSDA' },
    { key: 'volcanoPerPage', label: 'Volcano' },
    { key: 'barPlotsPerPage', label: 'Bar Plots' },
    { key: 'otherPerPage', label: 'Other' },
  ];

  return (
    <div
      className="flex flex-col h-full shrink-0"
      style={{ width: 300, backgroundColor: 'white', borderLeft: '1px solid #E2E8F0', overflow: 'hidden' }}
    >
      {/* Panel header */}
      <div
        className="px-4 py-3.5 shrink-0"
        style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: '#F8F9FC' }}
      >
        <h3 style={{ fontSize: 13, fontWeight: 700, color: '#17172A', letterSpacing: '0.01em' }}>Report Settings</h3>
        <p style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>Configure all report parameters</p>
      </div>

      {/* Scrollable settings */}
      <div className="flex-1 overflow-y-auto">

        {/* 1. Report Settings */}
        <AccordionSection title="1 · Report Settings" defaultOpen accent="#818cf8">
          <div className="flex flex-col gap-3">
            <TextInput label="Report Title" value={rs.title} onChange={v => setRS('title', v)} placeholder="Untargeted Metabolomics Study" />
            <TextInput label="Header Label" value={rs.headerLabel} onChange={v => setRS('headerLabel', v)} placeholder="METABOLOMICS CORE" />
            <div>
              <FieldLabel>FOOTER TEXT</FieldLabel>
              <textarea
                value={rs.footerText}
                onChange={e => setRS('footerText', e.target.value)}
                rows={2}
                className="w-full rounded-lg px-2.5 py-1.5 outline-none resize-none"
                style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 12, color: '#334155' }}
              />
            </div>
            <div>
              <FieldLabel>ORIENTATION</FieldLabel>
              <div className="flex gap-2">
                {(['Portrait', 'Landscape'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="orientation"
                      checked={rs.orientation === opt}
                      onChange={() => setRS('orientation', opt)}
                      style={{ accentColor: '#1E1B4B' }}
                    />
                    <span style={{ fontSize: 12, color: '#334155' }}>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <SelectInput
              label="Image Fit"
              value={rs.imageFit}
              options={['contain', 'cover', 'stretch']}
              onChange={v => setRS('imageFit', v as ReportSettings['imageFit'])}
            />
            <div className="grid grid-cols-2 gap-2">
              <ColorInput label="Header Color" value={rs.headerColor} onChange={v => setRS('headerColor', v)} />
              <ColorInput label="BG Color" value={rs.backgroundColor} onChange={v => setRS('backgroundColor', v)} />
              <ColorInput label="Card Border" value={rs.cardBorderColor} onChange={v => setRS('cardBorderColor', v)} />
            </div>
          </div>
        </AccordionSection>

        {/* 2. Generated Plot Settings */}
        <AccordionSection title="2 · Generated Plot Settings" accent="#17A398">
          <div className="flex flex-col gap-3">
            <TextInput label="Y-axis Label" value={ps.yAxisLabel} onChange={v => setPS('yAxisLabel', v)} />
            <div className="grid grid-cols-3 gap-2">
              <ColorInput label="Group 1" value={ps.group1Color} onChange={v => setPS('group1Color', v)} />
              <ColorInput label="Group 2" value={ps.group2Color} onChange={v => setPS('group2Color', v)} />
              <ColorInput label="Point" value={ps.pointColor} onChange={v => setPS('pointColor', v)} />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ps.showPValue}
                onChange={e => setPS('showPValue', e.target.checked)}
                style={{ accentColor: '#1E1B4B', width: 13, height: 13 }}
              />
              <span style={{ fontSize: 12, color: '#334155' }}>Show p-value on plots</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={ps.runAnova}
                onChange={e => setPS('runAnova', e.target.checked)}
                style={{ accentColor: '#1E1B4B', width: 13, height: 13 }}
              />
              <span style={{ fontSize: 12, color: '#334155' }}>Run one-way ANOVA (&gt;2 groups)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <SelectInput
                label="Font Size"
                value={ps.fontSizeMode}
                options={['Auto', '14', '12', '10', '9', '8', '7', '6']}
                onChange={v => setPS('fontSizeMode', v)}
              />
              <SelectInput
                label="Rotation"
                value={ps.rotationMode}
                options={['Auto', '0°', '30°', '45°', '60°', '90°']}
                onChange={v => setPS('rotationMode', v)}
              />
            </div>
            <div
              className="rounded-lg p-2.5 flex gap-2"
              style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
            >
              <Info size={12} style={{ color: '#92400e', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 10, color: '#78350f', lineHeight: 1.5 }}>
                Auto reduces font size and rotates x-axis labels when group names are long or many groups are present.
              </p>
            </div>
          </div>
        </AccordionSection>

        {/* 3. Combined Section Layouts */}
        <AccordionSection title="3 · Combined Section Layouts" accent="#2563EB">
          <div className="flex flex-col gap-2.5">
            {sectionLayouts.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span style={{ fontSize: 11.5, color: '#334155', flex: 1 }}>{label}</span>
                <GridPreviewSmall count={layout[key]} />
                <select
                  value={layout[key]}
                  onChange={e => setLayout(p => ({ ...p, [key]: Number(e.target.value) }))}
                  className="rounded px-1.5 py-1 outline-none"
                  style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 11.5, color: '#334155', width: 48 }}
                >
                  {[1, 2, 4, 6, 8, 9, 12].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
          </div>
        </AccordionSection>

        {/* 4. Spacing & Sizing */}
        <AccordionSection title="4 · Spacing &amp; Sizing" accent="#FFB703">
          <div className="grid grid-cols-2 gap-2">
            {([
              ['Margin', 'marginInches'],
              ['Header H', 'headerHeightInches'],
              ['Footer H', 'footerHeightInches'],
              ['Card Gap', 'cardGapInches'],
              ['Img Pad', 'imagePaddingInches'],
            ] as [string, keyof SpacingSettings][]).map(([label, key]) => (
              <div key={key}>
                <FieldLabel>{label.toUpperCase()} (in)</FieldLabel>
                <input
                  type="number"
                  step="0.05"
                  value={spacing[key] as number}
                  onChange={e => setSpacing(p => ({ ...p, [key]: Number(e.target.value) }))}
                  className="w-full rounded-lg px-2 py-1.5 outline-none"
                  style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 12, color: '#334155' }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2">
            {([
              ['Header Title Font', 'headerTitleFont'],
              ['Header Sub Font', 'headerSubtitleFont'],
              ['Image Title Font', 'imageTitleFont'],
              ['Footer Font', 'footerFont'],
            ] as [string, keyof SpacingSettings][]).map(([label, key]) => (
              <SelectInput
                key={key}
                label={label}
                value={spacing[key] as string}
                options={['Inter', 'DM Mono', 'Arial', 'Helvetica', 'Georgia']}
                onChange={v => setSpacing(p => ({ ...p, [key]: v }))}
              />
            ))}
          </div>
        </AccordionSection>

        {/* 5. Cover Page */}
        <AccordionSection title="5 · Cover Page" accent="#be185d">
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={coverSettings.includeCover}
                onChange={e => setCoverSettings(p => ({ ...p, includeCover: e.target.checked }))}
                style={{ accentColor: '#1E1B4B', width: 13, height: 13 }}
              />
              <span style={{ fontSize: 12, color: '#334155' }}>Include custom cover page</span>
            </label>
            <SelectInput
              label="Cover Design"
              value={coverSettings.coverDesign}
              options={['modern-purple', 'blueprint-lcms', 'vertical-rail', 'wave-infographic', 'blueprint-dense', 'editorial-dark']}
              onChange={v => setCoverSettings(p => ({ ...p, coverDesign: v }))}
            />
            {/* Mini cover preview */}
            <div>
              <FieldLabel>PREVIEW</FieldLabel>
              <div
                className="rounded-lg flex items-center justify-center"
                style={{ backgroundColor: '#F4F6FA', height: 90, border: '1px solid #E2E8F0' }}
              >
                <div
                  className="rounded overflow-hidden"
                  style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                >
                  <CoverPreviewMini design={coverSettings.coverDesign} primary={coverSettings.coverPrimaryColor} accent={coverSettings.coverAccentColor} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <ColorInput label="Primary" value={coverSettings.coverPrimaryColor} onChange={v => setCoverSettings(p => ({ ...p, coverPrimaryColor: v }))} />
              <ColorInput label="Accent" value={coverSettings.coverAccentColor} onChange={v => setCoverSettings(p => ({ ...p, coverAccentColor: v }))} />
              <ColorInput label="BG" value={coverSettings.coverBgColor} onChange={v => setCoverSettings(p => ({ ...p, coverBgColor: v }))} />
              <ColorInput label="Ink" value={coverSettings.coverInkColor} onChange={v => setCoverSettings(p => ({ ...p, coverInkColor: v }))} />
            </div>
            <TextInput label="Project Title" value={coverSettings.projectTitle} onChange={v => setCoverSettings(p => ({ ...p, projectTitle: v }))} placeholder="Study Title" />
            <TextInput label="Prepared By" value={coverSettings.preparedBy} onChange={v => setCoverSettings(p => ({ ...p, preparedBy: v }))} placeholder="Core Facility Name" />
          </div>
        </AccordionSection>

        {/* 6. Export Options */}
        <AccordionSection title="6 · Export Options" accent="#059669">
          <div className="flex flex-col gap-2 mb-4">
            {([
              ['Export Maven knowns-list CSV', 'exportMavenCSV'],
              ['Export statistics CSV', 'exportStatsCSV'],
              ['Show section break pages', 'showSectionBreaks'],
              ['Show header', 'showHeader'],
              ['Show footer', 'showFooter'],
              ['Add page numbers', 'addPageNumbers'],
              ['Show extra image card titles', 'showExtraTitles'],
              ['Use file names if title blank', 'useFileNamesIfBlank'],
            ] as [string, keyof ExportSettings][]).map(([label, key]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={es[key] as boolean}
                  onChange={e => setES(key, e.target.checked)}
                  style={{ accentColor: '#1E1B4B', width: 13, height: 13 }}
                />
                <span style={{ fontSize: 11.5, color: '#334155' }}>{label}</span>
              </label>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <button
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: '#F4F6FA', color: '#64748B', border: '1px solid #E2E8F0' }}
            >
              <Upload size={12} /> Import Settings
            </button>
            <button
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: '#F4F6FA', color: '#64748B', border: '1px solid #E2E8F0' }}
            >
              <Download size={12} /> Export Settings
            </button>
          </div>
        </AccordionSection>
      </div>

      {/* Action buttons — sticky footer */}
      <div className="shrink-0 p-3 flex flex-col gap-2" style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#F8F9FC' }}>
        <button
          onClick={onPreview}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-colors"
          style={{ backgroundColor: '#EEF0F9', color: '#1E1B4B', border: '1.5px solid #c7d2fe' }}
        >
          <Eye size={14} /> Preview PDF
        </button>
        <button
          onClick={onExport}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          style={{ background: 'linear-gradient(135deg, #1E1B4B, #312e81)', color: 'white' }}
        >
          <FileOutput size={14} /> Export PDF Report
        </button>
      </div>
    </div>
  );
}

function CoverPreviewMini({ design, primary, accent }: { design: string; primary: string; accent: string }) {
  const p = primary || '#1E1B4B';
  const a = accent || '#17A398';
  const W = 64, H = 90;
  if (design === 'blueprint-lcms') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="#0a1628"/>
        {[12,24,36,48,60,72,84].map(y => <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#1e3a5f" strokeWidth="0.4"/>)}
        <rect x="4" y="6" width={W-8} height={H-12} rx="2" fill="none" stroke={a} strokeWidth="0.6" opacity="0.5"/>
        <rect x="4" y="6" width={W-8} height="14" rx="2" fill={a} opacity="0.1"/>
        <rect x="8" y="10" width="30" height="2" rx="1" fill={a} opacity="0.9"/>
        <rect x="8" y="14" width="20" height="1.5" rx="1" fill="white" opacity="0.4"/>
        <line x1="4" y1="26" x2={W-4} y2="26" stroke={a} strokeWidth="0.4" strokeDasharray="2,2" opacity="0.5"/>
        <rect x="8" y="30" width="25" height="1.5" rx="1" fill="white" opacity="0.35"/>
        <rect x="8" y="34" width="35" height="1" rx="0.5" fill="white" opacity="0.2"/>
      </svg>
    );
  }
  if (design === 'vertical-rail') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="white"/>
        <rect width="12" height={H} fill={p}/>
        <rect width="3" height={H} fill={a}/>
        <rect x="16" y="16" width="38" height="2.5" rx="1" fill={p} opacity="0.85"/>
        <rect x="16" y="21" width="26" height="1.5" rx="1" fill="#64748B" opacity="0.5"/>
        <rect x="16" y="26" width="18" height="1.5" rx="1" fill={a} opacity="0.8"/>
        <rect x="16" y="80" width="40" height="1" rx="0.5" fill={a} opacity="0.5"/>
      </svg>
    );
  }
  if (design === 'editorial-dark') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="white"/>
        <rect width={W} height={H/2} fill="#17172A"/>
        <rect x="6" y="10" width="40" height="3" rx="1" fill="white" opacity="0.9"/>
        <rect x="6" y="16" width="28" height="2" rx="1" fill="white" opacity="0.5"/>
        <rect x="6" y="22" width="18" height="1.5" rx="1" fill={a} opacity="0.8"/>
        <rect x="6" y="54" width="44" height="1" rx="0.5" fill="#E2E8F0"/>
        <rect x="6" y="58" width="28" height="1.5" rx="1" fill="#334155" opacity="0.5"/>
        <rect x="6" y="80" width="40" height="1" rx="0.5" fill={a} opacity="0.5"/>
      </svg>
    );
  }
  if (design === 'wave-infographic') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="white"/>
        <path d={`M0,${H*0.72} Q${W*0.3},${H*0.58} ${W*0.5},${H*0.68} Q${W*0.7},${H*0.78} ${W},${H*0.62} L${W},${H} L0,${H} Z`} fill={p} opacity="0.12"/>
        <path d={`M0,${H*0.8} Q${W*0.35},${H*0.68} ${W*0.6},${H*0.76} Q${W*0.8},${H*0.82} ${W},${H*0.73} L${W},${H} L0,${H} Z`} fill={a} opacity="0.2"/>
        <circle cx={W*0.75} cy="18" r="12" fill={p} opacity="0.07"/>
        <circle cx={W*0.75} cy="18" r="6" fill={a} opacity="0.12"/>
        <rect x="6" y="15" width="32" height="2.5" rx="1" fill={p} opacity="0.85"/>
        <rect x="6" y="21" width="22" height="1.5" rx="1" fill="#64748B" opacity="0.5"/>
        <rect x="6" y="27" width="16" height="1.5" rx="1" fill={a} opacity="0.8"/>
      </svg>
    );
  }
  if (design === 'blueprint-dense') {
    return (
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
        <rect width={W} height={H} fill="#1a2744"/>
        {[8,16,24,32,40,48,56,64,72,82].map(y => <line key={y} x1="0" y1={y} x2={W} y2={y} stroke="#243558" strokeWidth="0.4"/>)}
        {[8,16,24,32,40,48,56].map(x => <line key={x} x1={x} y1="0" x2={x} y2={H} stroke="#243558" strokeWidth="0.4"/>)}
        <rect x="4" y="4" width={W-8} height="14" rx="2" fill="#2563EB" opacity="0.25"/>
        <rect x="4" y="4" width={W-8} height="14" rx="2" fill="none" stroke="#2563EB" strokeWidth="0.5" opacity="0.6"/>
        <rect x="7" y="7" width="28" height="1.8" rx="1" fill="white" opacity="0.85"/>
        <rect x="7" y="11" width="18" height="1.5" rx="1" fill="#93c5fd" opacity="0.6"/>
      </svg>
    );
  }
  // modern-purple (default)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <rect width={W} height={H} fill={p}/>
      <polygon points={`0,${H} ${W},${H*0.55} ${W},${H}`} fill={a} opacity="0.22"/>
      <circle cx={W*0.78} cy="18" r="14" fill={a} opacity="0.13"/>
      <circle cx={W*0.78} cy="18" r="7" fill={a} opacity="0.18"/>
      <rect x="6" y="32" width="38" height="2.5" rx="1" fill="white" opacity="0.9"/>
      <rect x="6" y="38" width="26" height="1.5" rx="1" fill="white" opacity="0.5"/>
      <rect x="6" y="44" width="20" height="1.5" rx="1" fill={a} opacity="0.8"/>
      <rect x="6" y="80" width="44" height="0.8" rx="0.4" fill="white" opacity="0.15"/>
      <rect x="6" y="84" width="22" height="1.5" rx="1" fill={a} opacity="0.6"/>
    </svg>
  );
}
