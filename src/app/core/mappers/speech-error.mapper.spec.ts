import { HttpErrorResponse } from '@angular/common/http';

import { speechErrorMessage } from './speech-error.mapper';

describe('speechErrorMessage', () => {
  it('shows the API detail', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { detail: 'El texto no puede estar vacío.' },
    });
    expect(speechErrorMessage(error)).toBe('El texto no puede estar vacío.');
  });

  it('uses the interface message when the service cannot be reached', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(speechErrorMessage(error)).toBe('No se pudo contactar el servicio.');
  });
});
