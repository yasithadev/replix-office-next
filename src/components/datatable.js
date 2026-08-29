import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  SlidersHorizontal,
  Eye,
  Edit3,
  Trash2,
  Download,
  FileSpreadsheet,
  FileJson,
  Printer,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X
} from 'lucide-react';

const getDensityClass = (density) => {
  switch (density) {
    case 'compact':
      return 'py-2 px-3 text-xs';
    case 'spacious':
      return 'py-4 px-5 text-sm';
    default:
      return 'py-3.5 px-4 text-sm';
  }
};

// Builds a bounded list of page numbers with ellipsis markers so the
// pager never grows past a fixed width, no matter how many pages exist.
// e.g. for current=7, total=20, siblingCount=1 -> [1, '…', 6,7,8, '…', 20]
function getPaginationRange(current, total, siblingCount = 1) {
  const totalSlots = siblingCount * 2 + 5; // first + last + current + siblings*2 + 2 ellipses

  if (total <= totalSlots) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblingCount, 1);
  const rightSibling = Math.min(current + siblingCount, total);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftCount = 3 + siblingCount * 2;
    const leftRange = Array.from({ length: leftCount }, (_, i) => i + 1);
    return [...leftRange, 'right-ellipsis', total];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + siblingCount * 2;
    const rightRange = Array.from({ length: rightCount }, (_, i) => total - rightCount + i + 1);
    return [1, 'left-ellipsis', ...rightRange];
  }

  const middleRange = Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i);
  return [1, 'left-ellipsis', ...middleRange, 'right-ellipsis', total];
}

/**
 * DataTable
 * Fully self-contained and data-shape agnostic: owns search, sorting,
 * density, column visibility, export (CSV/JSON/print), row selection +
 * bulk delete, and pagination. The parent only supplies the raw dataset,
 * column config, and callbacks for row-level actions and bulk delete —
 * no field-specific filter dropdowns are baked in, since valid filter
 * values are always data-specific. If a consumer needs faceted filtering
 * (e.g. by department/status), that's built in the parent by filtering
 * `data` before it's passed in.
 *
 * Props:
 *  - data: raw array of records (full, unfiltered)
 *  - columns: [{ key, label, sortable }] — also drives the Columns menu
 *  - rowKey: field used as each row's unique id (default 'id')
 *  - searchKeys: fields the search box matches against (default: all
 *    non-'actions' column keys)
 *  - darkMode: theme flag, controlled by the parent
 *  - onView / onEdit / onDelete: (row) => void — row action callbacks
 *  - onBulkDelete: (ids: Array) => void — called with selected row ids;
 *    parent is responsible for actually removing them from `data`
 *  - exportFilenamePrefix: filename prefix for CSV/JSON export
 *  - defaultPageSize / defaultSort: initial pagination + sort state
 */
