import { useAccidents } from '@/hooks/useAccidents';
import { formatDate, formatLocation, truncate } from '@/lib/formatters';

export default function AccidentTable() {
  const { accidents, loading, page, totalPages, total, goToPage } = useAccidents();

  if (loading) {
    return (
      <div className="rounded-xl bg-dark-700/80 border border-dark-500 p-6" id="accident-table">
        <div className="skeleton h-8 w-48 mb-4" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-12 w-full mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-dark-700/80 border border-dark-500 overflow-hidden" id="accident-table">
      {/* Header */}
      <div className="px-5 py-3 border-b border-dark-500 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Accident Records</h3>
          <p className="text-xs text-dark-300">{total.toLocaleString()} total records</p>
        </div>
        <span className="text-xs text-dark-300">Page {page} of {totalPages}</span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-dark-500/50">
              <th className="text-left px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Date</th>
              <th className="text-left px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Location</th>
              <th className="text-left px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Type</th>
              <th className="text-center px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Deaths</th>
              <th className="text-center px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Injuries</th>
              <th className="text-left px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Weather</th>
              <th className="text-left px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Victim</th>
            </tr>
          </thead>
          <tbody>
            {accidents.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-dark-300">No accidents found matching filters</td>
              </tr>
            ) : (
              accidents.map((accident) => (
                <tr
                  key={accident.id}
                  className="border-b border-dark-600/30 hover:bg-dark-600/30 transition-colors"
                >
                  <td className="px-4 py-3 text-dark-100 whitespace-nowrap">{formatDate(accident.accidentDatetime)}</td>
                  <td className="px-4 py-3 text-dark-100 max-w-[200px]">
                    <span title={formatLocation(accident.location)}>{truncate(formatLocation(accident.location), 35)}</span>
                  </td>
                  <td className="px-4 py-3 text-dark-200">{truncate(accident.vehicleType?.name, 25) || '—'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={accident.deaths > 0 ? 'text-risk-red font-semibold' : 'text-dark-300'}>
                      {accident.deaths || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={accident.injuries > 0 ? 'text-risk-yellow font-semibold' : 'text-dark-300'}>
                      {accident.injuries || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark-200">{accident.weatherCondition?.name || '—'}</td>
                  <td className="px-4 py-3 text-dark-200">{truncate(accident.victimCategory?.name, 20) || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-dark-500 flex items-center justify-between">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 text-xs rounded-lg bg-dark-600 border border-dark-500 text-dark-200 hover:text-white hover:bg-dark-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <div className="flex gap-1">
            {generatePageNumbers(page, totalPages).map((p, i) => (
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-xs text-dark-300">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                    p === page
                      ? 'bg-accent text-white'
                      : 'bg-dark-600 text-dark-200 hover:text-white hover:bg-dark-500'
                  }`}
                >
                  {p}
                </button>
              )
            ))}
          </div>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 text-xs rounded-lg bg-dark-600 border border-dark-500 text-dark-200 hover:text-white hover:bg-dark-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function generatePageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = [];
  if (current <= 3) {
    pages.push(1, 2, 3, 4, '...', total);
  } else if (current >= total - 2) {
    pages.push(1, '...', total - 3, total - 2, total - 1, total);
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total);
  }
  return pages;
}
