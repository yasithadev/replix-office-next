import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
import {
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
  AlertCircle
} from 'lucide-react';
import Pagination from '../Pagination';
import SearchBar from '../SearchBar';

const getDensityClass = (density) => {
  if (density === 'spacious') {
    return 'py-2.5 px-4 text-sm leading-normal';
  }
  return 'py-1 px-3 text-xs leading-tight';
};

const CHECKBOX_COL_WIDTH = 44;
const DEFAULT_COLUMN_WIDTH = 160;

export default function DataTable({
  data = [],
  columns = [],
  rowKey = 'id',
  searchKeys,
  darkMode = false,
  selectable = true,
  showActionColumn, // Explicit override: true | false
  showViewAction = true,
  showEditAction = true,
  showDeleteAction = true,
  canView = true,   // Boolean toggle across all records
  canEdit = true,   // Boolean toggle across all records
  canDelete = true, // Boolean toggle across all records
  actionColumnLabel = 'Actions',
  actionColumnWidth = 120,
  defaultPinnedColumns = [],
  defaultPinnedRightColumns = [],
  showDensityToggle = true,
  showColumnsMenu = true,
  showExportMenu = true,
  onView,
  onEdit,
  onDelete,
  onBulkDelete,
  exportFilenamePrefix = 'export',
  defaultPageSize = 10,
  defaultSort
}) {
  // Simple boolean check for each action's availability
  const isViewActive = Boolean(onView && showViewAction && canView);
  const isEditActive = Boolean(onEdit && showEditAction && canEdit);
  const isDeleteActive = Boolean(onDelete && showDeleteAction && canDelete);

  // Actions column visibility check
  const isActionColumnVisible = useMemo(() => {
    if (typeof showActionColumn === 'boolean') {
      return showActionColumn;
    }
    return isViewActive || isEditActive || isDeleteActive;
  }, [showActionColumn, isViewActive, isEditActive, isDeleteActive]);

  // Dynamically attach the 'actions' column if enabled, while stripping any manual 'actions' definitions in prop columns
  const activeColumns = useMemo(() => {
    const userColumns = columns.filter((col) => col.key !== 'actions');
    if (isActionColumnVisible) {
      return [
        ...userColumns,
        {
          key: 'actions',
          label: actionColumnLabel,
          sortable: false,
          width: actionColumnWidth
        }
      ];
    }
    return userColumns;
  }, [columns, isActionColumnVisible, actionColumnLabel, actionColumnWidth]);

  const effectiveSearchKeys = useMemo(
    () => searchKeys || activeColumns.filter((c) => c.key !== 'actions').map((c) => c.key),
    [searchKeys, activeColumns]
  );

  const initialSort = useMemo(
    () => defaultSort || { key: activeColumns?.[0]?.key ?? null, direction: 'asc' },
    [defaultSort, activeColumns]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState(initialSort);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [activeRowId, setActiveRowId] = useState(null);
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [density, setDensity] = useState('compact');
  const [columnVisibility, setColumnVisibility] = useState(() =>
    Object.fromEntries(activeColumns.map((c) => [c.key, true]))
  );
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [columnMenuAlign, setColumnMenuAlign] = useState('right');
  const columnMenuButtonRef = useRef(null);
  const COLUMN_MENU_WIDTH = 192;

  useLayoutEffect(() => {
    if (!isColumnMenuOpen) return;
    const button = columnMenuButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setColumnMenuAlign(rect.right - COLUMN_MENU_WIDTH < 0 ? 'left' : 'right');
  }, [isColumnMenuOpen]);

  const densityClass = getDensityClass(density);

  const pinnedColumns = defaultPinnedColumns;
  const pinnedRightColumns = defaultPinnedRightColumns;

  const columnByKey = useMemo(() => Object.fromEntries(activeColumns.map((c) => [c.key, c])), [activeColumns]);

  const stickyHeaderRefs = useRef({});
  const [measuredWidths, setMeasuredWidths] = useState({});

  const resizeObserverRef = useRef(null);
  if (resizeObserverRef.current === null && typeof ResizeObserver !== 'undefined') {
    resizeObserverRef.current = new ResizeObserver((entries) => {
      setMeasuredWidths((prev) => {
        let changed = false;
        const next = { ...prev };
        entries.forEach((entry) => {
          const key = entry.target.dataset.stickyKey;
          if (!key) return;
          const width = entry.target.offsetWidth;
          if (next[key] !== width) {
            next[key] = width;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    });
  }

  useEffect(() => {
    return () => resizeObserverRef.current?.disconnect();
  }, []);

  useLayoutEffect(() => {
    const next = {};
    Object.entries(stickyHeaderRefs.current).forEach(([key, node]) => {
      if (node) next[key] = node.offsetWidth;
    });
    setMeasuredWidths((prev) => {
      const keys = Object.keys(next);
      const changed =
        keys.length !== Object.keys(prev).length || keys.some((k) => prev[k] !== next[k]);
      return changed ? next : prev;
    });
  });

  const widthFor = (key) =>
    measuredWidths[key] ?? (key === '__select__' ? CHECKBOX_COL_WIDTH : columnByKey[key]?.width ?? DEFAULT_COLUMN_WIDTH);

  const leftStickyOffsets = useMemo(() => {
    const offsets = {};
    let cursor = 0;
    if (selectable) {
      offsets.__select__ = cursor;
      cursor += widthFor('__select__');
    }
    activeColumns.forEach((col) => {
      if (columnVisibility[col.key] && pinnedColumns.includes(col.key)) {
        offsets[col.key] = cursor;
        cursor += widthFor(col.key);
      }
    });
    return offsets;
  }, [activeColumns, columnVisibility, pinnedColumns, selectable, measuredWidths]);

  const rightStickyOffsets = useMemo(() => {
    const offsets = {};
    let cursor = 0;
    for (let i = activeColumns.length - 1; i >= 0; i--) {
      const col = activeColumns[i];
      if (columnVisibility[col.key] && pinnedRightColumns.includes(col.key)) {
        offsets[col.key] = cursor;
        cursor += widthFor(col.key);
      }
    }
    return offsets;
  }, [activeColumns, columnVisibility, pinnedRightColumns, measuredWidths]);

  const lastLeftStickyKey = useMemo(() => {
    const keys = Object.keys(leftStickyOffsets);
    if (keys.length === 0) return null;
    return keys.reduce((a, b) => (leftStickyOffsets[a] > leftStickyOffsets[b] ? a : b));
  }, [leftStickyOffsets]);

  const firstRightStickyKey = useMemo(() => {
    const keys = Object.keys(rightStickyOffsets);
    if (keys.length === 0) return null;
    return keys.reduce((a, b) => (rightStickyOffsets[a] > rightStickyOffsets[b] ? a : b));
  }, [rightStickyOffsets]);

  const firstVisibleColKey = useMemo(() => {
    if (selectable) return '__select__';
    const firstCol = activeColumns.find((c) => columnVisibility[c.key]);
    return firstCol ? firstCol.key : null;
  }, [selectable, activeColumns, columnVisibility]);

  const stickyRef = (key) => (node) => {
    const prevNode = stickyHeaderRefs.current[key];
    if (prevNode && resizeObserverRef.current) {
      resizeObserverRef.current.unobserve(prevNode);
    }
    stickyHeaderRefs.current[key] = node;
    if (node) {
      node.dataset.stickyKey = key;
      resizeObserverRef.current?.observe(node);
    }
  };

  const getStickyProps = (key) => {
    if (key in leftStickyOffsets) {
      return {
        style: { position: 'sticky', left: `${leftStickyOffsets[key]}px`, zIndex: key === '__select__' ? 22 : 21 },
        className: key === lastLeftStickyKey ? 'shadow-[4px_0_6px_-4px_rgba(0,0,0,0.25)]' : ''
      };
    }
    if (key in rightStickyOffsets) {
      return {
        style: { position: 'sticky', right: `${rightStickyOffsets[key]}px`, zIndex: 21 },
        className: key === firstRightStickyKey ? 'shadow-[-4px_0_6px_-4px_rgba(0,0,0,0.25)]' : ''
      };
    }
    return { style: undefined, className: '' };
  };

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
    const headers = activeColumns.filter((c) => c.key !== 'actions').map((c) => c.label);
    const keys = activeColumns.filter((c) => c.key !== 'actions').map((c) => c.key);
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
    <div className="space-y-3">
      {/* Toolbar */}
      <div className={`p-3 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            darkMode={darkMode}
          />

          {(showDensityToggle || showColumnsMenu || showExportMenu) && (
            <div className="flex flex-wrap items-center gap-2">
              {showDensityToggle && (
                <button
                  onClick={() => setDensity(density === 'compact' ? 'spacious' : 'compact')}
                  className={`py-1.5 px-3 rounded-xl border flex items-center space-x-1 text-xs font-medium transition-all ${
                    darkMode
                      ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                  title="Table Density"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="capitalize hidden sm:inline">{density}</span>
                </button>
              )}

              {showColumnsMenu && (
                <div className="relative">
                  <button
                    ref={columnMenuButtonRef}
                    onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                    className={`py-1.5 px-3 rounded-xl border flex items-center space-x-1 text-xs font-medium transition-all ${
                      darkMode
                        ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="hidden sm:inline">Columns</span>
                  </button>

                  {isColumnMenuOpen && (
                    <div
                      className={`absolute ${columnMenuAlign === 'right' ? 'right-0' : 'left-0'} mt-1.5 w-48 rounded-xl border shadow-xl z-30 p-2 space-y-1 ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <p className="text-xs font-semibold px-2 py-1 text-slate-400">Toggle Column Visibility</p>
                      <div className={`my-1 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
                      {activeColumns.map((col) => (
                        <label
                          key={col.key}
                          className={`flex items-center space-x-2 px-2 py-1 rounded-lg text-xs cursor-pointer ${
                            darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={columnVisibility[col.key] ?? true}
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
              )}

              {showExportMenu && (
                <div className="relative">
                  <button
                    onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                    className={`py-1.5 px-3 rounded-xl border flex items-center space-x-1 text-xs font-medium transition-all ${
                      darkMode
                        ? 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="hidden sm:inline">Export</span>
                  </button>

                  {isExportMenuOpen && (
                    <div
                      className={`absolute right-0 mt-1.5 w-44 rounded-xl border shadow-xl z-30 p-1.5 space-y-1 ${
                        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <button
                        onClick={exportCSV}
                        className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Export CSV</span>
                      </button>
                      <button
                        onClick={exportJSON}
                        className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <FileJson className="w-3.5 h-3.5 text-amber-500" />
                        <span>Export JSON</span>
                      </button>
                      <button
                        onClick={() => {
                          window.print();
                          setIsExportMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                          darkMode ? 'hover:bg-slate-800 text-slate-200' : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Printer className="w-3.5 h-3.5 text-blue-500" />
                        <span>Print Document</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bulk selection bar */}
        {selectable && selectedRows.size > 0 && (
          <div className="flex items-center justify-between bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-3 py-1.5 text-xs font-medium">
            <span className="text-indigo-600 dark:text-indigo-400">
              {selectedRows.size} {selectedRows.size === 1 ? 'record' : 'records'} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleBulkDeleteClick}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-2.5 py-1 rounded-lg transition-colors shadow-sm"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Selected</span>
              </button>
              <button
                onClick={() => setSelectedRows(new Set())}
                className={`px-2 py-1 rounded-lg border transition-colors ${
                  darkMode ? 'border-slate-700 hover:bg-slate-800' : 'border-slate-300 hover:bg-slate-100'
                }`}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
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
                {selectable && (
                  <th
                    ref={stickyRef('__select__')}
                    className={`py-2 px-3 w-10 ${getStickyProps('__select__').className} ${
                      darkMode ? 'bg-slate-900' : 'bg-slate-100'
                    }`}
                    style={getStickyProps('__select__').style}
                  >
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={paginatedData.length > 0 && paginatedData.every((d) => selectedRows.has(d[rowKey]))}
                      className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                  </th>
                )}
                {activeColumns.map((col) => {
                  if (columnVisibility[col.key] === false) return null;
                  const sticky = getStickyProps(col.key);
                  return (
                    <th
                      key={col.key}
                      ref={sticky.style ? stickyRef(col.key) : undefined}
                      onClick={() => col.sortable && handleSort(col.key)}
                      style={sticky.style}
                      className={`py-2 px-3.5 ${sticky.className} ${
                        sticky.style ? (darkMode ? 'bg-slate-900' : 'bg-slate-100') : ''
                      } ${col.sortable ? 'cursor-pointer select-none hover:text-indigo-500 transition-colors' : ''}`}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{col.label}</span>
                        {col.sortable && (
                          <span className="text-slate-400">
                            {sortConfig.key === col.key ? (
                              sortConfig.direction === 'asc' ? (
                                <ChevronUp className="w-3 h-3 text-indigo-600" />
                              ) : (
                                <ChevronDown className="w-3 h-3 text-indigo-600" />
                              )
                            ) : (
                              <ChevronsUpDown className="w-3 h-3 opacity-40" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className={`divide-y ${darkMode ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={activeColumns.length + (selectable ? 1 : 0)} className="py-8 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1.5">
                      <AlertCircle className="w-6 h-6 text-slate-400 stroke-[1.5]" />
                      <p className="text-sm font-medium">No records found matching criteria</p>
                      <p className="text-xs text-slate-500">Try adjusting your search term</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
                  const isSelected = selectedRows.has(row[rowKey]);
                  const isActive = activeRowId === row[rowKey];
                  const isHovered = hoveredRowId === row[rowKey];

                  const baseBg = isActive
                    ? darkMode
                      ? 'bg-indigo-950/80'
                      : 'bg-indigo-50'
                    : isSelected
                    ? darkMode
                      ? 'bg-indigo-950'
                      : 'bg-indigo-50/60'
                    : darkMode
                    ? 'bg-slate-900'
                    : 'bg-white';

                  const cellBg = isHovered
                    ? darkMode
                      ? 'bg-slate-800/60'
                      : 'bg-slate-50'
                    : baseBg;

                  const getCellSticky = (key) => {
                    const sticky = getStickyProps(key);
                    const isFirstCol = firstVisibleColKey === key;
                    const borderPseudo = isActive && isFirstCol ? 'relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-indigo-600' : '';
                    return {
                      style: sticky.style,
                      className: `${sticky.className} ${cellBg} ${borderPseudo}`.trim()
                    };
                  };

                  return (
                    <tr
                      key={row[rowKey]}
                      onClick={() => setActiveRowId(row[rowKey])}
                      onMouseEnter={() => setHoveredRowId(row[rowKey])}
                      onMouseLeave={() => setHoveredRowId(null)}
                      className={`cursor-pointer ${cellBg}`}
                    >
                      {selectable && (
                        <td
                          className={`py-1.5 px-3 ${getCellSticky('__select__').className}`}
                          style={getCellSticky('__select__').style}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectRow(row[rowKey]);
                            }}
                            className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                      )}

                      {activeColumns.map((col) => {
                        if (columnVisibility[col.key] === false) return null;

                        if (col.key === 'actions') {
                          return (
                            <td
                              key={col.key}
                              className={`${densityClass} ${getCellSticky(col.key).className}`}
                              style={getCellSticky(col.key).style}
                            >
                              <div className="flex items-center space-x-1">
                                {isViewActive && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onView(row);
                                    }}
                                    className={`p-1 rounded-lg transition-colors ${
                                      darkMode
                                        ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                        : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                                    }`}
                                    title="View Record"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {isEditActive && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onEdit(row);
                                    }}
                                    className={`p-1 rounded-lg transition-colors ${
                                      darkMode
                                        ? 'hover:bg-slate-800 text-slate-400 hover:text-indigo-400'
                                        : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-600'
                                    }`}
                                    title="Edit Record"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {isDeleteActive && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDelete(row);
                                    }}
                                    className={`p-1 rounded-lg transition-colors ${
                                      darkMode
                                        ? 'hover:bg-slate-800 text-slate-400 hover:text-red-400'
                                        : 'hover:bg-slate-100 text-slate-500 hover:text-red-600'
                                    }`}
                                    title="Delete Record"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td
                            key={col.key}
                            className={`${densityClass} ${getCellSticky(col.key).className}`}
                            style={getCellSticky(col.key).style}
                          >
                            {col.render
                              ? col.render(row[col.key], row)
                              : String(row[col.key] ?? '—')}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAndSortedData.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
}