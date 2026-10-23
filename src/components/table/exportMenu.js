import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileJson, Printer } from 'lucide-react';

export default function ExportMenu({
  data,
  columns,
  filenamePrefix = 'export',
  darkMode = false
}) {
  const [isOpen, setIsOpen] = useState(false);

  const buildFilename = (extension) =>
    `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.${extension}`;

  const triggerDownload = (href, filename) => {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsOpen(false);
  };

  const exportCSV = () => {
    const exportColumns = columns.filter((c) => c.key !== 'actions');
    const headers = exportColumns.map((c) => c.label);
    const keys = exportColumns.map((c) => c.key);
    const rows = data.map((item) =>
      keys.map((k) => {
        const val = item[k];
        return typeof val === 'string' ? `"${val}"` : val;
      })
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    triggerDownload(encodeURI(csvContent), buildFilename('csv'));
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    triggerDownload(dataStr, buildFilename('json'));
  };

  const handlePrint = () => {
    window.print();
    setIsOpen(false);
  };

  const itemClass = `w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
    darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
  }`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`py-1.5 px-3 rounded-xl border flex items-center space-x-1 text-xs font-medium transition-all ${
          darkMode
            ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
        }`}
      >
        <Download className="w-3.5 h-3.5 text-emerald-500" />
        <span className="hidden sm:inline">Export</span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1.5 w-44 rounded-xl border shadow-xl z-30 p-1.5 space-y-1 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <button onClick={exportCSV} className={itemClass}>
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export CSV</span>
          </button>
          <button onClick={exportJSON} className={itemClass}>
            <FileJson className="w-3.5 h-3.5 text-amber-500" />
            <span>Export JSON</span>
          </button>
          <button onClick={handlePrint} className={itemClass}>
            <Printer className="w-3.5 h-3.5 text-blue-500" />
            <span>Print Document</span>
          </button>
        </div>
      )}
    </div>
  );
}