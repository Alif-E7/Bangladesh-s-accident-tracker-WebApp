import { ZONE_COLORS, RISK_LABELS } from '@/utils/constants';
import { formatNumber, formatRiskScore } from '@/lib/formatters';

export default function ZoneCard({ zone }) {
  if (!zone) return null;

  const color = ZONE_COLORS[zone.alertLevel];

  return (
    <div className="rounded-xl bg-dark-700/80 border border-dark-500 p-5 animate-fade-in" id="zone-card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}60` }} />
            <span className="text-sm font-semibold" style={{ color }}>{RISK_LABELS[zone.alertLevel]}</span>
          </div>
          {zone.regionName && (
            <h3 className="text-lg font-bold text-white">{zone.regionName}</h3>
          )}
          <p className="text-xs text-dark-300 mt-0.5">
            {zone.latitude?.toFixed(4)}, {zone.longitude?.toFixed(4)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold" style={{ color }}>{formatRiskScore(zone.riskScore)}</p>
          <p className="text-[10px] text-dark-300 uppercase">Risk Score</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatItem label="Accidents" value={formatNumber(zone.accidentCount)} icon="🚗" />
        <StatItem label="Deaths" value={formatNumber(zone.totalDeaths)} icon="💀" color="#ef4444" />
        <StatItem label="Injuries" value={formatNumber(zone.totalInjuries)} icon="🏥" color="#f59e0b" />
      </div>
    </div>
  );
}

function StatItem({ label, value, icon, color }) {
  return (
    <div className="text-center p-3 rounded-lg bg-dark-600/50">
      <div className="text-sm mb-0.5">{icon}</div>
      <div className="text-lg font-bold" style={{ color: color || 'white' }}>{value}</div>
      <div className="text-[10px] text-dark-300 uppercase">{label}</div>
    </div>
  );
}
