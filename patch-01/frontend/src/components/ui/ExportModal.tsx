import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { CheckCircle2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, fileName }) => {
  const [step, setStep] = useState<1 | 3>(1);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleExport = async () => {
    try {
      const element = document.getElementById('export-content');
      if (!element) {
        alert("Export content not found");
        onClose();
        return;
      }

      // Hide the entire modal overlay so it doesn't appear in the PDF
      if (overlayRef.current) overlayRef.current.style.display = 'none';

      // Hide the sidebar completely during capture
      const sidebar = document.querySelector('aside') || document.querySelector('nav');
      const origSidebarDisplay = sidebar ? (sidebar as HTMLElement).style.display : '';
      if (sidebar) (sidebar as HTMLElement).style.display = 'none';

      // Save original styles
      const origMarginLeft = element.style.marginLeft;
      const origPadding = element.style.padding;

      // Remove sidebar margin so content fills the full width
      element.style.marginLeft = '0';
      element.style.padding = '8px 24px';

      // Hide topbar action buttons & settings/avatar for PDF
      const header = element.querySelector('header');
      const actionDiv = header?.querySelector(':scope > div:last-child') as HTMLElement | null;
      const origActionDisplay = actionDiv?.style.display || '';
      if (actionDiv) actionDiv.style.display = 'none';

      // Remove sticky from header so it renders inline
      const origHeaderPosition = header?.style.position || '';
      const origHeaderBackdrop = header ? (header as HTMLElement).style.backdropFilter : '';
      if (header) {
        header.style.position = 'relative';
        (header as HTMLElement).style.backdropFilter = 'none';
      }

      // Wait for reflow
      await new Promise(r => setTimeout(r, 300));

      // Capture at actual content width, then scale to fit A4 landscape
      const contentWidth = element.scrollWidth;

      const opt = {
        margin:       [8, 8, 8, 8],  // mm margins
        filename:     fileName,
        image:        { type: 'jpeg' as const, quality: 0.92 },
        html2canvas:  {
          scale: 2,
          useCORS: true,
          windowWidth: contentWidth,
          scrollY: 0,
          scrollX: 0,
          backgroundColor: '#f8fafc',
          logging: false,
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'landscape' as const },
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
      };

      const generatePdf = typeof html2pdf === 'function' ? html2pdf : (html2pdf as any).default;
      await generatePdf().set(opt).from(element).save();

      // Restore original styles
      element.style.marginLeft = origMarginLeft;
      element.style.padding = origPadding;
      if (actionDiv) actionDiv.style.display = origActionDisplay;
      if (header) {
        header.style.position = origHeaderPosition;
        (header as HTMLElement).style.backdropFilter = origHeaderBackdrop;
      }
      if (sidebar) (sidebar as HTMLElement).style.display = origSidebarDisplay;

      // Show the overlay again with success message
      if (overlayRef.current) overlayRef.current.style.display = '';
      setStep(3);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      // Restore on error
      const element = document.getElementById('export-content');
      if (element) {
        element.style.marginLeft = '';
        element.style.padding = '';
      }
      const sidebar = document.querySelector('aside') || document.querySelector('nav');
      if (sidebar) (sidebar as HTMLElement).style.display = '';
      if (overlayRef.current) overlayRef.current.style.display = '';
      alert("Export failed: " + (error?.message || String(error)));
      onClose();
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div ref={overlayRef} className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={step === 1 ? onClose : undefined}>
      {step === 1 && (
        <div className="bg-white rounded-2xl w-[400px] p-8 shadow-xl relative text-center" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Export</h3>
          <p className="text-gray-600 mb-8">Apakah Anda ingin mengekspor data tersebut?</p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={onClose}
              className="w-[120px] bg-[#ef4444] hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              Tidak
            </button>
            <button 
              onClick={handleExport}
              className="w-[120px] bg-[#52b788] hover:bg-[#40916c] text-white py-2.5 rounded-xl font-medium transition-colors"
            >
              Export
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl w-[350px] p-8 shadow-xl relative text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-green-100 text-[#52b788] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
          <p className="text-gray-600">Data berhasil diekspor.</p>
        </div>
      )}
    </div>
  , document.body);
};
