import { useState } from 'react';
import type { CoverSettings } from './types';

const COVER_DESIGNS = [
  { id: 'modern-purple', label: 'Modern Purple Overview' },
  { id: 'blueprint-lcms', label: 'Blueprint LCMS' },
  { id: 'vertical-rail', label: 'Vertical Rail' },
  { id: 'wave-infographic', label: 'Wave Infographic' },
  { id: 'blueprint-dense', label: 'Blueprint Dense' },
  { id: 'editorial-dark', label: 'Editorial Dark Panel' },
];

function CoverMiniPreview({ design, settings }: { design: string; settings: CoverSettings }) {
  const p = settings.coverPrimaryColor;
  const a = settings.coverAccentColor;
  const bg = settings.coverBgColor;

  if (design === 'modern-purple') {
    return (
      <svg viewBox="0 0 80 112" width="80" height="112">
        <rect width="80" height="112" fill={p} rx="4"/>
        <polygon points="0,112 80,60 80,112" fill={a} opacity="0.25"/>
        <circle cx="60" cy="20" r="18" fill={a} opacity="0.15"/>
        <circle cx="60" cy="20" r="10" fill={a} opacity="0.2"/>
        <rect x="8" y="40" width="45" height="3" rx="1" fill="white" opacity="0.9"/>
        <rect x="8" y="47" width="32" height="2" rx="1" fill="white" opacity="0.5"/>
        <rect x="8" y="54" width="25" height="1.5" rx="1" fill={a} opacity="0.8"/>
        <rect x="8" y="68" width="50" height="0.8" rx="0.4" fill="white" opacity="0.15"/>
        <rect x="8" y="72" width="30" height="1.5" rx="1" fill="white" opacity="0.4"/>
        <rect x="8" y="76" width="22" height="1.5" rx="1" fill="white" opacity="0.3"/>
        <rect x="8" y="100" width="50" height="0.8" rx="0.4" fill="white" opacity="0.15"/>
        <rect x="8" y="104" width="28" height="1.5" rx="1" fill={a} opacity="0.6"/>
      </svg>
    );
  }
  if (design === 'blueprint-lcms') {
    return (
      <svg viewBox="0 0 80 112" width="80" height="112">
        <rect width="80" height="112" fill="#0a1628" rx="4"/>
        {[10,20,30,40,50,60,70,80,90,100].map(y => (
          <line key={y} x1="0" y1={y} x2="80" y2={y} stroke="#1e3a5f" strokeWidth="0.5"/>
        ))}
        {[10,20,30,40,50,60,70].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="112" stroke="#1e3a5f" strokeWidth="0.5"/>
        ))}
        <rect x="6" y="6" width="68" height="100" rx="2" fill="none" stroke="#00d4d0" strokeWidth="0.8" opacity="0.5"/>
        <rect x="6" y="6" width="68" height="18" rx="2" fill="#00d4d0" opacity="0.12"/>
        <rect x="10" y="10" width="40" height="2" rx="1" fill="#00d4d0" opacity="0.9"/>
        <rect x="10" y="14" width="25" height="1.5" rx="1" fill="white" opacity="0.5"/>
        <line x1="6" y1="30" x2="74" y2="30" stroke="#00d4d0" strokeWidth="0.5" strokeDasharray="2,2"/>
        <rect x="10" y="34" width="20" height="1.5" rx="1" fill="white" opacity="0.4"/>
        <rect x="10" y="38" width="35" height="1.5" rx="1" fill="white" opacity="0.3"/>
        <rect x="10" y="50" width="55" height="0.8" rx="0.4" fill="#00d4d0" opacity="0.3"/>
        <rect x="10" y="54" width="25" height="1.5" rx="1" fill="white" opacity="0.5"/>
        <rect x="10" y="58" width="30" height="1.5" rx="1" fill="white" opacity="0.3"/>
        <rect x="10" y="100" width="55" height="1" rx="0.5" fill="#00d4d0" opacity="0.5"/>
      </svg>
    );
  }
  if (design === 'vertical-rail') {
    return (
      <svg viewBox="0 0 80 112" width="80" height="112">
        <rect width="80" height="112" fill="white" rx="4"/>
        <rect width="16" height="112" fill={p} rx="4"/>
        <rect x="0" y="0" width="4" height="112" fill={a}/>
        <rect x="22" y="20" width="45" height="3" rx="1" fill={p} opacity="0.85"/>
        <rect x="22" y="26" width="32" height="2" rx="1" fill="#64748B" opacity="0.5"/>
        <rect x="22" y="32" width="22" height="1.5" rx="1" fill={a} opacity="0.8"/>
        <rect x="22" y="45" width="48" height="0.8" rx="0.4" fill="#E2E8F0"/>
        <rect x="22" y="49" width="30" height="1.5" rx="1" fill="#334155" opacity="0.5"/>
        <rect x="22" y="54" width="38" height="1.5" rx="1" fill="#334155" opacity="0.35"/>
        <rect x="22" y="59" width="22" height="1.5" rx="1" fill="#334155" opacity="0.25"/>
        <rect x="22" y="100" width="48" height="0.8" rx="0.4" fill="#E2E8F0"/>
        <rect x="22" y="104" width="25" height="1.5" rx="1" fill={a} opacity="0.7"/>
      </svg>
    );
  }
  if (design === 'wave-infographic') {
    return (
      <svg viewBox="0 0 80 112" width="80" height="112">
        <rect width="80" height="112" fill="white" rx="4"/>
        <rect width="80" height="112" fill={p} opacity="0.04" rx="4"/>
        <path d={`M0,80 Q20,65 40,75 Q60,85 80,70 L80,112 L0,112 Z`} fill={p} opacity="0.12"/>
        <path d={`M0,88 Q25,75 50,85 Q65,90 80,80 L80,112 L0,112 Z`} fill={a} opacity="0.2"/>
        <circle cx="58" cy="22" r="14" fill={p} opacity="0.08"/>
        <circle cx="58" cy="22" r="8" fill={a} opacity="0.15"/>
        <rect x="8" y="18" width="38" height="3" rx="1" fill={p} opacity="0.9"/>
        <rect x="8" y="25" width="26" height="2" rx="1" fill="#64748B" opacity="0.5"/>
        <rect x="8" y="31" width="18" height="1.5" rx="1" fill={a} opacity="0.8"/>
        <rect x="8" y="44" width="60" height="0.8" rx="0.4" fill="#E2E8F0"/>
        <rect x="8" y="48" width="32" height="1.5" rx="1" fill="#334155" opacity="0.45"/>
        <rect x="8" y="53" width="42" height="1.5" rx="1" fill="#334155" opacity="0.3"/>
      </svg>
    );
  }
  if (design === 'blueprint-dense') {
    return (
      <svg viewBox="0 0 80 112" width="80" height="112">
        <rect width="80" height="112" fill="#1a2744" rx="4"/>
        {[8,16,24,32,40,48,56,64,72,80,88,96,104].map(y => (
          <line key={y} x1="0" y1={y} x2="80" y2={y} stroke="#243558" strokeWidth="0.4"/>
        ))}
        {[8,16,24,32,40,48,56,64,72].map(x => (
          <line key={x} x1={x} y1="0" x2={x} y2="112" stroke="#243558" strokeWidth="0.4"/>
        ))}
        <rect x="4" y="4" width="72" height="16" rx="2" fill="#2563EB" opacity="0.25"/>
        <rect x="4" y="4" width="72" height="16" rx="2" fill="none" stroke="#2563EB" strokeWidth="0.5" opacity="0.6"/>
        <rect x="7" y="7" width="35" height="2" rx="1" fill="white" opacity="0.85"/>
        <rect x="7" y="12" width="22" height="1.5" rx="1" fill="#93c5fd" opacity="0.6"/>
        <line x1="4" y1="24" x2="76" y2="24" stroke="#2563EB" strokeWidth="0.5" opacity="0.5" strokeDasharray="3,2"/>
        <rect x="4" y="28" width="34" height="18" rx="1" fill="none" stroke="#2563EB" strokeWidth="0.4" opacity="0.4"/>
        <rect x="42" y="28" width="34" height="18" rx="1" fill="none" stroke="#2563EB" strokeWidth="0.4" opacity="0.4"/>
        <rect x="7" y="31" width="20" height="1.2" rx="0.6" fill="white" opacity="0.4"/>
        <rect x="7" y="35" width="15" height="1.2" rx="0.6" fill="white" opacity="0.3"/>
        <rect x="7" y="39" width="18" height="1.2" rx="0.6" fill="white" opacity="0.25"/>
        <rect x="45" y="31" width="20" height="1.2" rx="0.6" fill="white" opacity="0.4"/>
        <rect x="45" y="35" width="25" height="1.2" rx="0.6" fill="white" opacity="0.3"/>
      </svg>
    );
  }
  // editorial-dark
  return (
    <svg viewBox="0 0 80 112" width="80" height="112">
      <rect width="80" height="112" fill="white" rx="4"/>
      <rect width="80" height="56" fill="#17172A" rx="4"/>
      <rect x="0" y="52" width="80" height="4" fill="white"/>
      <rect x="8" y="12" width="50" height="4" rx="1" fill="white" opacity="0.9"/>
      <rect x="8" y="20" width="35" height="2.5" rx="1" fill="white" opacity="0.5"/>
      <rect x="8" y="26" width="22" height="2" rx="1" fill={a} opacity="0.8"/>
      <rect x="8" y="38" width="60" height="0.8" rx="0.4" fill="white" opacity="0.15"/>
      <rect x="8" y="42" width="38" height="2" rx="1" fill="white" opacity="0.3"/>
      <rect x="8" y="48" width="25" height="1.5" rx="1" fill="white" opacity="0.2"/>
      <rect x="8" y="68" width="55" height="0.8" rx="0.4" fill="#E2E8F0"/>
      <rect x="8" y="72" width="32" height="1.5" rx="1" fill="#334155" opacity="0.6"/>
      <rect x="8" y="77" width="44" height="1.5" rx="1" fill="#334155" opacity="0.4"/>
      <rect x="8" y="82" width="28" height="1.5" rx="1" fill="#334155" opacity="0.3"/>
      <rect x="8" y="100" width="60" height="0.8" rx="0.4" fill="#E2E8F0"/>
      <rect x="8" y="104" width="25" height="1.5" rx="1" fill={a} opacity="0.7"/>
    </svg>
  );
}

