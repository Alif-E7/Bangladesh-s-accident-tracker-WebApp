// Zone alert level colors
export const ZONE_COLORS = {
  RED: '#ef4444',
  YELLOW: '#f59e0b',
  GREEN: '#22c55e',
};

export const ZONE_GLOW = {
  RED: 'rgba(239, 68, 68, 0.4)',
  YELLOW: 'rgba(245, 158, 11, 0.3)',
  GREEN: 'rgba(34, 197, 94, 0.3)',
};

// Bangladesh geographic bounds
export const BANGLADESH_CENTER = [23.685, 90.3563];
export const BANGLADESH_BOUNDS = [
  [20.5, 87.9],
  [26.6, 92.7],
];
export const DEFAULT_ZOOM = 7;

// Risk level labels
export const RISK_LABELS = {
  RED: 'High Risk',
  YELLOW: 'Medium Risk',
  GREEN: 'Low Risk',
};

// Zone marker sizes (radius in pixels)
export const ZONE_SIZES = {
  RED: 14,
  YELLOW: 10,
  GREEN: 7,
};

// Peak periods
export const PEAK_PERIODS = ['Morning', 'Afternoon', 'Evening', 'Night'];

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Map tile URLs
export const MAP_TILES = {
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  light: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
};

export const MAP_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';
