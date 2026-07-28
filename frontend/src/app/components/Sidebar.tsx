import type { ElementType } from 'react';
import {
  LayoutDashboard, Image, FileSpreadsheet, Layout,
  BookOpen, BarChart3, FileOutput, Settings2,
  FlaskConical, ChevronRight,
} from 'lucide-react';
import type { NavSection } from './types';

interface SidebarProps {
  activeSection: NavSection;
  onSectionChange: (section: NavSection) => void;
  plotCount: number;
}

const navItems: { icon: ElementType; label: NavSection; badge?: string }[] = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Image, label: 'Images & Figures' },
  { icon: FileSpreadsheet, label: 'CSV Plot Generator' },
  { icon: Layout, label: 'Page Layout' },
  { icon: BookOpen, label: 'Cover Page' },
  { icon: BarChart3, label: 'Statistics Export' },
  { icon: FileOutput, label: 'Preview & Export' },
  { icon: Settings2, label: 'Settings Presets' },
];

export function Sidebar({ activeSection, onSectionChange, plotCount }: SidebarProps) {
  return (
    <div
      className="flex flex-col h-full shrink-0"
      style={{ width: 220, backgroundColor: '#1E1B4B' }}
    >
      {/* Logo */}
      <div className="px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #17A398, #0d9488)' }}
          >
            <FlaskConical size={17} color="white" />
          </div>
          <div>
            <div style={{ color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', lineHeight: 1.3 }}>
              METABOLOMICS
            </div>
            <div style={{ color: '#818cf8', fontSize: 10, fontWeight: 400, lineHeight: 1.2 }}>
              PDF Report Builder
            </div>
          </div>
        </div>
      </div>

      {/* Status badge */}
      <div className="px-4 py-3">
        <div
          className="rounded-lg px-3 py-2"
          style={{ backgroundColor: 'rgba(23,163,152,0.12)', border: '1px solid rgba(23,163,152,0.25)' }}
        >
          <div style={{ color: '#5eead4', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em' }}>REPORT STATUS</div>
          <div className="flex items-center justify-between mt-1">
            <span style={{ color: 'white', fontSize: 12, fontWeight: 500 }}>{plotCount} figures loaded</span>
            <span
              className="rounded-full px-2 py-0.5"
              style={{ backgroundColor: '#17A398', color: 'white', fontSize: 10, fontWeight: 600 }}
            >
              READY
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 pb-3">
        <div style={{ color: '#6b7fc4', fontSize: 10, fontWeight: 600, letterSpacing: '0.09em', padding: '8px 6px 6px' }}>
          WORKFLOW
        </div>
        {navItems.map(({ icon: Icon, label }, idx) => {
          const isActive = activeSection === label;
          return (
            <button
              key={label}
              onClick={() => onSectionChange(label)}
              className="w-full flex items-center gap-2.5 rounded-lg mb-0.5 transition-all duration-150 group relative"
              style={{
                padding: '8px 10px',
                backgroundColor: isActive ? 'rgba(23,163,152,0.18)' : 'transparent',
                color: isActive ? '#5eead4' : '#a5b4fc',
                borderLeft: isActive ? '3px solid #17A398' : '3px solid transparent',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <div
                className="flex items-center justify-center rounded-md shrink-0"
                style={{
                  width: 28, height: 28,
                  backgroundColor: isActive ? 'rgba(23,163,152,0.2)' : 'rgba(255,255,255,0.06)',
                }}
              >
                <Icon size={14} />
              </div>
              <span className="flex-1">{label}</span>
              {isActive && <ChevronRight size={12} style={{ opacity: 0.7 }} />}
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 3, height: 20,
                  backgroundColor: isActive ? '#17A398' : 'transparent',
                  left: -3,
                }}
              />
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3.5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ color: '#4f5898', fontSize: 10, fontWeight: 400 }}>
          University Metabolomics Core
        </div>
        <div style={{ color: '#4f5898', fontSize: 10 }}>v2.4.1 · 2026</div>
      </div>
    </div>
  );
}
