
import { Routes } from '@angular/router';
import { AdminLayout } from '../layouts/pages/admin-layout/admin-layout';


export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayout,  
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.Dashboard), // /admin -> Dashboard
      },
       {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard').then(m => m.Dashboard), // /admin -> Dashboard
      },
      // ví dụ thêm trang con:
      // { path: 'users',        loadComponent: () => import('./pages/users/users').then(m => m.Users) },
      // { path: 'roles',        loadComponent: () => import('./pages/roles/roles').then(m => m.Roles) },
      // { path: 'destinations', loadComponent: () => import('./pages/destinations/destinations').then(m => m.Destinations) },
      // { path: 'services',     loadComponent: () => import('./pages/services/services').then(m => m.Services) },
    ],
  },
];
