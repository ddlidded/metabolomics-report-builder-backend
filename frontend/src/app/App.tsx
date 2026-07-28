import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ImagesPanel } from './components/ImagesPanel';
import { CsvGeneratorPanel } from './components/CsvGeneratorPanel';
import { PageLayoutPanel } from './components/PageLayoutPanel';
import { CoverPagePanel } from './components/CoverPagePanel';
import { StatisticsExportPanel } from './components/StatisticsExportPanel';
import { PreviewExportPanel } from './components/PreviewExportPanel';
import { SettingsPresetsPanel } from './components/SettingsPresetsPanel';
import { RightSettingsPanel } from './components/RightSettingsPanel';
import { CSVImportModal, type DetectedGroup } from './components/CSVImportModal';
import { PDFPreviewModal } from './components/PDFPreviewModal';
import { ExportConfirmModal } from './components/ExportConfirmModal';
import {
  uploadImages,
  detectCsv,
  generateCsvPlots,
  exportReport,
  exportStats,
  exportMaven,
  downloadBlob,
} from '../api/client';
import type {
  NavSection, PlotItem, ReportSettings, PlotSettings,
  SectionLayout, SpacingSettings, CoverSettings, ExportSettings
} from './components/types';

const INITIAL_PLOTS: PlotItem[] = [];

const INITIAL_REPORT: ReportSettings = {
  title: 'Untargeted Metabolomics Study',
  headerLabel: 'METABOLOMICS CORE',
  footerText: 'University Metabolomics Core — Confidential',
  orientation: 'Portrait',
  imageFit: 'contain',
  headerColor: '#1E1B4B',
  backgroundColor: '#FFFFFF',
  cardBorderColor: '#E2E8F0',
};

const INITIAL_PLOT_SETTINGS: PlotSettings = {
  yAxisLabel: 'Peak Area',
  group1Color: '#2563EB',
  group2Color: '#17A398',
  pointColor: '#1E1B4B',
  showPValue: true,
  runAnova: true,
  fontSizeMode: 'Auto',
  rotationMode: 'Auto',
};

const INITIAL_LAYOUT: SectionLayout = {
  summaryPerPage: 1,
  heatmapPerPage: 1,
  pcaPerPage: 2,
  volcanoPerPage: 2,
  barPlotsPerPage: 9,
  otherPerPage: 4,
};

const INITIAL_SPACING: SpacingSettings = {
  marginInches: 0.5,
  headerHeightInches: 0.6,
  footerHeightInches: 0.4,
  cardGapInches: 0.15,
  imagePaddingInches: 0.05,
  headerTitleFont: 'Inter',
  headerSubtitleFont: 'Inter',
  imageTitleFont: 'Inter',
  footerFont: 'DM Mono',
};

const INITIAL_COVER: CoverSettings = {
  includeCover: true,
  coverDesign: 'modern-purple',
  projectTitle: 'Untargeted Metabolomics Study',
  reportType: 'Metabolomics · LC-MS/MS',
  coverSubtitle: 'Plasma samples — Positive mode',
  preparedFor: 'Dr. Jane Smith',
  preparedBy: 'University Metabolomics Core',
  generatedDate: 'May 30, 2026',
  primaryComparison: 'WT vs KO',
  sampleSummary: '36 samples across 4 groups. Normalized peak area data, quality-filtered.',
  analysisTags: 'Lipidomics, RPLC, ESI+, Orbitrap',
  coverFooter: 'Confidential — Internal Report',
  logoBrandText: 'University Metabolomics Core',
  keyVisualizations: 'PCA, Volcano, Heatmap, Bar Plots',
  lcMethod: 'RPLC C18',
  polarity: 'Positive',
  msSystem: 'Orbitrap Exploris 480',
  scanRange: '67–1000 m/z',
  resolution: '60,000 FWHM',
  totalSamples: '36',
  numGroups: '4',
  qcSamples: '6',
  pooledQC: 'Yes',
  reportMode: 'Normalized',
  massAccuracy: '<5 ppm',
  coverPrimaryColor: '#1E1B4B',
  coverSecondaryColor: '#312e81',
  coverAccentColor: '#17A398',
  coverAccent2Color: '#FFB703',
  coverBgColor: '#F8F9FC',
  coverInkColor: '#17172A',
  coverMutedColor: '#64748B',
};