interface CoverPagePanelProps {
  settings: CoverSettings;
  setSettings: React.Dispatch<React.SetStateAction<CoverSettings>>;
}

export function CoverPagePanel({ settings, setSettings }: CoverPagePanelProps) {
  const update = (key: keyof CoverSettings, val: string | boolean) =>
    setSettings(prev => ({ ...prev, [key]: val }));

  const InputField = ({ label, fieldKey, placeholder = '' }: { label: string; fieldKey: keyof CoverSettings; placeholder?: string }) => (
    <div>
      <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>
        {label.toUpperCase()}
      </label>
      <input
        value={settings[fieldKey] as string}
        onChange={e => update(fieldKey, e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg px-2.5 py-1.5 outline-none"
        style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155' }}
      />
    </div>
  );

  const ColorField = ({ label, fieldKey }: { label: string; fieldKey: keyof CoverSettings }) => (
    <div>
      <label style={{ fontSize: 10, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>
        {label.toUpperCase()}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={settings[fieldKey] as string}
          onChange={e => update(fieldKey, e.target.value)}
          style={{ width: 28, height: 28, border: '1.5px solid #E2E8F0', borderRadius: 6, cursor: 'pointer', padding: 2 }}
        />
        <input
          value={settings[fieldKey] as string}
          onChange={e => update(fieldKey, e.target.value)}
          className="flex-1 rounded-lg px-2 py-1 outline-none"
          style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 11, color: '#334155', fontFamily: 'DM Mono, monospace' }}
        />
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-6" style={{ backgroundColor: '#F8F9FC' }}>
      <div className="mb-5">
        <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 16 }}>Cover Page Customization</h2>
        <p style={{ color: '#64748B', fontSize: 13, marginTop: 2 }}>
          Design a polished cover page for your metabolomics report.
        </p>
      </div>

      {/* Include cover toggle */}
      <div
        className="rounded-xl p-4 mb-4 flex items-center gap-3"
        style={{ backgroundColor: 'white', border: '1px solid #E2E8F0' }}
      >
        <input
          type="checkbox"
          id="includeCover"
          checked={settings.includeCover}
          onChange={e => update('includeCover', e.target.checked)}
          style={{ accentColor: '#1E1B4B', width: 16, height: 16 }}
        />
        <div>
          <label htmlFor="includeCover" style={{ fontSize: 14, fontWeight: 600, color: '#17172A', cursor: 'pointer' }}>
            Include custom cover page
          </label>
          <p style={{ fontSize: 12, color: '#64748B' }}>Prepend a styled cover page to the exported PDF</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Cover design selector */}
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
        >
          <h3 className="font-semibold mb-3" style={{ fontSize: 13, color: '#17172A' }}>Cover Design Style</h3>
          <div className="flex flex-col gap-2">
            {COVER_DESIGNS.map(d => (
              <button
                key={d.id}
                onClick={() => update('coverDesign', d.id)}
                className="flex items-center gap-3 rounded-lg p-2 transition-all text-left"
                style={{
                  backgroundColor: settings.coverDesign === d.id ? '#EEF0F9' : 'transparent',
                  border: settings.coverDesign === d.id ? '1.5px solid #818cf8' : '1.5px solid transparent',
                }}
              >
                <div className="shrink-0 rounded-md overflow-hidden" style={{ border: '1px solid #E2E8F0' }}>
                  <CoverMiniPreview design={d.id} settings={settings} />
                </div>
                <span style={{ fontSize: 12, color: settings.coverDesign === d.id ? '#1E1B4B' : '#64748B', fontWeight: settings.coverDesign === d.id ? 600 : 400, lineHeight: 1.3 }}>
                  {d.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Cover fields — column 2 */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-semibold mb-3" style={{ fontSize: 13, color: '#17172A' }}>Report Identity</h3>
            <div className="flex flex-col gap-3">
              <InputField label="Project Title" fieldKey="projectTitle" placeholder="Untargeted Metabolomics Study" />
              <InputField label="Report Type" fieldKey="reportType" placeholder="Lipidomics · LC-MS/MS" />
              <InputField label="Cover Subtitle" fieldKey="coverSubtitle" placeholder="Plasma samples — Positive mode" />
              <InputField label="Prepared For" fieldKey="preparedFor" placeholder="Dr. Jane Smith" />
              <InputField label="Prepared By" fieldKey="preparedBy" placeholder="Metabolomics Core" />
              <InputField label="Generated Date" fieldKey="generatedDate" placeholder="May 30, 2026" />
              <InputField label="Primary Comparison" fieldKey="primaryComparison" placeholder="WT vs KO" />
            </div>
          </div>
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-semibold mb-3" style={{ fontSize: 13, color: '#17172A' }}>Summary &amp; Tags</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 4 }}>SAMPLE SUMMARY</label>
                <textarea
                  value={settings.sampleSummary}
                  onChange={e => update('sampleSummary', e.target.value)}
                  rows={2}
                  className="w-full rounded-lg px-2.5 py-1.5 outline-none resize-none"
                  style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 13, color: '#334155' }}
                />
              </div>
              <InputField label="Analysis Tags" fieldKey="analysisTags" placeholder="Lipidomics, RPLC, ESI+" />
              <InputField label="Logo / Brand Text" fieldKey="logoBrandText" placeholder="University Metabolomics Core" />
              <InputField label="Cover Footer" fieldKey="coverFooter" placeholder="Confidential — Internal Report" />
            </div>
          </div>
        </div>

        {/* Instrument metadata + colors */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-semibold mb-3" style={{ fontSize: 13, color: '#17172A' }}>Instrument &amp; Study Metadata</h3>
            <div className="grid grid-cols-2 gap-3">
              <InputField label="LC Method" fieldKey="lcMethod" placeholder="RPLC C18" />
              <InputField label="Polarity" fieldKey="polarity" placeholder="Positive" />
              <InputField label="MS System" fieldKey="msSystem" placeholder="Orbitrap Exploris 480" />
              <InputField label="Scan Range" fieldKey="scanRange" placeholder="67–1000 m/z" />
              <InputField label="Resolution" fieldKey="resolution" placeholder="60,000 FWHM" />
              <InputField label="Mass Accuracy" fieldKey="massAccuracy" placeholder="&lt;5 ppm" />
              <InputField label="Total Samples" fieldKey="totalSamples" placeholder="36" />
              <InputField label="Num Groups" fieldKey="numGroups" placeholder="4" />
              <InputField label="QC Samples" fieldKey="qcSamples" placeholder="6" />
              <InputField label="Pooled QC" fieldKey="pooledQC" placeholder="Yes" />
              <InputField label="Report Mode" fieldKey="reportMode" placeholder="Normalized" />
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
          >
            <h3 className="font-semibold mb-3" style={{ fontSize: 13, color: '#17172A' }}>Cover Color Palette</h3>
            <div className="grid grid-cols-2 gap-3">
              <ColorField label="Primary" fieldKey="coverPrimaryColor" />
              <ColorField label="Secondary" fieldKey="coverSecondaryColor" />
              <ColorField label="Accent" fieldKey="coverAccentColor" />
              <ColorField label="Accent 2" fieldKey="coverAccent2Color" />
              <ColorField label="Background" fieldKey="coverBgColor" />
              <ColorField label="Ink / Text" fieldKey="coverInkColor" />
              <ColorField label="Muted Text" fieldKey="coverMutedColor" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
