import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const FilterContext = createContext(null);

const INITIAL_FILTERS = {
  location: '',
  startDate: '',
  endDate: '',
  zoneLevel: [], // RED, YELLOW, GREEN
  weather: '',
  vehicleType: '',
  victimCategory: '',
  roadCondition: '',
  trafficControl: '',
  peakPeriod: '',
  lightCondition: '',
  roadClassification: '',
  placeCharacteristic: '',
  trafficCondition: '',
  junction: '',
  year: '',
  month: '',
  minDeaths: '',
  maxDeaths: '',
  minInjuries: '',
  maxInjuries: '',
  // Geospatial
  lat: '',
  lng: '',
  radiusKm: '',
};

export function FilterProvider({ children }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);

  const setFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
  }, []);

  const toggleZoneLevel = useCallback((level) => {
    setFilters((prev) => {
      const levels = prev.zoneLevel.includes(level)
        ? prev.zoneLevel.filter((l) => l !== level)
        : [...prev.zoneLevel, level];
      return { ...prev, zoneLevel: levels };
    });
  }, []);

  // Build query params for API calls (omit empty values)
  const queryParams = useMemo(() => {
    const params = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'zoneLevel') return; // handled separately in zone fetch
      if (value !== '' && value !== null && value !== undefined) {
        params[key] = value;
      }
    });
    return params;
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'zoneLevel' && value.length > 0 && value.length < 3) count++;
      else if (value !== '' && value !== null && value !== undefined && key !== 'zoneLevel') count++;
    });
    return count;
  }, [filters]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilter,
        clearFilters,
        toggleZoneLevel,
        queryParams,
        activeFilterCount,
        isAdvancedMode,
        setIsAdvancedMode,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error('useFilters must be used within FilterProvider');
  return ctx;
}
