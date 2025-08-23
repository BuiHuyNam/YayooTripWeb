import { Routes } from "@angular/router";
import { HeaderLayout } from "../layouts/pages/header-layout/header-layout";

export const USER_ROUTES: Routes = [
    // {path: '', component: Home},
    // {path: 'home', component: Home}
    {
         path: '',
            component: HeaderLayout,  
            children: [
              {
                path: '',
                loadComponent: () =>
                  import('./pages/home/home').then(m => m.Home), 
              },
              {
                path: 'home',
                loadComponent: () =>
                  import('./pages/home/home').then(m => m.Home),
              },
              {
                path: 'discovery',
                loadComponent: () =>
                  import('./pages/discovery/discovery').then(m => m.Discovery),
              },
                  {
                path: 'social',
                loadComponent: () =>
                  import('./pages/social/social').then(m => m. Social),
              },
            ],
    },
];