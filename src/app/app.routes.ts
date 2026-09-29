import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { HomeComponent } from './pages/home/home.component';
import { ActivarComponent } from './pages/activar/activar.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
  },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/mapa/mapa.component').then(m => m.MapaComponent),
  },
  {
    path: 'pasaporte',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/pasaporte/pasaporte.component').then(m => m.PasaporteComponent),
  },
  {
    path: 'activar',
    component: ActivarComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
