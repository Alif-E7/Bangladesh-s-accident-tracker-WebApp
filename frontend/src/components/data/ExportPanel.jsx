import { useExport } from '@/hooks/useExport';
import { useFilters } from '@/contexts/FilterContext';

export default function ExportPanel() {
  const { downloadCSV, downloadJSON } = useExport();
  const { activeFilterCount, queryParams } = useFilters();

  return (
    <div className="rounded-xl bg-dark-700/80 border border-dark-500 p-5" id="export-panel">
      <h3 className="text-sm font-semibold text-white mb-1">Export Data</h3>
      <p className="text-xs text-dark-300 mb-4">
        Download filtered accident data
        {activeFilterCount > 0 && (
          <span className="text-accent-light"> ({activeFilterCount} active filters)</span>
        )}
      </p>

      <div className="flex gap-3">
        <button
          onClick={downloadCSV}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-dark-600 border border-dark-500 text-sm text-dark-100 hover:text-white hover:bg-dark-500 hover:border-dark-400 transition-all"
          id="export-csv"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 14h8a1 1 0 001-1V5l-4-4H4a1 1 0 00-1 1v11a1 1 0 001 1z" stroke="currentColor" strokeWidth="1.2"/><path d="M9 1v4h4" stroke="currentColor" strokeWidth="1.2"/></svg>
          CSV
        </button>
        <button
          onClick={downloadJSON}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-dark-600 border border-dark-500 text-sm text-dark-100 hover:text-white hover:bg-dark-500 hover:border-dark-400 transition-all"
          id="export-json"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M5 3H3.5A1.5 1.5 0 002 4.5v2A1.5 1.5 0 013.5 8 1.5 1.5 0 012 9.5v2A1.5 1.5 0 003.5 13H5" stroke="currentColor" strokeWidth="1.2"/><path d="M11 3h1.5A1.5 1.5 0 0114 4.5v2A1.5 1.5 0 0112.5 8 1.5 1.5 0 0114 9.5v2a1.5 1.5 0 01-1.5 1.5H11" stroke="currentColor" strokeWidth="1.2"/></svg>
          JSON
        </button>
      </div>
    </div>
  );
}
