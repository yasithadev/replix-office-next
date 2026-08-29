import React, { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react';
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

// Sticky-column layout constants. Columns can override their footprint via
// an optional `width` (px) on their column definition; unspecified columns
// fall back to DEFAULT_COLUMN_WIDTH. These only need to be reasonably close
// to the rendered width — sticky positioning tolerates small mismatches, it
// just won't line up pixel-perfectly with the column beneath it if actual
// content is much wider/narrower.
const CHECKBOX_COL_WIDTH = 44;
const DEFAULT_COLUMN_WIDTH = 160;

/**
 * DataTable
 * Fully self-contained and data-shape agnostic: owns search, sorting,
 * density, column visibility, export (CSV/JSON/print), row selection +
 * bulk delete, pagination, and column freezing. The parent only supplies
 * the raw dataset, column config, and callbacks for row-level actions and
 * bulk delete — no field-specific filter dropdowns are baked in, since
 * valid filter values are always data-specific. If a consumer needs
 * faceted filtering (e.g. by department/status), that's built in the
 * parent by filtering `data` before it's passed in.
 *
 * Props:
 *  - data: raw array of records (full, unfiltered)
 *  - columns: [{ key, label, sortable, width }] — also drives the Columns
 *    menu; `width` (px) is optional and only used to compute frozen-column
 *    offsets, default DEFAULT_COLUMN_WIDTH
 *  - rowKey: field used as each row's unique id (default 'id')
 *  - searchKeys: fields the search box matches against (default: all
 *    non-'actions' column keys)
 *  - darkMode: theme flag, controlled by the parent
 *  - selectable: whether to show the checkbox column + bulk-select bar
 *    (default true). Set false to hide row selection entirely. When true,
 *    the checkbox column is always frozen to the left automatically.
 *  - defaultPinnedColumns: array of column keys frozen to the left
 *    (default []). Fixed by the parent, not user-toggleable — frozen
 *    columns always stack in their original left-to-right column order
 *    and stay visible while the table scrolls horizontally.
 *  - defaultPinnedRightColumns: array of column keys frozen to the right
 *    (default []), e.g. ['actions']. Same rules as the left side, mirrored:
 *    fixed by the parent, and columns stack in their original column
 *    order with the last one in `columns` sitting flush against the true
 *    right edge. A key should only appear in one of the two pinned arrays
 *    — if it's in both, the left pin wins.
 *  - onView / onEdit / onDelete: (row) => void — row action callbacks
 *  - onBulkDelete: (ids: Array) => void — called with selected row ids;
 *    parent is responsible for actually removing them from `data`
 *  - exportFilenamePrefix: filename prefix for CSV/JSON export
 *  - showDensityToggle / showColumnsMenu / showExportMenu: individually
 *    hide these toolbar controls (all default true)
 *  - defaultPageSize / defaultSort: initial pagination + sort state
 */
export default function DataTable({
  data,
  columns,
  rowKey = 'id',
  searchKeys,
  darkMode = false,
  selectable = true,
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
  const [columnMenuAlign, setColumnMenuAlign] = useState('right'); // 'right' | 'left'
  const columnMenuButtonRef = useRef(null);
  const COLUMN_MENU_WIDTH = 192; // matches the panel's w-48

  // The panel normally hangs right-aligned off the button (right-0), so it
  // opens leftward. On narrow screens the toolbar wraps and this button can
  // end up close to the left edge, in which case opening leftward pushes
  // part of the panel past x=0 — clipped off-screen and invisible. Flip to
  // left-aligned (opens rightward instead) whenever there isn't enough room.
  useLayoutEffect(() => {
    if (!isColumnMenuOpen) return;
    const button = columnMenuButtonRef.current;
    if (!button) return;
    const rect = button.getBoundingClientRect();
    setColumnMenuAlign(rect.right - COLUMN_MENU_WIDTH < 0 ? 'left' : 'right');
  }, [isColumnMenuOpen]);

  const densityClass = getDensityClass(density);

  // Fixed by the parent via `defaultPinnedColumns` / `defaultPinnedRightColumns`
  // — not user-toggleable, so these are just aliases, not stateful.
  const pinnedColumns = defaultPinnedColumns;
  const pinnedRightColumns = defaultPinnedRightColumns;

  const columnByKey = useMemo(() => Object.fromEntries(columns.map((c) => [c.key, c])), [columns]);

  // Actual rendered width (px) of every frozen header cell. A plain
  // post-render measurement isn't enough on its own: layout can shift for
  // reasons that happen *outside* a React render entirely — most commonly
  // a web font finishing its swap-in after first paint (fallback-font
  // metrics vs. the real font), but also window resizes or a scrollbar
  // appearing. A ResizeObserver catches all of those, so pinned columns
  // stay flush against each other instead of drifting back into a gap.
  // Refs are only attached to cells that are currently pinned (see the ref
  // callbacks below), so this map only ever holds sizes for columns that
  // actually need one.
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

  // Also re-measure synchronously after every render (before paint), so a
  // brand-new pinned cell — or one whose content changed on this render —
  // is correct immediately rather than waiting for the observer to fire.
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

  // Left offset (px) for every column frozen to the left, keyed by column
  // key (the checkbox column uses the reserved key '__select__'). Offsets
  // are computed in the columns' original left-to-right order, so frozen
  // columns always stack the same way the table lays them out.
  const leftStickyOffsets = useMemo(() => {
    const offsets = {};
    let cursor = 0;
    if (selectable) {
      offsets.__select__ = cursor;
      cursor += widthFor('__select__');
    }
    columns.forEach((col) => {
      if (columnVisibility[col.key] && pinnedColumns.includes(col.key)) {
        offsets[col.key] = cursor;
        cursor += widthFor(col.key);
      }
    });
    return offsets;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, columnVisibility, pinnedColumns, selectable, measuredWidths]);

  // Right offset (px) for every column frozen to the right. Walked from the
  // end of `columns` backward so the last column in the table (visually
  // rightmost) sits flush against the true right edge, and any earlier
  // right-pinned columns stack progressively further left of it — same
  // left-to-right ordering rule as the left side, mirrored.
  const rightStickyOffsets = useMemo(() => {
    const offsets = {};
    let cursor = 0;
    for (let i = columns.length - 1; i >= 0; i--) {
      const col = columns[i];
      if (columnVisibility[col.key] && pinnedRightColumns.includes(col.key)) {
        offsets[col.key] = cursor;
        cursor += widthFor(col.key);
      }
    }
    return offsets;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, columnVisibility, pinnedRightColumns, measuredWidths]);

  // Divider shadow markers: the boundary between the frozen-left area and
  // the scrollable area sits on the left group's *largest* offset (i.e.
  // its rightmost member); the boundary for the frozen-right area sits on
  // the right group's *largest* offset too (i.e. its leftmost member,
  // since right offsets grow moving away from the true right edge).
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

  // Attach to the header <th> of a pinned column (checkbox uses '__select__')
  // so its rendered width can be measured, and kept in sync via the
  // ResizeObserver above for any layout shift that happens outside a React
  // render (font swap, resize, etc). Cheap no-op for non-pinned cells.
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
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs rounded-full p-1 ${
                  darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {(showDensityToggle || showColumnsMenu || showExportMenu) && (
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Density Toggle */}
              {showDensityToggle && (
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
            )}

            {/* Columns Visibility Menu */}
            {showColumnsMenu && (
              <div className="relative">
                <button
                  ref={columnMenuButtonRef}
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
                    className={`absolute ${columnMenuAlign === 'right' ? 'right-0' : 'left-0'} mt-2 w-48 rounded-xl border shadow-xl z-30 p-2 space-y-1 ${
                      darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <p className="text-xs font-semibold px-2 py-1 text-slate-400">Toggle Column Visibility</p>
                    <div className={`my-1 border-t ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}></div>
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
            )}

            {/* Export Menu */}
            {showExportMenu && (
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
            )}
          </div>
          )}
        </div>

        {/* Bulk selection bar */}
        {selectable && selectedRows.size > 0 && (
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
                {selectable && (
                  <th
                    ref={stickyRef('__select__')}
                    className={`py-3 px-4 w-10 ${getStickyProps('__select__').className} ${
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
                {columns.map((col) => {
                  if (!columnVisibility[col.key]) return null;
                  const sticky = getStickyProps(col.key);
                  return (
                    <th
                      key={col.key}
                      ref={sticky.style ? stickyRef(col.key) : undefined}
                      onClick={() => col.sortable && handleSort(col.key)}
                      style={sticky.style}
                      className={`py-3.5 px-4 ${sticky.className} ${
                        sticky.style ? (darkMode ? 'bg-slate-900' : 'bg-slate-100') : ''
                      } ${col.sortable ? 'cursor-pointer select-none hover:text-indigo-500 transition-colors' : ''}`}
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
                  );
                })}
              </tr>
            </thead>

            <tbody className={`divide-y ${darkMode ? 'divide-slate-800/80 text-slate-200' : 'divide-slate-100 text-slate-800'}`}>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center text-slate-400">
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
                  // Solid (non-translucent) background for frozen cells in this row — sticky
                  // cells need full opacity to actually hide content scrolling behind them.
                  const rowBg = isSelected
                    ? darkMode
                      ? 'bg-indigo-950'
                      : 'bg-indigo-50'
                    : darkMode
                    ? 'bg-slate-900'
                    : 'bg-white';
                  const getCellSticky = (key) => {
                    const sticky = getStickyProps(key);
                    return {
                      style: sticky.style,
                      className: sticky.style ? `${sticky.className} ${rowBg}` : ''
                    };
                  };
                  return (
                    <tr
                      key={row[rowKey]}
                      className={`transition-colors hover:bg-indigo-500/5 ${
                        isSelected ? (darkMode ? 'bg-indigo-950/20' : 'bg-indigo-50/60') : ''
                      }`}
                    >
                      {selectable && (
                        <td
                          className={`py-3 px-4 ${getCellSticky('__select__').className}`}
                          style={getCellSticky('__select__').style}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(row[rowKey])}
                            className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                      )}

                      {columnVisibility.id && (
                        <td
                          className={`${densityClass} font-mono font-medium text-xs text-indigo-500 ${getCellSticky('id').className}`}
                          style={getCellSticky('id').style}
                        >
                          {row.id}
                        </td>
                      )}

                      {columnVisibility.name && (
                        <td className={`${densityClass} ${getCellSticky('name').className}`} style={getCellSticky('name').style}>
                          <div className="flex items-center space-x-3">
                            <img
                              src={row.avatar}
                              alt={row.name}
                              className={`w-8 h-8 rounded-full object-cover border ${
                                darkMode ? 'border-slate-700' : 'border-slate-200'
                              }`}
                            />
                            <div>
                              <p className="font-semibold text-xs sm:text-sm leading-snug">{row.name}</p>
                              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{row.email}</p>
                            </div>
                          </div>
                        </td>
                      )}

                      {columnVisibility.role && (
                        <td className={`${densityClass} ${getCellSticky('role').className}`} style={getCellSticky('role').style}>
                          <span className="font-medium">{row.role}</span>
                        </td>
                      )}

                      {columnVisibility.department && (
                        <td className={`${densityClass} ${getCellSticky('department').className}`} style={getCellSticky('department').style}>
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
                        <td className={`${densityClass} ${getCellSticky('status').className}`} style={getCellSticky('status').style}>
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
                        <td
                          className={`${densityClass} font-mono font-medium ${getCellSticky('salary').className}`}
                          style={getCellSticky('salary').style}
                        >
                          ${row.salary.toLocaleString()}
                        </td>
                      )}

                      {columnVisibility.performance && (
                        <td className={`${densityClass} ${getCellSticky('performance').className}`} style={getCellSticky('performance').style}>
                          <div className="flex items-center space-x-2">
                            <div className={`w-16 rounded-full h-1.5 overflow-hidden ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
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
                        <td
                          className={`${densityClass} text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} ${getCellSticky('joinDate').className}`}
                          style={getCellSticky('joinDate').style}
                        >
                          {row.joinDate}
                        </td>
                      )}

                      {columnVisibility.actions && (
                        <td className={`${densityClass} ${getCellSticky('actions').className}`} style={getCellSticky('actions').style}>
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
              <span className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {filteredAndSortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                {Math.min(currentPage * pageSize, filteredAndSortedData.length)}
              </span>{' '}
              of <span className={`font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{filteredAndSortedData.length}</span> results
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