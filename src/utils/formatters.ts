/**
 * Yamuna Organic Farms - Formatting Utilities
 */

// Formats paise into Indian Rupee string (₹)
export function formatINR(paise: number = 0): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(rupees);
}

// Compact Rupee formatter (e.g. ₹1.2L, ₹85k)
export function formatCompactINR(paise: number = 0): string {
  const rupees = paise / 100;
  if (Math.abs(rupees) >= 100000) {
    return `₹${(rupees / 100000).toFixed(1)}L`;
  }
  if (Math.abs(rupees) >= 1000) {
    return `₹${(rupees / 1000).toFixed(1)}k`;
  }
  return `₹${rupees.toFixed(0)}`;
}

// Formats weight in kilograms
export function formatKg(kg: number = 0): string {
  return `${Number(kg).toFixed(1)} kg`;
}

// Formats standard date for Indian business
export function formatDate(dateStr?: string): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function formatDateTime(isoStr?: string): string {
  if (!isoStr) return '—';
  try {
    const d = new Date(isoStr);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
  } catch {
    return isoStr;
  }
}

// Download data as CSV file
export function exportToCsv(filename: string, rows: (string | number)[][]) {
  const csvContent =
    'data:text/csv;charset=utf-8,' +
    rows.map(e => e.map(item => `"${String(item ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
