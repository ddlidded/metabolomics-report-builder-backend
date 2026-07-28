export type NavSection =
  | 'Dashboard'
  | 'Images & Figures'
  | 'CSV Plot Generator'
  | 'Page Layout'
  | 'Cover Page'
  | 'Statistics Export'
  | 'Preview & Export'
  | 'Settings Presets';

export type PageMode = 'SINGLE_PAGE' | 'COMBINED_GRID';

export type PlotSection =
  | 'Summary / Global'
  | 'Heatmap'
  | 'PCA / PLSDA'
  | 'Volcano'
  | 'Individual Bar Plots'
  | 'Other';

export interface PlotItem {
  id: string;
  order: number;
  title: string;
  fileName: string;
  pageMode: PageMode;
  section: PlotSection;
  selected: boolean;
}

export interface ReportSettings {
  title: string;
  headerLabel: string;
  footerText: string;
  orientation: 'Portrait' | 'Landscape';
  imageFit: 'contain' | 'cover' | 'stretch';
  headerColor: string;
  backgroundColor: string;
  cardBorderColor: string;
}

export interface PlotSettings {
  yAxisLabel: string;
  group1Color: string;
  group2Color: string;
  pointColor: string;
  showPValue: boolean;
  runAnova: boolean;
  fontSizeMode: string;
  rotationMode: string;
}

export interface SectionLayout {
  summaryPerPage: number;
  heatmapPerPage: number;
  pcaPerPage: number;
  volcanoPerPage: number;
  barPlotsPerPage: number;
  otherPerPage: number;
}

export interface SpacingSettings {
  marginInches: number;
  headerHeightInches: number;
  footerHeightInches: number;
  cardGapInches: number;
  imagePaddingInches: number;
  headerTitleFont: string;
  headerSubtitleFont: string;
  imageTitleFont: string;
  footerFont: string;
}

export interface CoverSettings {
  includeCover: boolean;
  coverDesign: string;
  projectTitle: string;
  reportType: string;
  coverSubtitle: string;
  preparedFor: string;
  preparedBy: string;
  generatedDate: string;
  primaryComparison: string;
  sampleSummary: string;
  analysisTags: string;
  coverFooter: string;
  logoBrandText: string;
  keyVisualizations: string;
  lcMethod: string;
  polarity: string;
  msSystem: string;
  scanRange: string;
  resolution: string;
  totalSamples: string;
  numGroups: string;
  qcSamples: string;
  pooledQC: string;
  reportMode: string;
  massAccuracy: string;
  coverPrimaryColor: string;
  coverSecondaryColor: string;
  coverAccentColor: string;
  coverAccent2Color: string;
  coverBgColor: string;
  coverInkColor: string;
  coverMutedColor: string;
}

export interface ExportSettings {
  exportMavenCSV: boolean;
  exportStatsCSV: boolean;
  showSectionBreaks: boolean;
  showHeader: boolean;
  showFooter: boolean;
  addPageNumbers: boolean;
  showExtraTitles: boolean;
  useFileNamesIfBlank: boolean;
}
