export const MAX_TEXT_LENGTH = 500;

export const UNREACHABLE_MESSAGE = 'No se pudo contactar el servicio.';

export interface GenerateSpeechRequest {
  text: string;
  voice: string;
  expression?: string;
  normalize: boolean;
}

export interface AudioTrackResponse {
  id: string;
  text: string;
  voice: string;
  expression: string | null;
  duration_seconds: number;
  sample_rate: number;
  format: string;
  created_at: string;
  download_url: string;
}
