import React, { useState, useEffect } from 'react';
import { PaintRoller, Wrench, Factory, X, Save, CheckCircle2 } from 'lucide-react';
import { CustomSelect } from './CustomSelect';

interface TargetSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  data?: any; // The selected row data if edit mode
  onSave: (data: any) => void;
}

export const TargetSalesModal: React.FC<TargetSalesModalProps> = ({ isOpen, onClose, mode, data, onSave }) => {
  const [tahun, setTahun] = useState('2026');
  const [bulan, setBulan] = useState('Juli');
  const [area, setArea] = useState('Semua Area');
  const [salesName, setSalesName] = useState('Semua Sales');

  const [decorative, setDecorative] = useState('');
  const [automotive, setAutomotive] = useState('');
  const [industri, setIndustri] = useState('');
  const [totalTarget, setTotalTarget] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
        // Create mode: clear data
        setTahun('2026');
        setBulan('Juli');
        setArea('Semua Area');
        setSalesName('Semua Sales');
        setDecorative('');
        setAutomotive('');
        setIndustri('');
      }
      setShowConfirm(false);
      setShowSuccess(false);
    }
  }, [isOpen, mode, data]);

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

  const handleConfirmSimpan = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      const resultData = { ...data, area, sales: salesName, decorative, automotive, industri, totalTarget };
      if (onSave) {
        onSave(resultData);
      }
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]"
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
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-900">
              {mode === 'create' ? 'Input Target Sales' : 'Edit Target Sales'}
            </h3>
          </div>

          {/* Top Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Tahun</label>
              <CustomSelect value={tahun} onChange={setTahun} options={['2026', '2025']} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Bulan</label>
              <CustomSelect value={bulan} onChange={setBulan} options={['Juli', 'Agustus']} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <CustomSelect value={area} onChange={setArea} options={['Semua Area', 'Kuningan', 'Bandung', 'Jakarta']} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm text-[#475569] font-medium mb-2">Sales</label>
              <CustomSelect value={salesName} onChange={setSalesName} options={['Semua Sales', 'Santoso', 'Heri', 'Fransiskus', 'Rudi', 'Budi']} />
            </div>
          </div>

          {/* Target Inputs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Decorative</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <PaintRoller size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={decorative}
                    onChange={(e) => setDecorative(formatRupiah(e.target.value))}
                    placeholder="Rp 0"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Automotive</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Wrench size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={automotive}
                    onChange={(e) => setAutomotive(formatRupiah(e.target.value))}
                    placeholder="Rp 0"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm text-[#475569] font-medium mb-2">Industri</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <Factory size={18} />
                  </div>
                  <input 
                    type="text" 
                    value={industri}
                    onChange={(e) => setIndustri(formatRupiah(e.target.value))}
                    placeholder="Rp 0"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-[#3b0764] focus:ring-1 focus:ring-[#3b0764] transition-colors"
                  />
                </div>
              </div>

              {/* Total Target Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm h-[106px] flex flex-col justify-center">
                <span className="text-sm text-gray-500 font-medium mb-1">Total Target</span>
                <span className="text-2xl font-bold text-gray-800">{totalTarget || 'Rp 0'}</span>
              </div>
            </div>
            
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center pt-2">
            <button 
              onClick={handleSimpanClick}
              className="w-[200px] bg-[#52b788] hover:bg-[#40916c] text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Simpan
            </button>
          </div>
          
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-[1px]" onClick={() => setShowConfirm(false)}>
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
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
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
  );
};
