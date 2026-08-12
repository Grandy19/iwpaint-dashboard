import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export const ViewProfileModal: React.FC<ViewProfileModalProps> = ({ isOpen, onClose, user }) => {
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

  // DUMMY DATA FOR FRONTEND PURPOSES
  const dummyUser = {
    name: 'Budi Santoso',
    email: 'budi.santoso@iwpaint.com',
    phone: '0812-3456-7890',
    alamat: 'Jl. Jendral Sudirman No. 123, Jakarta',
    area: 'Jakarta Raya',
    roleDisplay: user?.role === 'admin' ? 'Administrator' : 
                 user?.role === 'distributor' ? 'Kepala Distributor' : 
                 user?.role === 'supervisor' ? 'Supervisor' : 'Sales'
  };

  const modalContent = (
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
            Informasi Pengguna
          </h3>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10">
          {/* Left: Photo */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center">
            <div className="w-[200px] h-[200px] border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50 flex items-center justify-center">
              <img 
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(dummyUser.name)}&background=10b981&color=fff&size=256`} 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Info List */}
          <div className="flex-1 flex flex-col justify-center space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-gray-100 pb-2">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[120px] flex-shrink-0">Nama</span>
              <span className="text-[14px] text-gray-800">{dummyUser.name}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-gray-100 pb-2">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[120px] flex-shrink-0">Role / Posisi</span>
              <span className="text-[14px] text-gray-800">{dummyUser.roleDisplay}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-gray-100 pb-2">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[120px] flex-shrink-0">Area</span>
              <span className="text-[14px] text-gray-800">{dummyUser.area}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-gray-100 pb-2">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[120px] flex-shrink-0">Email</span>
              <span className="text-[14px] text-gray-800">{dummyUser.email}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 border-b border-gray-100 pb-2">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[120px] flex-shrink-0">No. HP</span>
              <span className="text-[14px] text-gray-800">{dummyUser.phone}</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-[11px] uppercase tracking-widest text-slate-500 font-bold w-[120px] flex-shrink-0">Alamat</span>
              <span className="text-[14px] text-gray-800">{dummyUser.alamat}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
