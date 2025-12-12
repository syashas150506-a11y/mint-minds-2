import React, { useState, useRef, useEffect } from 'react';
import { CountryData } from '../../types';
import { COUNTRIES } from '../../constants';
import { Search, ChevronDown, Check } from 'lucide-react';

interface CountrySelectorProps {
  selected: CountryData;
  onSelect: (country: CountryData) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Focus search input when opening
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.dial_code.includes(searchTerm) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-1/3" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-[46px] flex items-center justify-between bg-white border border-slate-300 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-teal-500 p-2.5 hover:bg-slate-50 transition-colors shadow-sm"
      >
        <span className="flex items-center gap-2 truncate">
          <span className="text-lg">{selected.flag}</span>
          <span className="font-medium">{selected.dial_code}</span>
        </span>
        <ChevronDown size={14} className="text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-[300px] bg-white border border-slate-200 rounded-xl shadow-xl max-h-[300px] flex flex-col ring-1 ring-black/5">
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white rounded-t-xl">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search country..."
                className="w-full bg-slate-50 text-slate-900 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-teal-500 border border-slate-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-300">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onSelect(country);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors ${selected.code === country.code ? 'bg-teal-50 text-teal-700' : 'text-slate-700'}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <span className="truncate max-w-[150px] font-medium">{country.name}</span>
                    <span className="text-slate-400 text-xs">({country.dial_code})</span>
                  </span>
                  {selected.code === country.code && <Check size={14} className="text-teal-600" />}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-slate-400 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};