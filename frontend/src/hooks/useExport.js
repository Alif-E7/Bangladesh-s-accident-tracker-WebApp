import { useCallback } from 'react';
import { exportCSV, exportJSON } from '@/lib/api';
import { useFilters } from '@/contexts/FilterContext';

export function useExport() {
  const { queryParams } = useFilters();

  const downloadCSV = useCallback(() => {
    exportCSV(queryParams);
  }, [queryParams]);

  const downloadJSON = useCallback(() => {
    exportJSON(queryParams);
  }, [queryParams]);

  return { downloadCSV, downloadJSON };
}
