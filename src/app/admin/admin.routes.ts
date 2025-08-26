
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
      { path: 'users', loadComponent: () => import('./pages/user-management/user-management').then(m => m.UserManagement) },
      // { path: 'roles',        loadComponent: () => import('./pages/roles/roles').then(m => m.Roles) },
      { path: 'destinations', loadComponent: () => import('./pages/destination/destination').then(m => m.Destinations) },
      // { path: 'services',     loadComponent: () => import('./pages/services/services').then(m => m.Services) },
    ],
  },
];
