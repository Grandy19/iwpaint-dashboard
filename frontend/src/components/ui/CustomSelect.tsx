import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

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
          
          {/* Options List */}
          <div className="overflow-y-auto">
            {options.length > 0 ? (
              options.map((option, index) => (
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
