import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle, XCircle } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { Topbar } from '../components/layout/Topbar';

interface ImportHistory {
  id: number;
  created_at: string;
  file_name: string;
  status: 'success' | 'failed' | 'processing';
}

export const ImportDataPage = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Mock data for initial UI dev
  const history: ImportHistory[] = [
    { id: 1, created_at: '28 Juni 2026', file_name: 'Q3_Sales_Data.xlsx', status: 'success' },
    { id: 2, created_at: '28 Juni 2026', file_name: 'Sales_Data_Q2.csv', status: 'success' },
    { id: 3, created_at: '28 Juni 2026', file_name: 'Juni_Data_Baru.xlsx', status: 'success' },
    { id: 4, created_at: '28 Juni 2026', file_name: 'Distributor_Lama.csv', status: 'failed' },
  ];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setCurrentFile(file);
      setIsUploading(true);
      setUploadStatus('idle');
      
      // Simulate upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('success');
      }, 2000);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxSize: 52428800 // 50MB
  });

  return (
    <MainLayout>
      <Topbar title="Import Data" />
      
      <div className="px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Uploader Card */}
          <div 
            {...getRootProps()}
            className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-white ${
              isDragActive ? 'border-[#3b0764] bg-[#f3e8ff]' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud size={48} className="text-gray-400 mb-6" />
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Seret dan lepas file di sini</h3>
            <p className="text-gray-500 mb-8">atau klik untuk memilih file dari komputer Anda</p>
            
            <button className="bg-[#3b0764] hover:bg-[#2e054e] text-white px-8 py-3 rounded-lg font-medium transition-colors mb-6">
              Unggah File
            </button>
            
            <p className="text-sm text-gray-400">Format yang didukung: CSV, XLSX (Maks. 50 MB)</p>
          </div>

          {/* Upload Status Card */}
          {(currentFile || isUploading || uploadStatus !== 'idle') && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-gray-900">Upload Status</h4>
                {uploadStatus === 'success' && (
                  <span className="flex items-center gap-1 text-[#10b981] text-sm font-medium">
                    <CheckCircle size={16} /> Berhasil
                  </span>
                )}
                {uploadStatus === 'error' && (
                  <span className="flex items-center gap-1 text-[#ef4444] text-sm font-medium">
                    <XCircle size={16} /> Gagal
                  </span>
                )}
                {isUploading && (
                  <span className="text-gray-500 text-sm font-medium">Memproses...</span>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f3e8ff] flex items-center justify-center text-[#3b0764]">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentFile?.name || 'File Upload'}</p>
                  <p className="text-sm text-gray-500">
                    {isUploading ? 'Sedang mengerjakan ...' : 'Selesai'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full min-h-[500px]">
            <h3 className="font-bold text-gray-900 mb-6">Riwayat Import</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="pb-3 font-normal">Tanggal</th>
                    <th className="pb-3 font-normal">Nama File</th>
                    <th className="pb-3 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-4 text-gray-600">{item.created_at}</td>
                      <td className="py-4 font-medium text-gray-900">{item.file_name}</td>
                      <td className="py-4">
                        {item.status === 'success' ? (
                          <span className="flex items-center gap-1 text-[#10b981]">
                            <CheckCircle size={14} /> Berhasil
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[#ef4444]">
                            <XCircle size={14} /> Gagal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};
