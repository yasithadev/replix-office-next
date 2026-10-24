/**
 * TableDataProcessor
 *
 * Owns ALL data-shaping logic for DataTable: searching, sorting and pagination.
 * DataTable never touches the raw data directly; it only calls `process()` and
 * renders what comes back.
 *
 * CONTRACT (keep this stable and DataTable never needs to change):
 *
 *   process({ searchQuery, sortConfig, page, pageSize })
 *     -> result | Promise<result>
 *
 *   result = {
 *     rows:       Array   // rows for the CURRENT page only
 *     totalItems: number  // total rows matching the search (all pages)
 *     totalPages: number
 *     exportRows: Array?  // optional: all matching rows, used by ExportMenu.
 *                         // If omitted, ExportMenu receives `rows`.
 *   }
 *
 * `process()` may return a plain object (client-side) or a Promise (server-side).
 * DataTable handles both.
 *
 * Client-side implementation below. To go server-side, replace the body of
 * `process()` with an API call that returns the same shape, e.g.:
 *
 *   async process({ searchQuery, sortConfig, page, pageSize }) {
 *     const params = new URLSearchParams({
 *       q: searchQuery,
 *       sortBy: sortConfig.key ?? '',
 *       sortDir: sortConfig.direction,
 *       page,
 *       pageSize
 *     });
 *     const res = await fetch(`/api/records?${params}`);
 *     const json = await res.json();
 *     return {
 *       rows: json.items,
 *       totalItems: json.total,
 *       totalPages: Math.ceil(json.total / pageSize) || 1
 *     };
 *   }
 */
export default class TableDataProcessor {
  constructor({ data = [], searchKeys = [] } = {}) {
    this.data = data;
    this.searchKeys = searchKeys;
  }

  // ---- Individual steps (client-side only; not part of the public contract) ----

  search(rows, searchQuery) {
    if (!searchQuery) return rows;
    const query = searchQuery.toLowerCase();
    return rows.filter((item) =>
      this.searchKeys.some((key) => String(item[key] ?? '').toLowerCase().includes(query))
    );
  }

  sort(rows, sortConfig) {
    if (!sortConfig?.key) return rows;
    const { key, direction } = sortConfig;
    const dir = direction === 'asc' ? 1 : -1;

    return [...rows].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return -1 * dir;
      if (aVal > bVal) return 1 * dir;
      return 0;
    });
  }

  paginate(rows, page, pageSize) {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }

  // ---- Public API ----

  process({
    searchQuery = '',
    sortConfig = { key: null, direction: 'asc' },
    page = 1,
    pageSize = 10
  } = {}) {
    const filtered = this.search(this.data, searchQuery);
    const sorted = this.sort(filtered, sortConfig);

    return {
      rows: this.paginate(sorted, page, pageSize),
      totalItems: sorted.length,
      totalPages: Math.ceil(sorted.length / pageSize) || 1,
      exportRows: sorted
    };
  }
}