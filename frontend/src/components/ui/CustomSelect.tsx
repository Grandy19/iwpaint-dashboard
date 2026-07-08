import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({ 
  value, 
  onChange, 
  options,
  placeholder = 'Pilih salah satu...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option => 
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    setSearchTerm('');
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger Button */}
      <div 
        className="flex items-center justify-between w-full bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 cursor-pointer focus-within:ring-2 focus-within:ring-[#3b0764]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{value || placeholder}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-lg max-h-72 flex flex-col overflow-hidden">
          
          {/* Search Bar */}
          <div className="p-2 border-b border-gray-100 shrink-0 sticky top-0 bg-white">
            <div className="relative flex items-center">
              <Search size={14} className="absolute left-3 text-gray-400" />
              <input 
                type="text"
                className="w-full bg-gray-50 border-none rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#3b0764] text-gray-700 placeholder-gray-400"
                placeholder="Cari..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} // prevent closing when typing
                autoFocus
              />
            </div>
          </div>

          {/* Options List */}
          <div className="overflow-y-auto">
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
                Tidak ada hasil ditemukan
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
