import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchZoneById } from '@/lib/api';
import ZoneCard from '@/components/data/ZoneCard';
import { formatDate, formatLocation, truncate } from '@/lib/formatters';
import { ZONE_COLORS, MAP_TILES, MAP_ATTRIBUTION } from '@/utils/constants';

export default function ZoneDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchZoneById(id)
      .then((res) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1200px] mx-auto space-y-4">
          <div className="skeleton h-8 w-48" />
          <div className="skeleton h-40 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-dark-300 mb-4">Zone not found</p>
          <Link to="/" className="text-accent-light hover:underline text-sm no-underline">← Back to Map</Link>
        </div>
      </div>
    );
  }

  const { zone, accidents, totalAccidents } = data;
  const color = ZONE_COLORS[zone.alertLevel];

  return (
    <div className="flex-1 overflow-y-auto" id="zone-detail-page">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-dark-300">
          <Link to="/" className="hover:text-white transition-colors no-underline text-dark-300">Map</Link>
          <span>/</span>
          <span className="text-dark-100">Zone #{zone.id}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Zone Card + Mini Map */}
          <div className="lg:col-span-1 space-y-4">
            <ZoneCard zone={zone} />

            {/* Mini Map */}
            <div className="rounded-xl overflow-hidden border border-dark-500 h-[200px]">
              <MapContainer
                center={[zone.latitude, zone.longitude]}
                zoom={12}
                scrollWheelZoom={false}
                zoomControl={false}
                dragging={false}
                className="w-full h-full"
                style={{ background: '#0a0b0f' }}
              >
                <TileLayer attribution={MAP_ATTRIBUTION} url={MAP_TILES.dark} />
                <CircleMarker
                  center={[zone.latitude, zone.longitude]}
                  radius={20}
                  pathOptions={{ color, fillColor: color, fillOpacity: 0.3, weight: 2 }}
                />
              </MapContainer>
            </div>
          </div>

          {/* Right: Accidents List */}
          <div className="lg:col-span-2">
            <div className="rounded-xl bg-dark-700/80 border border-dark-500 overflow-hidden">
              <div className="px-5 py-3 border-b border-dark-500">
                <h3 className="text-sm font-semibold text-white">Accidents in this Zone</h3>
                <p className="text-xs text-dark-300">{totalAccidents} total records (showing first 100)</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-dark-500/50">
                      <th className="text-left px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Date</th>
                      <th className="text-left px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Location</th>
                      <th className="text-left px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Type</th>
                      <th className="text-center px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Deaths</th>
                      <th className="text-center px-4 py-3 text-dark-300 uppercase tracking-wider font-medium">Injuries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accidents?.length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-8 text-dark-300">No accidents found</td></tr>
                    ) : (
                      accidents?.map((a) => (
                        <tr key={a.id} className="border-b border-dark-600/30 hover:bg-dark-600/30 transition-colors">
                          <td className="px-4 py-3 text-dark-100 whitespace-nowrap">{formatDate(a.accidentDatetime)}</td>
                          <td className="px-4 py-3 text-dark-100 max-w-[200px]">{truncate(formatLocation(a.location), 30)}</td>
                          <td className="px-4 py-3 text-dark-200">{truncate(a.vehicleType?.name, 25) || '—'}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={a.deaths > 0 ? 'text-risk-red font-semibold' : 'text-dark-300'}>{a.deaths || 0}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={a.injuries > 0 ? 'text-risk-yellow font-semibold' : 'text-dark-300'}>{a.injuries || 0}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
