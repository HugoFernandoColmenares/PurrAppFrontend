import { MAX_TEXT_LENGTH } from '../models/speech.model';
import {
  speechTextError,
  toGenerateSpeechRequest,
} from './speech-request.mapper';

describe('speechTextError', () => {
  it('rejects blank text with the domain message', () => {
    expect(speechTextError('   ')).toBe('El texto no puede estar vacío.');
  });

  it('rejects text over the domain limit', () => {
    const text = 'a'.repeat(MAX_TEXT_LENGTH + 1);
    expect(speechTextError(text)).toBe(
      `El texto tiene ${MAX_TEXT_LENGTH + 1} caracteres. El máximo permitido es ${MAX_TEXT_LENGTH}.`,
    );
  });

  it('accepts trimmed text within the limit', () => {
    expect(speechTextError('  Hola  ')).toBeNull();
  });
});

describe('toGenerateSpeechRequest', () => {
  it('trims the text and omits an empty expression', () => {
    expect(toGenerateSpeechRequest('  Hola  ', 'Bella', null, true)).toEqual({
      text: 'Hola',
      voice: 'Bella',
      normalize: true,
    });
  });

  it('includes the expression when one is chosen', () => {
    expect(toGenerateSpeechRequest('Hola', 'Jasper', 'happy', false)).toEqual({
      text: 'Hola',
      voice: 'Jasper',
      expression: 'happy',
      normalize: false,
    });
  });
});
