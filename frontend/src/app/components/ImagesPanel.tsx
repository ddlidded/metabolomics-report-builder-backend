import { useRef, useState } from 'react';
import type { ElementType } from 'react';
import {
  ImagePlus, FileSpreadsheet, Trash2, X, ArrowUp, ArrowDown,
  ArrowUpToLine, AlignLeft, ArrowUpDown, Square, Grid3x3,
  Tag, Pencil, FileText, ChevronDown, GripVertical, CheckSquare,
  Search,
} from 'lucide-react';
import type { PlotItem, PageMode, PlotSection } from './types';
import { PlotThumbnail } from './PlotThumbnail';

interface ImagesPanelProps {
  plots: PlotItem[];
  setPlots: React.Dispatch<React.SetStateAction<PlotItem[]>>;
  onAddImages: (files: FileList) => void;
  onImportCSV: () => void;
}

const SECTION_OPTIONS: PlotSection[] = [
  'Summary / Global', 'Heatmap', 'PCA / PLSDA', 'Volcano', 'Individual Bar Plots', 'Other'
];

const sectionBadgeColors: Record<PlotSection, { bg: string; text: string }> = {
  'Summary / Global': { bg: '#ede9fe', text: '#6d28d9' },
  'PCA / PLSDA': { bg: '#dbeafe', text: '#1d4ed8' },
  'Heatmap': { bg: '#fce7f3', text: '#be185d' },
  'Volcano': { bg: '#fef3c7', text: '#92400e' },
  'Individual Bar Plots': { bg: '#ccfbf1', text: '#0f766e' },
  'Other': { bg: '#f1f5f9', text: '#475569' },
};

