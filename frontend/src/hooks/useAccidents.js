import { useState, useEffect, useCallback } from 'react';
import { fetchAccidents } from '@/lib/api';
import { useFilters } from '@/contexts/FilterContext';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';

export function useAccidents(autoFetch = true) {
  const [accidents, setAccidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const { queryParams } = useFilters();

  const load = useCallback(async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAccidents({
        ...queryParams,
        page: pageNum,
        limit: DEFAULT_PAGE_SIZE,
      });
      setAccidents(res.data || []);
      setTotalPages(res.pages || 0);
      setTotal(res.total || 0);
      setPage(res.page || pageNum);
    } catch (err) {
      setError(err.message || 'Failed to fetch accidents');
    } finally {
      setLoading(false);
    }
  }, [queryParams, page]);

  useEffect(() => {
    if (autoFetch) {
      load(1);
    }
  }, [queryParams]);

  const goToPage = useCallback((p) => {
    load(p);
  }, [load]);

  return { accidents, loading, error, page, totalPages, total, goToPage, refetch: () => load(page) };
}
