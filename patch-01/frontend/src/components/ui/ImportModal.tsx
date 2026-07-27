import React, { useState, useEffect } from 'react';
import { UploadCloud, X, FileText, CheckCircle2, RefreshCw } from 'lucide-react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleUploadClick = () => {
    setStep(2);
    // Simulate processing
    setTimeout(() => {
      setStep(3);
      // Auto close success alert
      setTimeout(() => {
        handleClose();
      }, 1500);
    }, 2000);
  };

  const handleClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
      {step === 1 && (
        <div className="bg-white rounded-2xl w-[500px] p-8 relative border-2 border-dashed border-gray-300">
          <button 
            onClick={handleClose}
            className="absolute top-4 right-4 text-red-500 border border-red-500 rounded-full p-1 hover:bg-red-50 transition-colors"
          >
            <X size={16} />
          </button>
          
          <div className="flex flex-col items-center text-center mt-4">
            <UploadCloud size={48} className="text-gray-400 mb-6" />
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Seret dan lepas file di sini</h3>
            <p className="text-gray-500 text-sm mb-8">atau klik untuk memilih file dari komputer Anda</p>
            
            <button 
              onClick={handleUploadClick}
              className="bg-[#3b0764] hover:bg-[#2e054e] text-white px-8 py-3 rounded-lg font-medium transition-colors mb-6"
            >
              Unggah File
            </button>
            
            <p className="text-gray-400 text-xs">
              Format yang didukung: CSV, XLSX (Maks. 50 MB)
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl w-[500px] p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900 text-lg">Upload Status</h3>
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
              <p className="font-medium text-gray-900">Q3_Sales_Data_PerJuni2026</p>
              <p className="text-sm text-gray-500 mt-1">Sedang mengerjakan ...</p>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white rounded-2xl w-[350px] p-8 shadow-xl relative text-center">
          <div className="w-16 h-16 bg-green-100 text-[#52b788] rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
          <p className="text-gray-600">File berhasil diunggah.</p>
        </div>
      )}
    </div>
  );
};
