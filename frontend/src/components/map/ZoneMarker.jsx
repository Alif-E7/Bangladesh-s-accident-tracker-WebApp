import { Circle, Tooltip } from 'react-leaflet';
import { ZONE_COLORS, RISK_LABELS } from '@/utils/constants';
import { useMap as useMapContext } from '@/contexts/MapContext';

export default function ZoneMarker({ zone }) {
  const { selectZone } = useMapContext();
  const color = ZONE_COLORS[zone.alertLevel] || ZONE_COLORS.GREEN;
  const label = RISK_LABELS[zone.alertLevel] || 'Low Risk';

  // Radius in meters
  const radius = (zone.radiusKm || 0.5) * 1000;

  return (
    <Circle
      center={[zone.latitude, zone.longitude]}
      radius={radius}
      pathOptions={{
        color: color,
        fillColor: color,
        fillOpacity: zone.alertLevel === 'RED' ? 0.3 : zone.alertLevel === 'YELLOW' ? 0.2 : 0.15,
        weight: zone.alertLevel === 'RED' ? 2 : 1,
        opacity: 0.8,
        className: zone.alertLevel === 'RED' ? 'zone-pulse-red' : '',
      }}
      eventHandlers={{
        click: () => selectZone(zone),
        mouseover: (e) => {
          e.target.setStyle({ fillOpacity: 0.5, weight: 3 });
          e.target.bringToFront();
        },
        mouseout: (e) => {
          e.target.setStyle({
            fillOpacity: zone.alertLevel === 'RED' ? 0.3 : zone.alertLevel === 'YELLOW' ? 0.2 : 0.15,
            weight: zone.alertLevel === 'RED' ? 2 : 1,
          });
        },
      }}
    >
      <Tooltip
        direction="top"
        className="zone-tooltip"
      >
        <div style={{ fontFamily: "'Inter', sans-serif", minWidth: '140px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, display: 'inline-block', boxShadow: `0 0 6px ${color}` }}></span>
            <strong style={{ fontSize: '12px', color }}>{label}</strong>
          </div>
          {zone.regionName && <div style={{ fontSize: '11px', color: '#ccc', marginBottom: '4px' }}>{zone.regionName}</div>}
          <div style={{ fontSize: '11px', color: '#999' }}>
            {zone.accidentCount} accidents · {zone.totalDeaths} deaths · {zone.totalInjuries} injuries
          </div>
          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>Click to view details</div>
        </div>
      </Tooltip>
    </Circle>
  );
}
