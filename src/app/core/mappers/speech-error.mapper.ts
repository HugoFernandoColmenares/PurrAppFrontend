import { HttpErrorResponse } from '@angular/common/http';

import { UNREACHABLE_MESSAGE } from '../models/speech.model';

export function speechErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    const detail = error.error?.detail;
    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }
  }
  return UNREACHABLE_MESSAGE;
}
