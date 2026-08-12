import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { PaintRoller, Wrench, Factory, X, Save, CheckCircle2 } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface TargetSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  data?: any;
  onSave: (data: any) => void;
  salesList: string[];
}

export const TargetSalesModal: React.FC<TargetSalesModalProps> = ({ isOpen, onClose, mode, data, onSave, salesList }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const [tahun, setTahun] = useState('2026');
  const [bulan, setBulan] = useState('Juli');
  const [area, setArea] = useState('Semua Area');
  const [salesName, setSalesName] = useState(salesList[0] || 'Semua Sales');

  const [decorative, setDecorative] = useState('');
  const [automotive, setAutomotive] = useState('');
  const [industri, setIndustri] = useState('');
  const [totalTarget, setTotalTarget] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Utility to format number as Rupiah
  const formatRupiah = (val: string) => {
    if (!val) return '';
    const numeric = val.replace(/[^0-9]/g, '');
    if (!numeric) return '';
    const formatted = new Intl.NumberFormat('id-ID').format(parseInt(numeric));
    return `Rp ${formatted}`;
  };

  const parseNumber = (val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    return parseInt(numeric) || 0;
  };

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
      if (mode === 'edit' && data) {
        setArea(data.area !== '-' ? data.area : 'Semua Area');
        setSalesName(data.sales);
        
        const expandJt = (val: string) => {
          if (!val || val === '-') return '';
          const num = val.replace(/[^0-9]/g, '');
          if (num) {
            return formatRupiah(num + '000000');
          }
          return '';
        };

        setDecorative(expandJt(data.decorative));
        setAutomotive(expandJt(data.automotive));
        setIndustri(expandJt(data.industri));
      } else {
        // Create mode: clear data and default to first sales option if available
        setTahun('2026');
        setBulan('Juli');
        setArea('Semua Area');
        setSalesName(salesList[0] || 'Semua Sales');
        setDecorative('');
        setAutomotive('');
        setIndustri('');
      }
      setShowConfirm(false);
      setShowSuccess(false);
    }
  }, [isOpen, mode, data, salesList]);

  // Calculate total automatically
  useEffect(() => {
    const dec = parseNumber(decorative);
    const auto = parseNumber(automotive);
    const ind = parseNumber(industri);
    const total = dec + auto + ind;
    
    if (total > 0) {
      setTotalTarget(`Rp ${new Intl.NumberFormat('id-ID').format(total)}`);
    } else {
      setTotalTarget('');
    }
  }, [decorative, automotive, industri]);

  const handleSimpanClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmSimpan = async () => {
    if (salesName === 'Semua Sales') {
      setErrorMessage('Pilih sales terlebih dahulu sebelum menyimpan target.');
      setShowConfirm(false);
      return;
    }

    setShowConfirm(false);
    setIsSaving(true);
    setErrorMessage('');

    try {
      const resultData = { ...(data || {}), area, sales: salesName, decorative, automotive, industri, totalTarget, tahun, bulan };
      if (onSave) {
        await onSave(resultData);
      }
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Failed to save target:', err);
      setErrorMessage('Gagal menyimpan target. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div 
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl w-[800px] p-8 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-red-500 border border-red-500 rounded-full p-1 hover:bg-red-50 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="mb-8 border-b border-slate-100 pb-4">
            <h3 className="text-slate-500 text-[13px] font-bold tracking-wider uppercase">
              {mode === 'create' ? 'Input Target Sales' : 'Edit Target Sales'}
            </h3>
          </div>

          {/* Top Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-1">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Tahun</label>
              <CustomSelect value={tahun} onChange={setTahun} options={['2026', '2025']} />
            </div>
            <div className="col-span-1">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Bulan</label>
              <CustomSelect value={bulan} onChange={setBulan} options={['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']} />
            </div>
            <div className="col-span-1">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Area</label>
              <CustomSelect value={area} onChange={setArea} options={['Semua Area', 'Kuningan', 'Bandung', 'Jakarta']} />
            </div>
            <div className="col-span-1">
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Sales</label>
              <CustomSelect value={salesName} onChange={setSalesName} options={salesList.length > 0 ? salesList : ['Semua Sales']} />
            </div>
          </div>

          {/* Target Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Decorative</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <PaintRoller size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type="text" 
                    value={decorative}
                    onChange={(e) => setDecorative(formatRupiah(e.target.value))}
                    placeholder="Rp 0"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Automotive</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Wrench size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type="text" 
                    value={automotive}
                    onChange={(e) => setAutomotive(formatRupiah(e.target.value))}
                    placeholder="Rp 0"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Industri</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Factory size={18} strokeWidth={2} />
                  </div>
                  <input 
                    type="text" 
                    value={industri}
                    onChange={(e) => setIndustri(formatRupiah(e.target.value))}
                    placeholder="Rp 0"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-medium focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 transition-all"
                  />
                </div>
              </div>

              {/* Total Target Card */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-sm h-[106px] flex flex-col justify-center relative overflow-hidden group">
                <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-1">Total Target</span>
                <span className="text-3xl font-extrabold text-gray-800 tracking-tight">{totalTarget || 'Rp 0'}</span>
              </div>
            </div>
            
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center pt-2 gap-3">
            {errorMessage && (
              <div className="text-sm text-red-600">{errorMessage}</div>
            )}
            <button 
              onClick={handleSimpanClick}
              disabled={isSaving}
              className="w-[160px] bg-[#52b788] hover:bg-[#40916c] disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Simpan Target
            </button>
          </div>
          
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-2xl w-[400px] p-8 shadow-xl relative text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Konfirmasi Simpan</h3>
            <p className="text-gray-600 mb-8">Apakah Anda ingin menyimpan data tersebut?</p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setShowConfirm(false)}
                className="w-[120px] bg-[#ef4444] hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors"
              >
                Tidak
              </button>
              <button 
                onClick={handleConfirmSimpan}
                className="w-[120px] bg-[#52b788] hover:bg-[#40916c] text-white py-2.5 rounded-xl font-medium transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Alert Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[1010] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-2xl w-[350px] p-8 shadow-xl relative text-center">
            <div className="w-16 h-16 bg-green-100 text-[#52b788] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
            <p className="text-gray-600">Data berhasil disimpan.</p>
          </div>
        </div>
      )}
    </>
  , document.body);
};
