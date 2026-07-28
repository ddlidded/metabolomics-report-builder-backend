import { X, CheckCircle2, Download, BarChart3, Loader2 } from 'lucide-react';

interface ExportConfirmModalProps {
  onClose: () => void;
  onExport: () => void;
  isLoading: boolean;
  pdfUrl: string;
  plotCount: number;
}

export function ExportConfirmModal({
  onClose,
  onExport,
  isLoading,
  pdfUrl,
  plotCount,
}: ExportConfirmModalProps) {
  const done = !isLoading && !!pdfUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(17,17,42,0.65)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (!isLoading && !done && e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{ width: 440, backgroundColor: 'white', boxShadow: '0 24px 64px rgba(0,0,0,0.25)' }}
      >
        {done ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#f0fdfa' }}>
              <CheckCircle2 size={32} style={{ color: '#17A398' }} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#17172A', marginBottom: 6 }}>Export Complete!</h2>
            <p style={{ fontSize: 13, color: '#64748B', marginBottom: 20 }}>
              Your PDF report has been generated successfully.
            </p>
            <div
              className="rounded-xl p-4 mb-4 text-left"
              style={{ backgroundColor: '#F8F9FC', border: '1px solid #E2E8F0' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Download size={14} style={{ color: '#1E1B4B' }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#1E1B4B' }}>Exported files:</span>
              </div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#64748B', lineHeight: 1.8 }}>
                {pdfUrl ? pdfUrl.split('/').pop() : 'metabolomics_report.pdf'}
              </div>
            </div>
            <a
              href={pdfUrl}
              download="metabolomics_report.pdf"
              className="block w-full py-2.5 rounded-lg font-semibold text-center mb-2"
              style={{ backgroundColor: '#1E1B4B', color: 'white', fontSize: 14 }}
            >
              Download PDF
            </a>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-lg font-semibold"
              style={{ backgroundColor: '#F4F6FA', color: '#64748B', fontSize: 14 }}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="px-6 py-5" style={{ borderBottom: '1px solid #E2E8F0' }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#17172A' }}>Export PDF Report</h2>
              <p style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Review your export configuration</p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#F8F9FC', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Download size={14} style={{ color: '#1E1B4B' }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#1E1B4B' }}>PDF Report</span>
                </div>
                <div className="flex flex-col gap-1.5" style={{ fontSize: 12, color: '#64748B' }}>
                  <div className="flex justify-between"><span>Figures:</span><span style={{ color: '#334155', fontWeight: 500 }}>{plotCount} plots</span></div>
                  <div className="flex justify-between"><span>Est. pages:</span><span style={{ color: '#334155', fontWeight: 500 }}>{Math.max(1, Math.ceil(plotCount / 4) + 1)}</span></div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2.5 p-3 rounded-xl cursor-pointer" style={{ border: '1px solid #E2E8F0', backgroundColor: '#F8F9FC' }}>
                  <BarChart3 size={14} style={{ color: '#17A398', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#334155' }}>PDF + Statistics CSV will be generated</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 px-6 pb-6">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: '#F4F6FA', color: '#64748B', fontSize: 13, border: '1px solid #E2E8F0' }}
              >
                Cancel
              </button>
              <button
                onClick={onExport}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-all"
                style={{ backgroundColor: '#1E1B4B', color: 'white', fontSize: 13, opacity: isLoading ? 0.85 : 1 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Building PDF…
                  </>
                ) : (
                  <>
                    <Download size={14} />
                    Export Report
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
