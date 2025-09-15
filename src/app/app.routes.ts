import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./view/home/home.page').then(m => m.HomePage),
  },
  {
    path: 'converter',
    loadComponent: () => import('./view/converter/converter.page').then(m => m.ConverterPage),
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];