export function ImagesPanel({ plots, setPlots, onAddImages, onImportCSV }: ImagesPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [sectionDropdownId, setSectionDropdownId] = useState<string | null>(null);

  const selected = plots.filter(p => p.selected);
  const filteredPlots = plots.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) =>
    setPlots(prev => prev.map(p => p.id === id ? { ...p, selected: !p.selected } : p));

  const toggleAll = () => {
    const allSelected = plots.every(p => p.selected);
    setPlots(prev => prev.map(p => ({ ...p, selected: !allSelected })));
  };

  const removeSelected = () => setPlots(prev => prev.filter(p => !p.selected).map((p, i) => ({ ...p, order: i + 1 })));

  const clearAll = () => setPlots([]);

  const moveUp = () => {
    setPlots(prev => {
      const arr = [...prev];
      for (let i = 1; i < arr.length; i++) {
        if (arr[i].selected && !arr[i - 1].selected) {
          [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        }
      }
      return arr.map((p, i) => ({ ...p, order: i + 1 }));
    });
  };

  const moveDown = () => {
    setPlots(prev => {
      const arr = [...prev];
      for (let i = arr.length - 2; i >= 0; i--) {
        if (arr[i].selected && !arr[i + 1].selected) {
          [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        }
      }
      return arr.map((p, i) => ({ ...p, order: i + 1 }));
    });
  };

  const moveToTop = () => {
    setPlots(prev => {
      const sel = prev.filter(p => p.selected);
      const rest = prev.filter(p => !p.selected);
      return [...sel, ...rest].map((p, i) => ({ ...p, order: i + 1 }));
    });
  };

  const sortByName = () =>
    setPlots(prev => [...prev].sort((a, b) => a.fileName.localeCompare(b.fileName)).map((p, i) => ({ ...p, order: i + 1 })));

  const setMode = (mode: PageMode) =>
    setPlots(prev => prev.map(p => p.selected ? { ...p, pageMode: mode } : p));

  const setSection = (section: PlotSection) => {
    setPlots(prev => prev.map(p => p.selected ? { ...p, section } : p));
  };

  const setSectionForRow = (id: string, section: PlotSection) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, section } : p));
    setSectionDropdownId(null);
  };

  const useFileNamesAsTitles = () =>
    setPlots(prev => prev.map(p => ({ ...p, title: p.fileName.replace(/\.[^/.]+$/, '').replace(/_/g, ' ') })));

  const startEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditTitle(title);
  };

  const saveEdit = () => {
    if (editingId) {
      setPlots(prev => prev.map(p => p.id === editingId ? { ...p, title: editTitle } : p));
      setEditingId(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddImages(e.target.files);
      e.target.value = '';
    }
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const ToolbarButton = ({
    icon: Icon, label, onClick, variant = 'default', disabled = false
  }: {
    icon: ElementType; label: string; onClick: () => void; variant?: 'default' | 'primary' | 'teal' | 'danger'; disabled?: boolean
  }) => {
    const styles: Record<string, React.CSSProperties> = {
      default: { backgroundColor: 'white', color: '#334155', border: '1px solid #E2E8F0' },
      primary: { backgroundColor: '#1E1B4B', color: 'white', border: '1px solid #1E1B4B' },
      teal: { backgroundColor: '#17A398', color: 'white', border: '1px solid #17A398' },
      danger: { backgroundColor: 'white', color: '#dc2626', border: '1px solid #fecaca' },
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all duration-150 whitespace-nowrap"
        style={{ ...styles[variant], fontSize: 12, fontWeight: 500, opacity: disabled ? 0.45 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <Icon size={13} />
        <span>{label}</span>
      </button>
    );
  };

  const anySelected = selected.length > 0;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#F8F9FC' }}>
      {/* Panel header */}
      <div className="px-6 py-4 shrink-0" style={{ backgroundColor: 'white', borderBottom: '1px solid #E2E8F0' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold" style={{ color: '#17172A', fontSize: 16 }}>Plot Selection &amp; Page Assignment</h2>
            <p style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>
              {plots.length} figures · {selected.length} selected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: '#94a3b8' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search figures…"
                className="rounded-lg pl-8 pr-3 py-1.5 outline-none"
                style={{ backgroundColor: '#F4F6FA', border: '1px solid #E2E8F0', fontSize: 12, color: '#334155', width: 200 }}
              />
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {/* Add cluster */}
          <ToolbarButton icon={ImagePlus} label="Add Images" onClick={openFilePicker} variant="primary" />
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <ToolbarButton icon={FileSpreadsheet} label="Import CSV + Generate Bar Plots" onClick={onImportCSV} variant="teal" />
          <div style={{ width: 1, height: 24, backgroundColor: '#E2E8F0', margin: '0 4px' }} />
          {/* Remove */}
          <ToolbarButton icon={Trash2} label="Remove Selected" onClick={removeSelected} variant="danger" disabled={!anySelected} />
          <ToolbarButton icon={X} label="Clear All" onClick={clearAll} variant="danger" disabled={plots.length === 0} />
          <div style={{ width: 1, height: 24, backgroundColor: '#E2E8F0', margin: '0 4px' }} />
          {/* Order */}
          <ToolbarButton icon={ArrowUpToLine} label="Move to Top" onClick={moveToTop} disabled={!anySelected} />
          <ToolbarButton icon={ArrowUp} label="Move Up" onClick={moveUp} disabled={!anySelected} />
          <ToolbarButton icon={ArrowDown} label="Move Down" onClick={moveDown} disabled={!anySelected} />
          <ToolbarButton icon={ArrowUpDown} label="Sort by Name" onClick={sortByName} />
          <div style={{ width: 1, height: 24, backgroundColor: '#E2E8F0', margin: '0 4px' }} />
          {/* Mode */}
          <ToolbarButton icon={Square} label="Set SINGLE PAGE" onClick={() => setMode('SINGLE_PAGE')} disabled={!anySelected} />
          <ToolbarButton icon={Grid3x3} label="Set COMBINED GRID" onClick={() => setMode('COMBINED_GRID')} disabled={!anySelected} />
          <div style={{ width: 1, height: 24, backgroundColor: '#E2E8F0', margin: '0 4px' }} />
          {/* Properties */}
          <div className="relative">
            <button
              disabled={!anySelected}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all"
              style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', fontSize: 12, color: '#334155', opacity: !anySelected ? 0.45 : 1, cursor: !anySelected ? 'not-allowed' : 'pointer' }}
              onClick={() => setSectionDropdownId(sectionDropdownId === 'toolbar' ? null : 'toolbar')}
            >
              <Tag size={13} />
              <span>Apply Section</span>
              <ChevronDown size={11} />
            </button>
            {sectionDropdownId === 'toolbar' && (
              <div
                className="absolute z-20 top-full mt-1 rounded-xl overflow-hidden"
                style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160 }}
              >
                {SECTION_OPTIONS.map(sec => (
                  <button
                    key={sec}
                    className="w-full text-left px-3 py-2 transition-colors hover:bg-[#F8F9FC]"
                    style={{ fontSize: 12, color: '#334155' }}
                    onClick={() => { setSection(sec); setSectionDropdownId(null); }}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            )}
          </div>
          <ToolbarButton icon={FileText} label="Use File Names as Titles" onClick={useFileNamesAsTitles} />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {plots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: '#EEF0F9' }}
            >
              <ImagePlus size={32} style={{ color: '#818cf8' }} />
            </div>
            <div className="text-center">
              <p style={{ fontSize: 15, fontWeight: 600, color: '#334155' }}>No figures loaded</p>
              <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Add plot images or import CSV data to get started</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={openFilePicker}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: '#1E1B4B', color: 'white', fontSize: 13 }}
              >
                Add Images
              </button>
              <button
                onClick={onImportCSV}
                className="px-4 py-2 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: '#17A398', color: 'white', fontSize: 13 }}
              >
                Import CSV
              </button>
            </div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ backgroundColor: '#F1F3F9', borderBottom: '1px solid #E2E8F0' }}>
                <th style={{ width: 40, padding: '10px 8px 10px 16px' }}>
                  <input
                    type="checkbox"
                    checked={plots.length > 0 && plots.every(p => p.selected)}
                    onChange={toggleAll}
                    style={{ accentColor: '#1E1B4B', width: 14, height: 14 }}
                  />
                </th>
                <th style={{ width: 40, padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#64748B', textAlign: 'left', letterSpacing: '0.05em' }}>#</th>
                <th style={{ width: 64, padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em' }}>PREVIEW</th>
                <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#64748B', textAlign: 'left', letterSpacing: '0.05em' }}>PLOT TITLE</th>
                <th style={{ padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#64748B', textAlign: 'left', letterSpacing: '0.05em' }}>FILE NAME</th>
                <th style={{ width: 130, padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#64748B', textAlign: 'left', letterSpacing: '0.05em' }}>PAGE MODE</th>
                <th style={{ width: 160, padding: '10px 8px', fontSize: 11, fontWeight: 600, color: '#64748B', textAlign: 'left', letterSpacing: '0.05em' }}>SECTION</th>
                <th style={{ width: 70, padding: '10px 16px 10px 8px', fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlots.map((plot, idx) => (
                <tr
                  key={plot.id}
                  style={{
                    backgroundColor: plot.selected ? '#f3f1ff' : idx % 2 === 0 ? 'white' : '#FAFBFD',
                    borderBottom: '1px solid #F1F3F9',
                    transition: 'background-color 0.1s',
                  }}
                >
                  <td style={{ padding: '10px 8px 10px 16px' }}>
                    <input
                      type="checkbox"
                      checked={plot.selected}
                      onChange={() => toggleSelect(plot.id)}
                      style={{ accentColor: '#1E1B4B', width: 14, height: 14 }}
                    />
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <div className="flex items-center gap-1">
                      <GripVertical size={12} style={{ color: '#cbd5e1' }} />
                      <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'DM Mono, monospace' }}>{plot.order}</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <PlotThumbnail section={plot.section} />
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    {editingId === plot.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingId(null); }}
                          className="rounded px-2 py-1 outline-none"
                          style={{ fontSize: 13, border: '1.5px solid #818cf8', backgroundColor: 'white', width: '100%', maxWidth: 280 }}
                        />
                        <button onClick={saveEdit} style={{ fontSize: 11, color: '#17A398', fontWeight: 600 }}>Save</button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 13, color: '#17172A', fontWeight: 500 }}>{plot.title}</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    <span style={{ fontSize: 12, color: '#64748B', fontFamily: 'DM Mono, monospace' }}>{plot.fileName}</span>
                  </td>
                  <td style={{ padding: '10px 8px' }}>
                    {plot.pageMode === 'SINGLE_PAGE' ? (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5"
                        style={{ backgroundColor: '#ede9fe', color: '#5b21b6', fontSize: 11, fontWeight: 600 }}
                      >
                        <Square size={10} /> SINGLE PAGE
                      </span>
                    ) : (
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5"
                        style={{ backgroundColor: '#ccfbf1', color: '#0f766e', fontSize: 11, fontWeight: 600 }}
                      >
                        <Grid3x3 size={10} /> COMBINED GRID
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '10px 8px', position: 'relative' }}>
                    <button
                      onClick={() => setSectionDropdownId(sectionDropdownId === plot.id ? null : plot.id)}
                      className="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors"
                      style={{
                        backgroundColor: sectionBadgeColors[plot.section].bg,
                        color: sectionBadgeColors[plot.section].text,
                        fontSize: 11, fontWeight: 600,
                        border: 'none', cursor: 'pointer',
                      }}
                    >
                      <span>{plot.section}</span>
                      <ChevronDown size={10} />
                    </button>
                    {sectionDropdownId === plot.id && (
                      <div
                        className="absolute z-30 rounded-xl overflow-hidden"
                        style={{ top: '100%', left: 0, backgroundColor: 'white', border: '1px solid #E2E8F0', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 170, marginTop: 4 }}
                      >
                        {SECTION_OPTIONS.map(sec => (
                          <button
                            key={sec}
                            className="w-full text-left px-3 py-2 transition-colors"
                            style={{ fontSize: 12, color: sec === plot.section ? '#1E1B4B' : '#334155', fontWeight: sec === plot.section ? 600 : 400, backgroundColor: sec === plot.section ? '#EEF0F9' : 'transparent' }}
                            onClick={() => setSectionForRow(plot.id, sec)}
                          >
                            {sec}
                          </button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '10px 16px 10px 8px' }}>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(plot.id, plot.title)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#F1F3F9', color: '#64748B' }}
                        title="Edit title"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => setPlots(prev => prev.filter(p => p.id !== plot.id).map((p, i) => ({ ...p, order: i + 1 })))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}
                        title="Remove"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
