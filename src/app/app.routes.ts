import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/studio/studio.component').then(
        (module) => module.StudioComponent,
      ),
  },
];
