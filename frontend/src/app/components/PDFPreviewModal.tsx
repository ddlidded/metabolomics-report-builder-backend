import { useState } from 'react';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';

interface PDFPreviewModalProps {
  pdfUrl: string;
  onClose: () => void;
  onExport: () => void;
}

export function PDFPreviewModal({ pdfUrl, onClose, onExport }: PDFPreviewModalProps) {
  const [zoom, setZoom] = useState(100);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: 'rgba(17,17,42,0.85)', backdropFilter: 'blur(6px)' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ backgroundColor: '#17172A', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1E1B4B' }}>
            <span style={{ fontSize: 12 }}>📄</span>
          </div>
          <div>
            <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>PDF Preview</div>
            <div style={{ color: '#94a3b8', fontSize: 11 }}>
              {pdfUrl ? pdfUrl.split('/').pop() : 'No PDF generated yet'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg px-2 py-1" style={{ backgroundColor: '#1E1B4B' }}>
            <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="w-6 h-6 flex items-center justify-center rounded" style={{ color: '#a5b4fc' }}>
              <ZoomOut size={13} />
            </button>
            <span style={{ fontSize: 12, color: 'white', minWidth: 36, textAlign: 'center' }}>{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="w-6 h-6 flex items-center justify-center rounded" style={{ color: '#a5b4fc' }}>
              <ZoomIn size={13} />
            </button>
          </div>
          {pdfUrl && (
            <a
              href={pdfUrl}
              download="metabolomics_report.pdf"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors"
              style={{ backgroundColor: '#17A398', color: 'white', fontSize: 13 }}
            >
              <Download size={14} />
              Download PDF
            </a>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
            style={{ backgroundColor: '#2d2d42', color: '#94a3b8' }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Page view area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-6" style={{ backgroundColor: '#1a1a2e' }}>
        {pdfUrl ? (
          <div
            className="rounded-lg overflow-hidden bg-white shadow-2xl"
            style={{
              width: `${Math.round(8.5 * 96 * zoom / 100)}px`,
              height: `${Math.round(11 * 96 * zoom / 100)}px`,
            }}
          >
            <iframe
              src={pdfUrl}
              title="PDF Preview"
              className="w-full h-full border-0"
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', width: `${100 * 100 / zoom}%`, height: `${100 * 100 / zoom}%` }}
            />
          </div>
        ) : (
          <div className="text-center" style={{ color: '#94a3b8' }}>
            <p style={{ fontSize: 14 }}>Click “Preview” or “Export” to generate a PDF first.</p>
          </div>
        )}
      </div>
    </div>
  );
}
