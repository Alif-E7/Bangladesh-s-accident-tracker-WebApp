import { useState } from 'react';
import { formatDate, truncate, formatLocation } from '@/lib/formatters';
import api from '@/lib/api';

export default function SQLQueryBuilder() {
  const [query, setQuery] = useState('SELECT * FROM Accident LIMIT 50;');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const executeQuery = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await api.post('/accidents/query', { query });
      setResults(res);
    } catch (err) {
      setError(err.message || 'Query execution failed. Check your syntax.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Query Editor */}
      <div className="rounded-xl bg-dark-700/80 border border-dark-500 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-dark-500/50">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">SQL Query</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={executeQuery}
              disabled={loading || !query.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-risk-green hover:bg-risk-green/80 text-white text-xs font-medium transition-colors disabled:opacity-40"
              id="run-query"
            >
              {loading ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 2l7 4-7 4V2z" fill="currentColor"/></svg>
              )}
              Execute Query
            </button>
          </div>
        </div>

        <div className="flex">
          {/* SQL Editor */}
          <div className="flex-1">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-40 p-4 bg-transparent text-sm text-green-300 font-mono resize-none focus:outline-none placeholder-dark-400"
              placeholder="SELECT column1, column2 FROM table_name WHERE condition;"
              spellCheck={false}
              id="sql-editor"
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-risk-red/10 border border-risk-red/30 px-4 py-3 text-sm text-risk-red animate-fade-in">
          ⚠️ {error}
        </div>
      )}

      {/* Results */}
      {results && results.data && (
        <div className="rounded-xl bg-dark-700/80 border border-dark-500 overflow-hidden animate-fade-in">
          <div className="px-4 py-3 border-b border-dark-500/50 flex items-center justify-between">
            <span className="text-sm font-semibold text-white">
              Results
              <span className="text-dark-300 font-normal ml-2">({results.count} rows)</span>
            </span>
          </div>

          <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
            {results.data.length > 0 ? (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-dark-700">
                  <tr className="border-b border-dark-500/50">
                    {Object.keys(results.data[0]).map((key) => (
                      <th key={key} className="text-left px-3 py-2 text-dark-300 uppercase tracking-wider font-medium whitespace-nowrap">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.data.map((row, i) => (
                    <tr key={i} className="border-b border-dark-600/20 hover:bg-dark-600/20">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-3 py-2 text-dark-100 whitespace-nowrap">
                          {val !== null ? String(val) : 'NULL'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-4 text-dark-300 text-sm">No results found.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
