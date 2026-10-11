import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function getPaginationRange(current, total, siblingCount = 1) {
  const totalSlots = siblingCount * 2 + 5;

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

export default function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  siblingCount = 1,
  darkMode = false
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  const strongClass = `font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`;
  const navButtonClass = `p-1.5 rounded-lg border text-xs flex items-center space-x-1 disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
    darkMode ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-200 hover:bg-slate-100'
  }`;

  return (
    <div
      className={`px-3 py-2 border-t flex flex-col sm:flex-row items-center justify-between gap-3 ${
        darkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50/50'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          Showing{' '}
          <span className={strongClass}>
            {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to <span className={strongClass}>{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
          <span className={strongClass}>{totalItems}</span> results
        </span>

        {onPageSizeChange && (
          <div className="flex items-center space-x-1">
            <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={`px-1.5 py-0.5 text-xs rounded-lg border outline-none cursor-pointer ${
                darkMode ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              {pageSizeOptions.map((sz) => (
                <option key={sz} value={sz}>
                  {sz}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={navButtonClass}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center space-x-0.5 px-0.5">
          {paginationRange.map((pageNum, idx) =>
            typeof pageNum === 'number' ? (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-6 h-6 rounded-lg text-xs font-medium transition-colors ${
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
                className={`w-6 h-6 flex items-center justify-center text-xs select-none ${
                  darkMode ? 'text-slate-600' : 'text-slate-400'
                }`}
              >
                …
              </span>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={navButtonClass}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}