import type {
  PlotItem,
  ReportSettings,
  PlotSettings,
  SectionLayout,
  SpacingSettings,
  CoverSettings,
  ExportSettings,
} from '../app/components/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

function toSnake(str: string): string {
  // Treat all-caps acronyms as words before splitting
  let s = str
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase();
  return s;
}

function keysToSnake<T>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToSnake);
  }
  if (obj !== null && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = key === 'coverSettings'
        ? 'cover'
        : key === 'exportSettings'
        ? 'export'
        : key === 'plotSettings'
        ? 'plot_settings'
        : key === 'reportSettings'
        ? 'report_settings'
        : key === 'yAxisLabel'
        ? 'y_axis_label'
        : toSnake(key);
      out[newKey] = keysToSnake(value);
    }
    return out;
  }
  return obj;
}

function toCamel(str: string): string {
  return str
    .replace(/_([a-z0-9])/g, (_, ch: string) => ch.toUpperCase())
    .replace(/_/g, '');
}

function fixCamelAcronyms(key: string): string {
  if (key === 'export_maven_csv') return 'exportMavenCSV';
  if (key === 'export_stats_csv') return 'exportStatsCSV';
  if (key === 'is_qc') return 'isQC';
  return key;
}

function keysToCamel<T>(obj: T): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamel);
  }
  if (obj !== null && typeof obj === 'object') {
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      const newKey = fixCamelAcronyms(toCamel(key));
      out[newKey] = keysToCamel(value);
    }
    return out;
  }
  return obj;
}

async function api(path: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (!res.ok) {
    const text = await res.text().catch(() => 'Unknown error');
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res;
}

export interface UploadImagesResult {
  sessionId: string;
  plots: PlotItem[];
}

export async function uploadImages(
  files: FileList,
  sessionId?: string,
  section = 'Other'
): Promise<UploadImagesResult> {
  const params = new URLSearchParams();
  if (sessionId) params.set('session_id', sessionId);
  params.set('section', section);

  const body = new FormData();
  Array.from(files).forEach((file) => body.append('files', file));

  const res = await api(`/api/v1/uploads/images?${params.toString()}`, { method: 'POST', body });
  const data = keysToCamel(await res.json());
  return { sessionId: data.sessionId as string, plots: data.plots as PlotItem[] };
}

export interface DetectedGroup {
  name: string;
  count: number;
  isQC: boolean;
}

export interface CsvDetectResult {
  fileName: string;
  metabolites: number;
  samples: number;
  groups: DetectedGroup[];
}

export async function detectCsv(file: File): Promise<CsvDetectResult> {
  const body = new FormData();
  body.append('file', file);
  const res = await api('/api/v1/csv/detect', { method: 'POST', body });
  return keysToCamel(await res.json()) as CsvDetectResult;
}

export interface CsvGenerateResult {
  sessionId: string;
  plots: PlotItem[];
  imageUrls: string[];
}

export async function generateCsvPlots(
  file: File,
  selectedGroups: string[],
  plotSettings: PlotSettings,
  sessionId?: string
): Promise<CsvGenerateResult> {
  const body = new FormData();
  body.append('file', file);
  selectedGroups.forEach((g) => body.append('selected_groups', g));
  body.append('plot_settings_json', JSON.stringify(keysToSnake(plotSettings)));
  if (sessionId) body.append('session_id', sessionId);

  const res = await api('/api/v1/csv/generate', { method: 'POST', body });
  const data = keysToCamel(await res.json());
  return {
    sessionId: data.sessionId as string,
    plots: data.plots as PlotItem[],
    imageUrls: data.imageUrls as string[],
  };
}

export interface FullReportPayload {
  plots: PlotItem[];
  reportSettings: ReportSettings;
  plotSettings: PlotSettings;
  layout: SectionLayout;
  spacing: SpacingSettings;
  coverSettings: CoverSettings;
  exportSettings: ExportSettings;
}

export interface ExportReportResult {
  sessionId: string;
  pdfUrl: string;
}

export async function exportReport(
  payload: FullReportPayload,
  sessionId?: string
): Promise<ExportReportResult> {
  const body = new FormData();
  const request = keysToSnake(payload);
  body.append('request_json', JSON.stringify(request));
  if (sessionId) body.append('session_id', sessionId);

  const res = await api('/api/v1/export/report', { method: 'POST', body });
  const data = keysToCamel(await res.json());
  return { sessionId: data.sessionId as string, pdfUrl: data.pdfUrl as string };
}

export async function exportStats(
  file: File,
  selectedGroups: string[],
  runAnova = true,
  sessionId?: string
): Promise<Blob> {
  const body = new FormData();
  body.append('file', file);
  selectedGroups.forEach((g) => body.append('selected_groups', g));
  body.append('run_anova', runAnova ? 'true' : 'false');
  if (sessionId) body.append('session_id', sessionId);

  const res = await api('/api/v1/export/stats', { method: 'POST', body });
  return res.blob();
}

export async function exportMaven(file: File, sessionId?: string): Promise<Blob> {
  const body = new FormData();
  body.append('file', file);
  if (sessionId) body.append('session_id', sessionId);

  const res = await api('/api/v1/export/maven', { method: 'POST', body });
  return res.blob();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