const INITIAL_EXPORT: ExportSettings = {
  exportMavenCSV: false,
  exportStatsCSV: true,
  showSectionBreaks: true,
  showHeader: true,
  showFooter: true,
  addPageNumbers: true,
  showExtraTitles: true,
  useFileNamesIfBlank: true,
};

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('Images & Figures');
  const [plots, setPlots] = useState<PlotItem[]>(INITIAL_PLOTS);
  const [reportSettings, setReportSettings] = useState<ReportSettings>(INITIAL_REPORT);
  const [plotSettings, setPlotSettings] = useState<PlotSettings>(INITIAL_PLOT_SETTINGS);
  const [layout, setLayout] = useState<SectionLayout>(INITIAL_LAYOUT);
  const [spacing, setSpacing] = useState<SpacingSettings>(INITIAL_SPACING);
  const [coverSettings, setCoverSettings] = useState<CoverSettings>(INITIAL_COVER);
  const [exportSettings, setExportSettings] = useState<ExportSettings>(INITIAL_EXPORT);

  const [sessionId, setSessionId] = useState<string>('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvMetabolites, setCsvMetabolites] = useState(0);
  const [detectedGroups, setDetectedGroups] = useState<DetectedGroup[]>([]);
  const [selectedCsvGroups, setSelectedCsvGroups] = useState<string[]>([]);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [showExportConfirm, setShowExportConfirm] = useState(false);

  const handleAddImages = async (files: FileList) => {
    try {
      setIsLoading(true);
      const result = await uploadImages(files, sessionId || undefined);
      if (result.sessionId) setSessionId(result.sessionId);
      const next = [...plots, ...result.plots].map((p, i) => ({ ...p, order: i + 1 }));
      setPlots(next);
      setActiveSection('Images & Figures');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvUpload = async (file: File) => {
    try {
      setIsLoading(true);
      setCsvFile(file);
      const result = await detectCsv(file);
      setCsvMetabolites(result.metabolites);
      setDetectedGroups(result.groups);
      setShowCSVModal(true);
    } catch (err) {
      setShowCSVModal(false);
      setCsvFile(null);
      alert(err instanceof Error ? err.message : 'CSV detection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvGenerate = async (selectedGroups: string[]) => {
    if (!csvFile) return;
    try {
      setIsLoading(true);
      setSelectedCsvGroups(selectedGroups);
      const result = await generateCsvPlots(csvFile, selectedGroups, plotSettings, sessionId || undefined);
      if (result.sessionId) setSessionId(result.sessionId);
      const next = [...plots, ...result.plots].map((p, i) => ({ ...p, order: i + 1 }));
      setPlots(next);
      setShowCSVModal(false);
      setActiveSection('Images & Figures');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'CSV plot generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const buildReportPayload = () => ({
    plots,
    reportSettings,
    plotSettings,
    layout,
    spacing,
    coverSettings,
    exportSettings,
  });

  const handleExportReport = async () => {
    if (plots.length === 0) {
      alert('Add at least one figure before exporting.');
      return;
    }
    try {
      setIsLoading(true);
      const result = await exportReport(buildReportPayload(), sessionId || undefined);
      setSessionId(result.sessionId);
      setPdfUrl(result.pdfUrl);
      return result;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'PDF export failed');
      return undefined;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = async () => {
    const result = await handleExportReport();
    if (result) setShowPDFPreview(true);
  };

  const handleExportAndDownload = async () => {
    const result = await handleExportReport();
    if (result?.pdfUrl) {
      // Trigger browser download of the generated PDF
      const a = document.createElement('a');
      a.href = result.pdfUrl;
      a.download = 'metabolomics_report.pdf';
      a.click();
    }
  };

  const handleExportStats = async () => {
    if (!csvFile) {
      alert('Import a CSV file on the CSV Plot Generator tab first.');
      return;
    }
    if (selectedCsvGroups.length === 0) {
      alert('Generate bar plots from the CSV first so groups are known.');
      return;
    }
    try {
      setIsLoading(true);
      const blob = await exportStats(csvFile, selectedCsvGroups, plotSettings.runAnova, sessionId || undefined);
      downloadBlob(blob, 'generated_statistics.csv');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Statistics export failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportMaven = async () => {
    if (!csvFile) {
      alert('Import a CSV file on the CSV Plot Generator tab first.');
      return;
    }
    try {
      setIsLoading(true);
      const blob = await exportMaven(csvFile, sessionId || undefined);
      downloadBlob(blob, 'maven_knowns_list.csv');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Maven export failed');
    } finally {
      setIsLoading(false);
    }
  };

  const navSectionTitles: Record<NavSection, string> = {
    'Dashboard': 'Dashboard',
    'Images & Figures': 'Images & Figures',
    'CSV Plot Generator': 'CSV Plot Generator',
    'Page Layout': 'Page Layout',
    'Cover Page': 'Cover Page',
    'Statistics Export': 'Statistics Export',
    'Preview & Export': 'Preview & Export',
    'Settings Presets': 'Settings Presets',
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', backgroundColor: '#F8F9FC' }}
    >
      {/* Left sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        plotCount={plots.length}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-5 shrink-0"
          style={{ height: 46, backgroundColor: 'white', borderBottom: '1px solid #E2E8F0' }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 11, color: '#94a3b8' }}>Metabolomics Core</span>
            <span style={{ fontSize: 11, color: '#CBD5E1' }}>/</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#334155' }}>
              {navSectionTitles[activeSection]}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="rounded-full px-3 py-1 flex items-center gap-1.5"
              style={{ backgroundColor: '#f0fdfa', border: '1px solid #99f6e4' }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#17A398' }} />
              <span style={{ fontSize: 11, color: '#0f766e', fontWeight: 500 }}>
                {plots.length} figures · Ready to export
              </span>
            </div>
          </div>
        </div>

        {/* Content row */}
        <div className="flex-1 flex overflow-hidden">
          {/* Center panel */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {activeSection === 'Dashboard' && (
              <Dashboard plots={plots} onNavigate={setActiveSection} />
            )}
            {activeSection === 'Images & Figures' && (
              <ImagesPanel
                plots={plots}
                setPlots={setPlots}
                onAddImages={handleAddImages}
                onImportCSV={() => setActiveSection('CSV Plot Generator')}
              />
            )}
            {activeSection === 'CSV Plot Generator' && (
              <CsvGeneratorPanel
                csvFile={csvFile}
                groups={detectedGroups}
                isLoading={isLoading}
                onImportCSV={() => setShowCSVModal(true)}
                onCsvUpload={handleCsvUpload}
              />
            )}
            {activeSection === 'Page Layout' && (
              <PageLayoutPanel layout={layout} setLayout={setLayout} />
            )}
            {activeSection === 'Cover Page' && (
              <CoverPagePanel settings={coverSettings} setSettings={setCoverSettings} />
            )}
            {activeSection === 'Statistics Export' && (
              <StatisticsExportPanel
                onExportStats={handleExportStats}
                onExportMaven={handleExportMaven}
              />
            )}
            {activeSection === 'Preview & Export' && (
              <PreviewExportPanel
                onPreview={handlePreview}
                onExport={() => setShowExportConfirm(true)}
              />
            )}
            {activeSection === 'Settings Presets' && (
              <SettingsPresetsPanel />
            )}
          </div>

          {/* Right settings panel */}
          <RightSettingsPanel
            reportSettings={reportSettings}
            setReportSettings={setReportSettings}
            plotSettings={plotSettings}
            setPlotSettings={setPlotSettings}
            layout={layout}
            setLayout={setLayout}
            spacing={spacing}
            setSpacing={setSpacing}
            coverSettings={coverSettings}
            setCoverSettings={setCoverSettings}
            exportSettings={exportSettings}
            setExportSettings={setExportSettings}
            onPreview={handlePreview}
            onExport={() => setShowExportConfirm(true)}
          />
        </div>
      </div>

      {/* Modals */}
      {showCSVModal && csvFile && (
        <CSVImportModal
          onClose={() => setShowCSVModal(false)}
          onGenerate={handleCsvGenerate}
          groups={detectedGroups}
          fileName={csvFile.name}
          metabolites={csvMetabolites}
          isLoading={isLoading}
        />
      )}
      {showPDFPreview && (
        <PDFPreviewModal
          pdfUrl={pdfUrl}
          onClose={() => setShowPDFPreview(false)}
          onExport={() => { setShowPDFPreview(false); setShowExportConfirm(true); }}
        />
      )}
      {showExportConfirm && (
        <ExportConfirmModal
          onClose={() => setShowExportConfirm(false)}
          onExport={handleExportAndDownload}
          isLoading={isLoading}
          pdfUrl={pdfUrl}
          plotCount={plots.length}
        />
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ backgroundColor: 'rgba(17,17,42,0.35)', backdropFilter: 'blur(2px)' }}>
          <div className="rounded-xl px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'white', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}>
            <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: '#E2E8F0', borderTopColor: '#17A398' }} />
            <span style={{ fontSize: 13, color: '#334155', fontWeight: 500 }}>Working…</span>
          </div>
        </div>
      )}
    </div>
  );
}