export default function DataTable({
  data,
  columns,
  rowKey = 'id',
  searchKeys,
  darkMode = false,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  exportFilenamePrefix = 'export',
  defaultPageSize = 10,
  defaultSort = { key: columns?.[0]?.key ?? null, direction: 'asc' }
}) {
  const effectiveSearchKeys = useMemo(
    () => searchKeys || columns.filter((c) => c.key !== 'actions').map((c) => c.key),
    [searchKeys, columns]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [density, setDensity] = useState('compact'); // 'compact' | 'normal' | 'spacious'
  const [columnVisibility, setColumnVisibility] = useState(() =>
    Object.fromEntries(columns.map((c) => [c.key, true]))
  );
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  const densityClass = getDensityClass(density);

  const filteredAndSortedData = useMemo(() => {
    return data
      .filter((item) => {
        const matchesSearch =
          searchQuery === '' ||
          effectiveSearchKeys.some((key) =>
            String(item[key] ?? '').toLowerCase().includes(searchQuery.toLowerCase())
          );

        return matchesSearch;
      })
      .sort((a, b) => {
        if (!sortConfig.key) return 0;
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [data, searchQuery, sortConfig, effectiveSearchKeys]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages, 1),
    [currentPage, totalPages]
  );

  // Adjust page if search/filter shrinks total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === 'asc') return { key, direction: 'desc' };
        return { key: null, direction: 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(paginatedData.map((d) => d[rowKey])));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDeleteClick = () => {
    onBulkDelete?.(Array.from(selectedRows));
    setSelectedRows(new Set());
  };

  const exportCSV = () => {
    const headers = columns.filter((c) => c.key !== 'actions').map((c) => c.label);
    const keys = columns.filter((c) => c.key !== 'actions').map((c) => c.key);
    const rows = filteredAndSortedData.map((item) =>
      keys.map((k) => {
        const val = item[k];
        return typeof val === 'string' ? `"${val}"` : val;
      })
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${exportFilenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  const exportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredAndSortedData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `${exportFilenamePrefix}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportMenuOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar: search, density, columns, export */}
      <div className={`p-4 rounded-2xl border space-y-4 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Global Search Input */}
          <div className="relative flex-1">
            <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm border outline-none transition-all ${
                darkMode
                  ? 'bg-slate-950 border-slate-800 focus:border-indigo-500 text-slate-100 placeholder-slate-500'
                  : 'bg-slate-50 border-slate-200 focus:border-indigo-500 text-slate-900 placeholder-slate-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs rounded-full p-1 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Density Toggle */}
            <button
              onClick={() => {
                const modes = ['compact', 'normal', 'spacious'];
                const nextIndex = (modes.indexOf(density) + 1) % modes.length;
                setDensity(modes[nextIndex]);
              }}
              className={`p-2.5 rounded-xl border flex items-center space-x-1.5 text-xs font-medium transition-all ${
                darkMode
                  ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
              }`}
              title="Table Density"
            >
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
              <span className="capitalize hidden sm:inline">{density}</span>
            </button>

            {/* Columns Visibility Menu */}
            <div className="relative">
              <button
                onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                className={`p-2.5 rounded-xl border flex items-center space-x-1.5 text-xs font-medium transition-all ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Eye className="w-4 h-4 text-indigo-500" />
                <span className="hidden sm:inline">Columns</span>
              </button>

              {isColumnMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-xl z-30 p-2 space-y-1 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <p className="text-xs font-semibold px-2 py-1 text-slate-400">Toggle Column Visibility</p>
                  <div className="my-1 border-t border-slate-200 dark:border-slate-800"></div>
                  {columns.map((col) => (
                    <label
                      key={col.key}
                      className={`flex items-center space-x-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer ${
                        darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={columnVisibility[col.key]}
                        onChange={(e) =>
                          setColumnVisibility((prev) => ({ ...prev, [col.key]: e.target.checked }))
                        }
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span>{col.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                className={`p-2.5 rounded-xl border flex items-center space-x-1.5 text-xs font-medium transition-all ${
                  darkMode
                    ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <Download className="w-4 h-4 text-emerald-500" />
                <span className="hidden sm:inline">Export</span>
              </button>

              {isExportMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-44 rounded-xl border shadow-xl z-30 p-1.5 space-y-1 ${
                    darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                  }`}
                >
                  <button
                    onClick={exportCSV}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span>Export CSV</span>
                  </button>
                  <button
                    onClick={exportJSON}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <FileJson className="w-4 h-4 text-amber-500" />
                    <span>Export JSON</span>
                  </button>
                  <button
                    onClick={() => {
                      window.print();
                      setIsExportMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs transition-colors ${
                      darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Printer className="w-4 h-4 text-blue-500" />
                    <span>Print Document</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bulk selection bar */}
        {selectedRows.size > 0 && (
          <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-4 py-2 text-xs font-medium">
            <span className="text-indigo-600 dark:text-indigo-400">
              {selectedRows.size} {selectedRows.size === 1 ? 'record' : 'records'} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkDeleteClick}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected</span>
              </button>
              <button
                onClick={() => setSelectedRows(new Set())}
                className={`px-2.5 py-1.5 rounded-lg border transition-colors ${
                  darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table + pagination */}
      <div
        className={`rounded-2xl border overflow-hidden shadow-sm transition-colors ${
          darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead
              className={`${
                darkMode
                  ? 'bg-slate-900 border-b border-slate-800 text-slate-400'
                  : 'bg-slate-100/70 border-b border-slate-200 text-slate-600'
              } text-xs uppercase tracking-wider font-semibold`}
            >
              <tr>
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={paginatedData.length > 0 && paginatedData.every((d) => selectedRows.has(d[rowKey]))}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                {columns.map(
                  (col) =>
                    columnVisibility[col.key] && (
                      <th
                        key={col.key}
                        onClick={() => col.sortable && handleSort(col.key)}
                        className={`py-3.5 px-4 ${
                          col.sortable ? 'cursor-pointer select-none hover:text-indigo-500 transition-colors' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-1.5">
                          <span>{col.label}</span>
                          {col.sortable && (
                            <span className="text-slate-400">
                              {sortConfig.key === col.key ? (
                                sortConfig.direction === 'asc' ? (
                                  <ChevronUp className="w-3.5 h-3.5 text-indigo-600" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5 text-indigo-600" />
                                )
                              ) : (
                                <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    )
                )}
              </tr>
            </thead>

            <tbody className={`divide-y ${darkMode ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <AlertCircle className="w-8 h-8 text-slate-400 stroke-[1.5]" />
                      <p className="text-base font-medium">No records found matching criteria</p>
                      <p className="text-xs text-slate-500">Try adjusting your search term</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const isSelected = selectedRows.has(row[rowKey]);
                  return (
                    <tr
                      key={row[rowKey]}
                      className={`transition-colors hover:bg-indigo-500/5 ${
                        isSelected ? (darkMode ? 'bg-indigo-950/20' : 'bg-indigo-50/60') : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(row[rowKey])}
                          className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      {columnVisibility.id && (
                        <td className={`${densityClass} font-mono font-medium text-xs text-indigo-500`}>{row.id}</td>
                      )}

                      {columnVisibility.name && (
                        <td className={densityClass}>
                          <div className="flex items-center space-x-3">
                            <img
                              src={row.avatar}
                              alt={row.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                            />
                            <div>
                              <p className="font-semibold text-xs sm:text-sm leading-snug">{row.name}</p>
                              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.email}</p>
                            </div>
                          </div>
                        </td>
                      )}

                      {columnVisibility.role && (
                        <td className={densityClass}>
                          <span className="font-medium">{row.role}</span>
                        </td>
                      )}

                      {columnVisibility.department && (
                        <td className={densityClass}>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {row.department}
                          </span>
                        </td>
                      )}

                      {columnVisibility.status && (
                        <td className={densityClass}>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              row.status === 'Active'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : row.status === 'Pending'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : row.status === 'Inactive'
                                ? 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                                : 'bg-red-500/10 text-red-600 border border-red-500/20'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                row.status === 'Active'
                                  ? 'bg-emerald-500'
                                  : row.status === 'Pending'
                                  ? 'bg-amber-500'
                                  : row.status === 'Inactive'
                                  ? 'bg-slate-400'
                                  : 'bg-red-500'
                              }`}
                            />
                            {row.status}
                          </span>
                        </td>
                      )}

                      {columnVisibility.salary && (
                        <td className={`${densityClass} font-mono font-medium`}>${row.salary.toLocaleString()}</td>
                      )}

                      {columnVisibility.performance && (
                        <td className={densityClass}>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  row.performance >= 90
                                    ? 'bg-emerald-500'
                                    : row.performance >= 75
                                    ? 'bg-indigo-500'
                                    : 'bg-amber-500'
                                }`}
                                style={{ width: `${row.performance}%` }}
                              />
                            </div>
                            <span className="text-xs font-mono font-medium">{row.performance}%</span>
                          </div>
                        </td>
                      )}

                      {columnVisibility.joinDate && (
                        <td className={`${densityClass} text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          {row.joinDate}
                        </td>
                      )}

                      {columnVisibility.actions && (
                        <td className={densityClass}>
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => onView?.(row)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                darkMode
                                  ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                              }`}
                              title="View Record"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onEdit?.(row)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                darkMode
                                  ? 'hover:bg-slate-800 text-slate-400 hover:text-indigo-400'
                                  : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-600'
                              }`}
                              title="Edit Record"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDelete?.(row)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                darkMode
                                  ? 'hover:bg-slate-800 text-slate-400 hover:text-red-400'
                                  : 'hover:bg-slate-100 text-slate-500 hover:text-red-600'
                              }`}
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer: page size + pagination */}
        <div
          className={`px-4 py-3.5 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50/50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Showing{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {filteredAndSortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {Math.min(currentPage * pageSize, filteredAndSortedData.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-900 dark:text-slate-100">{filteredAndSortedData.length}</span> results
            </span>

            <div className="flex items-center space-x-1.5">
              <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className={`px-2 py-1 text-xs rounded-lg border outline-none cursor-pointer ${
                  darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                {[5, 10, 20, 50].map((sz) => (
                  <option key={sz} value={sz}>
                    {sz}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center space-x-1 px-1">
              {paginationRange.map((pageNum, idx) =>
                typeof pageNum === 'number' ? (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white font-bold'
                        : darkMode
                        ? 'hover:bg-slate-800 text-slate-400'
                        : 'hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                ) : (
                  <span
                    key={`${pageNum}-${idx}`}
                    className={`w-7 h-7 flex items-center justify-center text-xs select-none ${
                      darkMode ? 'text-slate-600' : 'text-slate-400'
                    }`}
                  >
                    …
                  </span>
                )
              )}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className={`p-1.5 rounded-lg border text-xs flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}