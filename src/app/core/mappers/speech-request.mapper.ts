import {
  GenerateSpeechRequest,
  MAX_TEXT_LENGTH,
} from '../models/speech.model';

export function cleanedSpeechText(text: string): string {
  return text.trim();
}

/** Mismos textos que el dominio del backend, sobre el texto ya recortado. */
export function speechTextError(text: string): string | null {
  const cleaned = cleanedSpeechText(text);
  if (!cleaned) {
    return 'El texto no puede estar vacío.';
  }
  if (cleaned.length > MAX_TEXT_LENGTH) {
    return `El texto tiene ${cleaned.length} caracteres. El máximo permitido es ${MAX_TEXT_LENGTH}.`;
  }
  return null;
}

export function toGenerateSpeechRequest(
  text: string,
  voice: string,
  expression: string | null,
  normalize: boolean,
): GenerateSpeechRequest {
  const request: GenerateSpeechRequest = {
    text: cleanedSpeechText(text),
    voice,
    normalize,
  };
  if (expression) {
    request.expression = expression;
  }
  return request;
}
