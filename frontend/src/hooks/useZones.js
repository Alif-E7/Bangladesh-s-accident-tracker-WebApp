import { useState, useEffect } from 'react';
import { fetchZones } from '@/lib/api';
import { useFilters } from '@/contexts/FilterContext';

export function useZones() {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { filters } = useFilters();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = {};
        if (filters.zoneLevel.length === 1) {
          params.level = filters.zoneLevel[0];
        }
        const res = await fetchZones(params);
        if (!cancelled) {
          let data = res.data || [];
          // Client-side zone level filtering if multiple levels selected
          if (filters.zoneLevel.length > 0 && filters.zoneLevel.length < 3) {
            data = data.filter((z) => filters.zoneLevel.includes(z.alertLevel));
          }
          setZones(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to fetch zones');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [filters.zoneLevel]);

  return { zones, loading, error, refetch: () => {} };
}
