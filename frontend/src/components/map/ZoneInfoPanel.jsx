import { useState, useEffect } from 'react';
import { useMap as useMapContext } from '@/contexts/MapContext';
import { fetchZoneById } from '@/lib/api';
import { ZONE_COLORS, RISK_LABELS } from '@/utils/constants';
import { formatDate, formatLocation, truncate, formatNumber, formatRiskScore } from '@/lib/formatters';

export default function ZoneInfoPanel() {
  const { selectedZone, selectZone, setZoneAccidents, showAccidentsOnMap, setShowAccidentsOnMap } = useMapContext();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedZone) return;
    setLoading(true);
    fetchZoneById(selectedZone.id)
      .then((res) => {
        setData(res.data);
        if (res.data && res.data.accidents) {
          setZoneAccidents(res.data.accidents);
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selectedZone?.id, setZoneAccidents]);

  if (!selectedZone) return null;

  const color = ZONE_COLORS[selectedZone.alertLevel];
  const label = RISK_LABELS[selectedZone.alertLevel];
  const accidents = data?.accidents || [];

  return (
    <div className="absolute top-0 right-0 bottom-0 w-[380px] max-w-[90vw] z-[1001] animate-slide-right">
      <div className="h-full bg-dark-800/95 backdrop-blur-lg border-l border-dark-500/50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-dark-500/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 12px ${color}60` }}
              />
              <span className="text-sm font-bold" style={{ color }}>{label}</span>
              <span className="text-xs text-dark-300">Zone #{selectedZone.id}</span>
            </div>
            <button
              onClick={() => selectZone(null)}
              className="w-8 h-8 rounded-lg hover:bg-dark-600 flex items-center justify-center text-dark-300 hover:text-white transition-colors"
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>

          {/* Zone name */}
          {selectedZone.regionName && (
            <h3 className="text-base font-semibold text-white mb-3 leading-snug">{selectedZone.regionName}</h3>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <MiniStat label="Risk" value={formatRiskScore(selectedZone.riskScore)} color={color} />
            <MiniStat label="Accidents" value={formatNumber(selectedZone.accidentCount)} />
            <MiniStat label="Deaths" value={formatNumber(selectedZone.totalDeaths)} color="#ef4444" />
            <MiniStat label="Injuries" value={formatNumber(selectedZone.totalInjuries)} color="#f59e0b" />
          </div>

          {/* Toggle View Accidents on Map */}
          <div className="mt-4 flex items-center justify-between p-2 rounded-lg bg-dark-700/40 border border-dark-500/50">
            <span className="text-xs text-dark-200">Show accidents on map</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showAccidentsOnMap}
                onChange={(e) => setShowAccidentsOnMap(e.target.checked)}
              />
              <div className="w-9 h-5 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-dark-300 peer-checked:after:bg-accent after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent/20"></div>
            </label>
          </div>
        </div>

        {/* Accident List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-3 border-b border-dark-500/30 sticky top-0 bg-dark-800/95 backdrop-blur-sm">
            <p className="text-xs text-dark-300 font-medium">
              Accidents in this zone
              {!loading && <span className="text-dark-200 ml-1">({data?.totalAccidents || 0} total)</span>}
            </p>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-lg" />)}
            </div>
          ) : accidents.length === 0 ? (
            <div className="p-8 text-center text-dark-300 text-sm">No accident records found</div>
          ) : (
            <div className="p-2">
              {accidents.map((a) => (
                <AccidentCard key={a.id} accident={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color }) {
  return (
    <div className="text-center p-2 rounded-lg bg-dark-700/60">
      <div className="text-sm font-bold" style={{ color: color || 'white' }}>{value}</div>
      <div className="text-[9px] text-dark-400 uppercase mt-0.5">{label}</div>
    </div>
  );
}

function AccidentCard({ accident }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="mb-1.5 rounded-lg bg-dark-700/50 hover:bg-dark-700/80 border border-dark-500/30 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="px-3 py-2.5 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-dark-100 font-medium truncate">
            {truncate(formatLocation(accident.location), 40)}
          </p>
          <p className="text-[11px] text-dark-300 mt-0.5">
            {formatDate(accident.accidentDatetime)}
            {accident.vehicleType?.name && <span> · {truncate(accident.vehicleType.name, 25)}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {accident.deaths > 0 && (
            <span className="text-[11px] font-semibold text-risk-red">{accident.deaths}D</span>
          )}
          {accident.injuries > 0 && (
            <span className="text-[11px] font-semibold text-risk-yellow">{accident.injuries}I</span>
          )}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={`text-dark-400 transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-1.5 animate-fade-in border-t border-dark-500/20 pt-2">
          <DetailRow label="Weather" value={accident.weatherCondition?.name} />
          <DetailRow label="Victim" value={accident.victimCategory?.name} />
          <DetailRow label="Road" value={accident.roadCondition?.name} />
          <DetailRow label="Coords" value={`${accident.location?.latitude?.toFixed(4)}, ${accident.location?.longitude?.toFixed(4)}`} />
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-[11px]">
      <span className="text-dark-400 w-14 flex-shrink-0">{label}</span>
      <span className="text-dark-200">{value}</span>
    </div>
  );
}
