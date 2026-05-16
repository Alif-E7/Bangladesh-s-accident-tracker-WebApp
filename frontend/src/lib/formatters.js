// Date formatting
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Number formatting
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  return num.toLocaleString('en-US');
}

export function formatPercent(num) {
  if (num === null || num === undefined) return '0%';
  return `${parseFloat(num).toFixed(1)}%`;
}

// Location formatting
export function formatLocation(location) {
  if (!location) return 'Unknown Location';
  if (typeof location === 'string') return location;
  return location.region || `${location.latitude?.toFixed(4)}, ${location.longitude?.toFixed(4)}`;
}

// Truncate text
export function truncate(text, maxLen = 50) {
  if (!text) return '';
  return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}

// Risk score formatting
export function formatRiskScore(score) {
  if (score === null || score === undefined) return '0';
  return parseFloat(score).toFixed(1);
}
