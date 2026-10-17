import { InjectionToken, isDevMode } from '@angular/core';

/**
 * Base del API.
 * En `ng serve` apunta al proceso local. El build de producción deja la
 * cadena vacía para que el navegador llame a `/api/...` en el mismo origen
 * y nginx reenvíe esas rutas al backend.
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => (isDevMode() ? 'http://127.0.0.1:8000' : ''),
});
