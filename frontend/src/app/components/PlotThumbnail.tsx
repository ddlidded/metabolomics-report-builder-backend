import type { PlotSection } from './types';

const sectionColors: Record<PlotSection, { bg: string; fg: string; fg2: string }> = {
  'Summary / Global': { bg: '#f3f0ff', fg: '#7c3aed', fg2: '#a78bfa' },
  'PCA / PLSDA': { bg: '#eff6ff', fg: '#2563EB', fg2: '#93c5fd' },
  'Heatmap': { bg: '#fdf2f8', fg: '#be185d', fg2: '#f9a8d4' },
  'Volcano': { bg: '#fffbeb', fg: '#b45309', fg2: '#fcd34d' },
  'Individual Bar Plots': { bg: '#f0fdfa', fg: '#17A398', fg2: '#5eead4' },
  'Other': { bg: '#f8fafc', fg: '#64748B', fg2: '#cbd5e1' },
};

interface PlotThumbnailProps {
  section: PlotSection;
}

export function PlotThumbnail({ section }: PlotThumbnailProps) {
  const { bg, fg, fg2 } = sectionColors[section];

  const renderChart = () => {
    if (section === 'Heatmap') {
      const grid = [
        [0.9, 0.3, 0.7, 0.5],
        [0.2, 0.8, 0.4, 0.9],
        [0.6, 0.5, 0.1, 0.7],
      ];
      return (
        <svg viewBox="0 0 48 36" width="48" height="36">
          {grid.map((row, r) =>
            row.map((v, c) => (
              <rect
                key={`${r}-${c}`}
                x={c * 12 + 1} y={r * 12 + 1}
                width={11} height={11}
                rx={1}
                fill={v > 0.6 ? fg : v > 0.35 ? '#e879f9' : fg2}
                opacity={0.4 + v * 0.6}
              />
            ))
          )}
        </svg>
      );
    }

    if (section === 'PCA / PLSDA') {
      const pts1 = [[10,22],[14,18],[12,26],[8,20],[16,15],[11,24]];
      const pts2 = [[30,14],[34,10],[28,18],[32,8],[36,16],[31,12]];
      return (
        <svg viewBox="0 0 48 36" width="48" height="36">
          <line x1="4" y1="32" x2="44" y2="32" stroke={fg} strokeWidth="0.8" opacity="0.3"/>
          <line x1="4" y1="4" x2="4" y2="32" stroke={fg} strokeWidth="0.8" opacity="0.3"/>
          {pts1.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="2.5" fill={fg} opacity="0.7"/>)}
          {pts2.map(([x,y],i) => <circle key={i} cx={x} cy={y} r="2.5" fill={fg2} opacity="0.85"/>)}
        </svg>
      );
    }

    if (section === 'Volcano') {
      const dots = [
        [8,8,'#ef4444'],[12,12,fg2],[36,9,'#ef4444'],[40,7,'#ef4444'],
        [18,20,fg2],[24,24,fg],[30,18,fg2],[22,14,fg2],
        [10,26,fg2],[38,14,'#ef4444'],[15,28,fg2],[33,10,'#ef4444']
      ];
      return (
        <svg viewBox="0 0 48 36" width="48" height="36">
          <line x1="24" y1="2" x2="24" y2="34" stroke={fg} strokeWidth="0.6" opacity="0.3" strokeDasharray="2,2"/>
          <line x1="4" y1="28" x2="44" y2="28" stroke={fg} strokeWidth="0.6" opacity="0.3"/>
          {dots.map(([x,y,c],i) => <circle key={i} cx={x as number} cy={y as number} r="2" fill={c as string} opacity="0.8"/>)}
        </svg>
      );
    }

    if (section === 'Individual Bar Plots') {
      const bars = [0.8, 0.5, 0.65, 0.9, 0.4];
      return (
        <svg viewBox="0 0 48 36" width="48" height="36">
          <line x1="4" y1="32" x2="44" y2="32" stroke={fg} strokeWidth="0.8" opacity="0.3"/>
          {bars.map((h, i) => (
            <g key={i}>
              <rect
                x={4 + i * 8 + 1} y={32 - h * 26}
                width={6} height={h * 26}
                rx={1}
                fill={i % 2 === 0 ? fg : '#FFB703'}
                opacity="0.85"
              />
              {h > 0.75 && <line x1={7 + i * 8} y1={32 - h * 26 - 2} x2={7 + i * 8} y2={32 - h * 26 - 6} stroke="#ef4444" strokeWidth="1"/>}
            </g>
          ))}
        </svg>
      );
    }

    if (section === 'Summary / Global') {
      return (
        <svg viewBox="0 0 48 36" width="48" height="36">
          <polyline
            points="4,28 10,20 18,14 24,16 32,8 40,12 46,6"
            fill="none" stroke={fg} strokeWidth="1.5" opacity="0.8"
          />
          <polyline
            points="4,28 10,20 18,14 24,16 32,8 40,12 46,6 46,32 4,32"
            fill={fg} opacity="0.12"
          />
          {[[10,20],[18,14],[24,16],[32,8],[40,12]].map(([x,y],i) => (
            <circle key={i} cx={x} cy={y} r="2" fill={fg} opacity="0.9"/>
          ))}
        </svg>
      );
    }

    return (
      <svg viewBox="0 0 48 36" width="48" height="36">
        <rect x="4" y="8" width="8" height="24" rx="1" fill={fg} opacity="0.7"/>
        <rect x="16" y="14" width="8" height="18" rx="1" fill={fg2} opacity="0.7"/>
        <rect x="28" y="4" width="8" height="28" rx="1" fill={fg} opacity="0.5"/>
        <rect x="40" y="18" width="6" height="14" rx="1" fill={fg2} opacity="0.7"/>
      </svg>
    );
  };

  return (
    <div
      className="rounded-lg overflow-hidden flex items-center justify-center"
      style={{ width: 52, height: 40, backgroundColor: bg, border: `1px solid ${fg}22`, flexShrink: 0 }}
    >
      {renderChart()}
    </div>
  );
}
