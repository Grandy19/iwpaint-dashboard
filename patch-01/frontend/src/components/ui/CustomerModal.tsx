import React, { useState , useEffect} from 'react';
import ReactDOM from 'react-dom';
import { X, User, Users, Receipt, Package, Map, MapPin, Banknote, CalendarClock, Trash2, CheckCircle2 } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, data }) => {
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

  if (!isOpen) return null;

  // Fallback data for fields not in the table
  const alamat = data?.alamat || 'Jl. Moh Toha No.18';
  const totalQty = data?.totalQty || '230 Kg';
  const transaksiTerakhir = data?.transaksiTerakhir || '13 Juli 2026';
  const totalTransaksiLabel = data?.totalTransaksi ? `${data.totalTransaksi} Transaksi` : '';

  return ReactDOM.createPortal(
    <>
      {/* Main Modal */}
      <div 
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[1px] p-4 sm:p-6 md:p-8"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl w-[800px] max-h-[95vh] overflow-y-auto hide-scrollbar p-8 shadow-xl relative"
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
              Informasi Customer
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
            
            {/* Kolom Kiri */}
            {/* Nama Customer */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Nama Customer</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  value={data?.namaCustomer || ''}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Area (Kolom Kanan) */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Area</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Map size={16} />
                </div>
                <input 
                  type="text" 
                  value={data?.area || ''}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Sales yang Menangani */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Sales yang Menangani</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Users size={16} />
                </div>
                <input 
                  type="text" 
                  value={data?.sales || ''}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Alamat</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={16} />
                </div>
                <input 
                  type="text" 
                  value={alamat}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Total Transaksi */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Total Transaksi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Receipt size={16} />
                </div>
                <input 
                  type="text" 
                  value={totalTransaksiLabel}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Total Penjualan */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Total Penjualan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Banknote size={16} />
                </div>
                <input 
                  type="text" 
                  value={data?.totalPenjualan || ''}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Total QTY */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Total QTY</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Package size={16} />
                </div>
                <input 
                  type="text" 
                  value={totalQty}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Transaksi Terakhir */}
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-slate-500 font-bold mb-2">Transaksi Terakhir</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <CalendarClock size={16} />
                </div>
                <input 
                  type="text" 
                  value={transaksiTerakhir}
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  , document.body);
};
