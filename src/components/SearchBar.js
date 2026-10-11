import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  darkMode = false,
  className = 'flex-1'
}) {
  return (
    <div className={`relative ${className}`}>
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 ${
          darkMode ? 'text-slate-500' : 'text-slate-400'
        }`}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full pl-9 pr-8 py-1.5 rounded-xl text-xs border outline-none transition-all leading-normal ${
          darkMode
            ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 text-slate-100 placeholder-slate-500'
            : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 placeholder-slate-400'
        }`}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 text-xs rounded-full p-0.5 ${
            darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
          }`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}