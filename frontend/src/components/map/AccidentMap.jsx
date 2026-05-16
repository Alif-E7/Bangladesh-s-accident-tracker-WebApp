import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '@/utils/leafletFix';
import { useZones } from '@/hooks/useZones';
import { useMap as useMapContext } from '@/contexts/MapContext';
import ZoneMarker from './ZoneMarker';
import ZoneInfoPanel from './ZoneInfoPanel';
import MapOverlay from './MapOverlay';
import { BANGLADESH_CENTER, DEFAULT_ZOOM, BANGLADESH_BOUNDS, MAP_TILES, MAP_ATTRIBUTION, ZONE_COLORS } from '@/utils/constants';

function MapSync() {
  const map = useMap();
  const { center, zoom } = useMapContext();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 0.5 });
  }, [center, zoom, map]);
  return null;
}

function MapBounds() {
  const map = useMap();
  useEffect(() => {
    map.setMaxBounds(L.latLngBounds(BANGLADESH_BOUNDS));
    map.setMinZoom(6);
  }, [map]);
  return null;
}

function MapFixSize() {
  const map = useMap();
  useEffect(() => {
    // Sometimes Leaflet map doesn't calculate its size correctly initially in flex containers
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function AccidentMap() {
  const { zones, loading } = useZones();
  const { mapLayer, selectedZone, zoneAccidents, showAccidentsOnMap } = useMapContext();
  const tileUrl = MAP_TILES[mapLayer] || MAP_TILES.dark;

  // Zone level filter (toggle which colors to show)
  const [visibleLevels, setVisibleLevels] = useState({ RED: true, YELLOW: true, GREEN: true });

  const toggleLevel = (level) => {
    setVisibleLevels((prev) => ({ ...prev, [level]: !prev[level] }));
  };

  const filteredZones = zones.filter((z) => visibleLevels[z.alertLevel]);

  return (
    <div className="absolute inset-0" id="map-container">
      <MapContainer
        center={BANGLADESH_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
        style={{ background: '#0a0b0f' }}
      >
        <TileLayer attribution={MAP_ATTRIBUTION} url={tileUrl} />
        <MapSync />
        <MapBounds />
        <MapFixSize />
        {filteredZones.map((zone) => (
          <ZoneMarker key={zone.id} zone={zone} />
        ))}
        {/* Render individual accidents if a zone is selected AND toggle is ON */}
        {selectedZone && showAccidentsOnMap && zoneAccidents && zoneAccidents.map((acc) => (
          <CircleMarker
            key={`acc-${acc.id}`}
            center={[acc.location?.latitude || 0, acc.location?.longitude || 0]}
            radius={3}
            pathOptions={{
              color: acc.deaths > 0 ? '#ef4444' : acc.injuries > 0 ? '#f59e0b' : '#3b82f6',
              fillColor: acc.deaths > 0 ? '#ef4444' : acc.injuries > 0 ? '#f59e0b' : '#3b82f6',
              fillOpacity: 0.8,
              weight: 1
            }}
          >
            <Tooltip direction="top">
              <div className="text-xs">
                <p className="font-semibold">{acc.vehicleType?.name || 'Unknown Vehicle'}</p>
                <p>{acc.deaths} Deaths, {acc.injuries} Injuries</p>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* ===== OVERLAY CONTROLS ===== */}
      <MapOverlay visibleLevels={visibleLevels} toggleLevel={toggleLevel} />

      {/* ===== ZONE INFO PANEL (slides in when a zone is selected) ===== */}
      {selectedZone && <ZoneInfoPanel />}

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark-900/40 z-[1000] pointer-events-none">
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl glass shadow-2xl">
            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-white">Loading zones...</span>
          </div>
        </div>
      )}
    </div>
  );
}
