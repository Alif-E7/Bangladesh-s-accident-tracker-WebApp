import { useState, useEffect } from 'react';
import { fetchStats } from '@/lib/api';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { ZONE_COLORS } from '@/utils/constants';

export default function StatsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4" id="stats-dashboard">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="skeleton h-64 rounded-xl" />
          <div className="skeleton h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { overview, zones, byWeather, byPeakPeriod } = stats;

  return (
    <div className="space-y-4" id="stats-dashboard">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Accidents"
          value={formatNumber(overview.totalAccidents)}
          icon="🚗"
          gradient="from-blue-500/20 to-blue-600/5"
          borderColor="border-blue-500/30"
        />
        <StatCard
          label="Total Deaths"
          value={formatNumber(overview.totalDeaths)}
          icon="💀"
          gradient="from-risk-red/20 to-risk-red/5"
          borderColor="border-risk-red/30"
          valueColor="text-risk-red"
        />
        <StatCard
          label="Total Injuries"
          value={formatNumber(overview.totalInjuries)}
          icon="🏥"
          gradient="from-risk-yellow/20 to-risk-yellow/5"
          borderColor="border-risk-yellow/30"
          valueColor="text-risk-yellow"
        />
        <StatCard
          label="Fatality Rate"
          value={formatPercent(overview.fatalityRate)}
          icon="📊"
          gradient="from-purple-500/20 to-purple-600/5"
          borderColor="border-purple-500/30"
          valueColor="text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Zone Distribution */}
        <div className="rounded-xl bg-dark-700/80 border border-dark-500 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Zone Distribution</h3>
          <div className="space-y-3">
            {['RED', 'YELLOW', 'GREEN'].map((level) => {
              const count = zones?.[level] || 0;
              const total = Object.values(zones || {}).reduce((s, v) => s + v, 0) || 1;
              const pct = ((count / total) * 100).toFixed(1);
              const labels = { RED: 'High Risk', YELLOW: 'Medium Risk', GREEN: 'Low Risk' };
              return (
                <div key={level}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ZONE_COLORS[level] }} />
                      <span className="text-dark-100">{labels[level]}</span>
                    </span>
                    <span className="text-dark-200">{count} zones ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-dark-600 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: ZONE_COLORS[level] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Peak Period */}
        <div className="rounded-xl bg-dark-700/80 border border-dark-500 p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Accidents by Peak Period</h3>
          <div className="space-y-2">
            {byPeakPeriod?.map((item) => {
              const maxCount = Math.max(...byPeakPeriod.map((p) => p.count));
              const pct = maxCount ? (item.count / maxCount) * 100 : 0;
              const periodIcons = { Morning: '🌅', Afternoon: '☀️', Evening: '🌇', Night: '🌙' };
              return (
                <div key={item.period} className="flex items-center gap-3">
                  <span className="text-xs w-20 text-dark-200 flex items-center gap-1">
                    <span>{periodIcons[item.period] || '⏰'}</span>
                    {item.period || 'Unknown'}
                  </span>
                  <div className="flex-1 h-5 rounded bg-dark-600 overflow-hidden">
                    <div
                      className="h-full rounded bg-gradient-to-r from-accent to-accent-light transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-dark-200 w-12 text-right">{formatNumber(item.count)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* By Weather */}
      <div className="rounded-xl bg-dark-700/80 border border-dark-500 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Accidents by Weather Condition</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {byWeather?.slice(0, 12).map((item) => {
            const weatherIcons = { Sunny: '☀️', Rainy: '🌧️', Foggy: '🌫️', Cloudy: '☁️', Stormy: '⛈️', Windy: '💨' };
            return (
              <div key={item.name} className="text-center p-3 rounded-lg bg-dark-600/50 hover:bg-dark-600 transition-colors">
                <div className="text-xl mb-1">{weatherIcons[item.name] || '🌤️'}</div>
                <div className="text-xs text-dark-100 font-medium">{item.name}</div>
                <div className="text-xs text-dark-300 mt-0.5">{formatNumber(item.count)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, gradient, borderColor, valueColor = 'text-white' }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${gradient} border ${borderColor} p-4 animate-fade-in`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-dark-300 uppercase tracking-wider mb-1">{label}</p>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}
