export function formatDuration(seconds: number): string {
  const formatted = new Intl.NumberFormat('es', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(seconds);
  return `${formatted} s`;
}

export function formatCreatedAt(iso: string): string {
  return new Intl.DateTimeFormat('es', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}
