import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import clsx from 'clsx';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  showSearch?: boolean;
  icon?: ReactNode;
  triggerClassName?: string;
  dropdownPosition?: 'top' | 'bottom';
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onChange, 
  options,
  placeholder = 'Pilih salah satu...',
  showSearch = true,
  icon,
  triggerClassName,
  dropdownPosition = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchQuery('');
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setSearchQuery('');
    }
  };

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const defaultTriggerClass = "flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 cursor-pointer focus-within:ring-2 focus-within:ring-[#3b0764]";
  const combinedTriggerClass = triggerClassName || defaultTriggerClass;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        className={combinedTriggerClass}
        onClick={toggleOpen}
      >
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={clsx(
          "absolute z-50 w-full bg-white border border-gray-100 rounded-lg shadow-lg flex flex-col overflow-hidden",
          dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
        )}>
          
          {/* Search Bar */}
          {showSearch && (
            <div className="p-2 border-b border-gray-100 shrink-0">
              <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={14} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#3b0764] focus:border-[#3b0764]"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          )}

          {/* Options List */}
          <div className="overflow-y-auto max-h-60">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div 
                  key={index}
                  className={`px-4 py-2.5 text-sm cursor-pointer flex items-center justify-between hover:bg-[#f3e8ff] transition-colors ${value === option ? 'text-[#3b0764] font-medium bg-[#fcf8ff]' : 'text-gray-700'}`}
                  onClick={() => handleSelect(option)}
                >
                  <span className="truncate">{option}</span>
                  {value === option && <Check size={14} className="text-[#3b0764]" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                Tidak ada opsi tersedia
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
