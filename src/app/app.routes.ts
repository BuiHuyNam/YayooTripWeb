// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m=>m.ADMIN_ROUTES),
  },
  {
    path: '',
    loadChildren:() => import('./user/user.routes').then(m=>m.USER_ROUTES),
  },
  // Trang root "/" (tuỳ bạn)
  {
    path: '',
    loadComponent: () => import('./app').then(m => m.App),
  },
  { path: '**', redirectTo: '' },
];
