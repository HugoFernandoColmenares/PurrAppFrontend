export interface VoiceOption {
  value: string;
  tone: string;
}

export interface ExpressionOption {
  value: string | null;
  label: string;
}

export const VOICES: readonly VoiceOption[] = [
  { value: 'Bella', tone: 'Voz femenina' },
  { value: 'Jasper', tone: 'Voz masculina' },
  { value: 'Luna', tone: 'Voz femenina' },
  { value: 'Bruno', tone: 'Voz masculina' },
  { value: 'Rosie', tone: 'Voz femenina' },
  { value: 'Hugo', tone: 'Voz masculina' },
  { value: 'Kiki', tone: 'Voz femenina' },
  { value: 'Leo', tone: 'Voz masculina' },
];

export const EXPRESSIONS: readonly ExpressionOption[] = [
  { value: null, label: 'Sin etiqueta' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'happy', label: 'Alegre' },
  { value: 'calm', label: 'Calma' },
  { value: 'energetic', label: 'Enérgica' },
  { value: 'sad', label: 'Triste' },
];

const EXPRESSION_LABELS = new Map<string, string>(
  EXPRESSIONS.flatMap((item) =>
    item.value === null ? [] : [[item.value, item.label] as const],
  ),
);

export function expressionLabel(value: string): string {
  return EXPRESSION_LABELS.get(value) ?? value;
}
