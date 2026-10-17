import { InjectionToken } from '@angular/core';

/** Base del API. Cadena vacía deja las rutas relativas para el proxy de producción. */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'http://127.0.0.1:8000',
});
