import { useState } from 'react';
import { useMap as useMapContext } from '@/contexts/MapContext';
import { ZONE_COLORS } from '@/utils/constants';

export default function MapOverlay({ visibleLevels, toggleLevel }) {
  const { mapLayer, setMapLayer, resetView, panTo } = useMapContext();
  const [showLayerPicker, setShowLayerPicker] = useState(false);

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => panTo(pos.coords.latitude, pos.coords.longitude, 13),
        () => {},
      );
    }
  };

  const zoneCount = { RED: 0, YELLOW: 0, GREEN: 0 }; // counts filled by parent if needed

  return (
    <>
      {/* ===== TOP-LEFT: Zone Legend & Toggle ===== */}
      <div className="absolute top-4 left-4 z-[1000]">
        <div className="rounded-2xl glass shadow-2xl p-3 space-y-1.5 min-w-[150px]">
          <p className="text-[10px] text-dark-200 uppercase tracking-wider font-semibold mb-2 px-1">Alert Zones</p>
          {[
            ['RED', 'High Risk', '🔴'],
            ['YELLOW', 'Medium Risk', '🟡'],
            ['GREEN', 'Low Risk', '🟢'],
          ].map(([level, label, emoji]) => (
            <button
              key={level}
              onClick={() => toggleLevel(level)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs transition-all ${
                visibleLevels[level]
                  ? 'bg-white/5 text-white'
                  : 'text-dark-400 line-through opacity-50'
              }`}
              id={`toggle-${level.toLowerCase()}`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-all"
                style={{
                  backgroundColor: visibleLevels[level] ? ZONE_COLORS[level] : 'transparent',
                  borderColor: ZONE_COLORS[level],
                  boxShadow: visibleLevels[level] ? `0 0 8px ${ZONE_COLORS[level]}60` : 'none',
                }}
              />
              <span className="flex-1 text-left">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ===== TOP-RIGHT: Map Controls ===== */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
        {/* Layer Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowLayerPicker(!showLayerPicker)}
            className="w-10 h-10 rounded-xl glass shadow-lg flex items-center justify-center text-dark-200 hover:text-white transition-colors"
            aria-label="Map style"
            title="Map style"
          >
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M8 1L1 5l7 4 7-4-7-4z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M1 8l7 4 7-4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M1 11l7 4 7-4" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          </button>
          {showLayerPicker && (
            <div className="absolute right-0 top-12 w-40 rounded-xl glass shadow-2xl py-1.5 animate-fade-in">
              {[['dark', '🌙 Dark'], ['light', '☀️ Light'], ['satellite', '🛰️ Satellite']].map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => { setMapLayer(key); setShowLayerPicker(false); }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors ${
                    mapLayer === key ? 'text-accent-light bg-accent/10' : 'text-dark-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* My Location */}
        <button
          onClick={handleMyLocation}
          className="w-10 h-10 rounded-xl glass shadow-lg flex items-center justify-center text-dark-200 hover:text-accent-light transition-colors"
          aria-label="My location"
          title="My location"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2"/><path d="M8 1v3M8 12v3M1 8h3M12 8h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
        </button>

        {/* Reset */}
        <button
          onClick={resetView}
          className="w-10 h-10 rounded-xl glass shadow-lg flex items-center justify-center text-dark-200 hover:text-white transition-colors"
          aria-label="Reset view"
          title="Reset view"
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 1011.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M2 3v5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </>
  );
}
