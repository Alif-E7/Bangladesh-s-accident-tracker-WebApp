import { createContext, useContext, useState, useCallback } from 'react';
import { BANGLADESH_CENTER, DEFAULT_ZOOM } from '@/utils/constants';

const MapContext = createContext(null);

export function MapProvider({ children }) {
  const [center, setCenter] = useState(BANGLADESH_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [selectedZone, setSelectedZone] = useState(null);
  const [zoneAccidents, setZoneAccidents] = useState([]); // Added state for zone accidents
  const [showAccidentsOnMap, setShowAccidentsOnMap] = useState(false);
  const [mapLayer, setMapLayer] = useState('dark'); // dark, light, satellite

  const panTo = useCallback((lat, lng, zoomLevel) => {
    setCenter([lat, lng]);
    if (zoomLevel) setZoom(zoomLevel);
  }, []);

  const selectZone = useCallback((zone) => {
    setSelectedZone(zone);
    setZoneAccidents([]); // Reset accidents when switching zones
    setShowAccidentsOnMap(false); // Reset toggle
    if (zone) {
      setCenter([zone.latitude, zone.longitude]);
      setZoom(11);
    }
  }, []);

  const resetView = useCallback(() => {
    setCenter(BANGLADESH_CENTER);
    setZoom(DEFAULT_ZOOM);
    setSelectedZone(null);
    setZoneAccidents([]);
    setShowAccidentsOnMap(false);
  }, []);

  return (
    <MapContext.Provider
      value={{
        center,
        zoom,
        selectedZone,
        zoneAccidents, // Expose
        showAccidentsOnMap,
        mapLayer,
        setCenter,
        setZoom,
        setZoneAccidents, // Expose
        setShowAccidentsOnMap,
        setMapLayer,
        panTo,
        selectZone,
        resetView,
      }}
    >
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within MapProvider');
  return ctx;
}
