import React, { useEffect, useState } from 'react';
import { RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, fileName }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const handleExport = async () => {
    setStep(2);
    try {
      const element = document.getElementById('export-content');
      if (element) {
        const opt = {
          margin:       0.2,
          filename:     fileName,
          image:        { type: 'jpeg' as const, quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' as const }
        };

        const generatePdf = typeof html2pdf === 'function' ? html2pdf : (html2pdf as any).default;
        await generatePdf().set(opt).from(element).save();

        setStep(3);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        alert("Export content not found");
        onClose();
      }
    } catch (error: any) {
      alert("Export failed: " + (error?.message || String(error)));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={step === 1 ? onClose : undefined}>
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

      {step === 2 && (
        <div className="bg-white rounded-2xl w-[500px] p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Export Status</h3>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <RefreshCw size={14} className="animate-spin" />
              Memproses
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center text-[#9333ea] shrink-0">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-medium text-gray-900">{fileName}</p>
              <p className="text-sm text-gray-500 mt-1">Sedang mengerjakan ...</p>
            </div>
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
  );
};
