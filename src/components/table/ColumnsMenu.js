import React, { useState, useRef, useLayoutEffect } from 'react';
import { Eye } from 'lucide-react';

const COLUMN_MENU_WIDTH = 192;

export default function ColumnsMenu({
  columns,
  visibility,
  onVisibilityChange,
  darkMode = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [align, setAlign] = useState('right');
  const buttonRef = useRef(null);

  // Flip the menu to the left edge if opening to the right would clip off-screen.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const button = buttonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setAlign(rect.right - COLUMN_MENU_WIDTH < 0 ? 'left' : 'right');
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`py-1.5 px-3 rounded-xl border flex items-center space-x-1 text-xs font-medium transition-all ${
          darkMode
            ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
        }`}
      >
        <Eye className="w-3.5 h-3.5 text-indigo-500" />
        <span className="hidden sm:inline">Columns</span>
      </button>

      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-48 rounded-xl border shadow-xl z-30 p-2 space-y-1 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <p className="text-xs font-semibold px-2 py-1 text-slate-400">Toggle Column Visibility</p>
          <div className={`my-1 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
          {columns.map((col) => (
            <label
              key={col.key}
              className={`flex items-center space-x-2 px-2 py-1 rounded-lg text-xs cursor-pointer ${
                darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
              }`}
            >
              <input
                type="checkbox"
                checked={visibility[col.key] ?? true}
                onChange={(e) => onVisibilityChange(col.key, e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>{col.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}