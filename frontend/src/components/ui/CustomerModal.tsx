import React from 'react';
import { X, User, Users, Receipt, Package, Map, MapPin, Wallet, CalendarClock } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  // Fallback data for fields not in the table
  const alamat = data?.alamat || 'Jl. Moh Toha No.18';
  const totalQty = data?.totalQty || '230 Kg';
  const transaksiTerakhir = data?.transaksiTerakhir || '13 Juli 2026';
  const totalTransaksiLabel = data?.totalTransaksi ? `${data.totalTransaksi} Transaksi` : '';

  return (
    <>
      {/* Main Modal */}
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
              Informasi Customer
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
            
            {/* Kolom Kiri */}
            {/* Nama Customer */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Nama Customer</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  value={data?.namaCustomer || ''}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Area (Kolom Kanan) */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Area</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Map size={18} />
                </div>
                <input 
                  type="text" 
                  value={data?.area || ''}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Sales yang Menangani */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Sales yang Menangani</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Users size={18} />
                </div>
                <input 
                  type="text" 
                  value={data?.sales || ''}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Alamat</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <MapPin size={18} />
                </div>
                <input 
                  type="text" 
                  value={alamat}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Total Transaksi */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Total Transaksi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Receipt size={18} />
                </div>
                <input 
                  type="text" 
                  value={totalTransaksiLabel}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Total Penjualan */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Total Penjualan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Wallet size={18} />
                </div>
                <input 
                  type="text" 
                  value={data?.totalPenjualan || ''}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Total QTY */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Total QTY</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Package size={18} />
                </div>
                <input 
                  type="text" 
                  value={totalQty}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Transaksi Terakhir */}
            <div>
              <label className="block text-sm text-[#475569] font-medium mb-2">Transaksi Terakhir</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <CalendarClock size={18} />
                </div>
                <input 
                  type="text" 
                  value={transaksiTerakhir}
                  readOnly
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
