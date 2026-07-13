import React, { useEffect, useState } from 'react';
import { RefreshCw, FileText, CheckCircle2 } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, fileName }) => {
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      // Simulate processing
      const timer = setTimeout(() => {
        setStep(2);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
      {step === 1 && (
        <div className="bg-white rounded-2xl w-[500px] p-8 relative shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Export Status</h3>
            <span className="flex items-center gap-2 text-gray-500 text-sm">
              <RefreshCw size={16} className="animate-spin" /> Memproses
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center text-[#3b0764]">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">{fileName}</p>
              <p className="text-sm text-gray-500">Sedang mengerjakan ...</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl w-[400px] p-8 shadow-xl text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 size={32} className="text-[#10b981]" />
          </div>
          <h3 className="font-bold text-[#10b981] text-xl mb-8">File Berhasil di Export</h3>
          <button 
            onClick={onClose}
            className="bg-[#52b788] hover:bg-[#40916c] text-white px-8 py-2.5 rounded-lg font-medium transition-colors"
          >
            Kembali
          </button>
        </div>
      )}
    </div>
  );
};
