import { EXPRESSIONS } from '../models/speech-catalog.model';

const EXPRESSION_LABELS = new Map<string, string>(
  EXPRESSIONS.flatMap((item) =>
    item.value === null ? [] : [[item.value, item.label] as const],
  ),
);

export function expressionLabel(value: string): string {
  return EXPRESSION_LABELS.get(value) ?? value;
}

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
